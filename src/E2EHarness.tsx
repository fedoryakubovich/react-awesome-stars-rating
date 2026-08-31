import { useState, type FormEvent } from 'react';

import ReactStarsRating from './lib';

const E2EHarness = () => {
  const [rating, setRating] = useState(1);
  const [changeCount, setChangeCount] = useState(0);
  const [formRating, setFormRating] = useState(2);
  const [submittedRating, setSubmittedRating] = useState<number | null>(null);

  const handleRatingChange = (nextValue: number) => {
    setRating(nextValue);
    setChangeCount((count) => count + 1);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedRating(formRating);
  };

  return (
    <main>
      <h1>Rating browser test harness</h1>
      <ReactStarsRating
        id="e2e-rating"
        value={rating}
        onChange={handleRatingChange}
        size={40}
        isHalf
      />
      <output data-testid="rating-value">{rating}</output>
      <output data-testid="change-count">{changeCount}</output>
      <button type="button">Next control</button>

      <ReactStarsRating
        id="readonly-rating"
        value={4}
        isEdit={false}
        isArrowSubmit
        ariaLabel="Read-only rating"
      />

      <form onSubmit={handleSubmit}>
        <ReactStarsRating
          id="form-rating"
          value={formRating}
          onChange={setFormRating}
          isHalf={false}
          ariaLabel="Form rating"
        />
        <button type="submit">Submit rating</button>
        <output data-testid="submitted-rating">
          {submittedRating ?? 'not submitted'}
        </output>
      </form>
    </main>
  );
};

export default E2EHarness;
