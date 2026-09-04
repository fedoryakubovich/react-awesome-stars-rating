import { useId, useRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReactStarsRating from '../lib';

function RequiredRatingRecipe() {
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState<number | null>(null);
  const ratingRef = useRef<HTMLSpanElement>(null);
  const errorId = useId();
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const invalid = rating === 0;
        setError(invalid);
        if (invalid) ratingRef.current?.focus();
        else setSubmitted(rating);
      }}
    >
      <ReactStarsRating
        ref={ratingRef}
        name="rating"
        value={rating}
        onChange={(value) => {
          setRating(value);
          setError(false);
        }}
        ariaLabel="Your rating (required)"
        aria-invalid={error || undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p id={errorId} role="alert">
          Choose a rating before submitting.
        </p>
      )}
      <button type="submit">Submit</button>
      <button type="button" onClick={() => setRating(0)}>
        Clear rating
      </button>
      <output data-testid="submitted">{submitted}</output>
    </form>
  );
}

test('required-rating recipe focuses, describes and clears its validation error', async () => {
  const user = userEvent.setup();
  render(<RequiredRatingRecipe />);
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  const rating = screen.getByRole('slider');
  expect(rating).toHaveFocus();
  expect(rating).toHaveAttribute('aria-invalid', 'true');
  expect(rating).toHaveAccessibleDescription(
    'Choose a rating before submitting.',
  );
  expect(screen.getByTestId('submitted')).toBeEmptyDOMElement();
  await user.keyboard('{ArrowRight}{Enter}');
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(rating).not.toHaveAttribute('aria-invalid');
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  expect(screen.getByTestId('submitted')).toHaveTextContent('0.5');
  await user.click(screen.getByRole('button', { name: 'Clear rating' }));
  expect(rating).toHaveAttribute('aria-valuenow', '0');
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  expect(screen.getByRole('alert')).toBeVisible();
});

test('average-rating recipe preserves fractional values without editing', async () => {
  const user = userEvent.setup();
  render(<ReactStarsRating value={4.3} readOnly ariaLabel="Average rating" />);
  const rating = screen.getByRole('slider', { name: 'Average rating' });
  expect(rating).toHaveAttribute('aria-valuenow', '4.3');
  expect(rating).toHaveAttribute('aria-readonly', 'true');
  await user.click(rating);
  await user.keyboard('{ArrowRight}');
  expect(rating).toHaveAttribute('aria-valuenow', '4.3');
});
