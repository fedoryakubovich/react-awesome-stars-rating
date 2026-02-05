import { fireEvent, render, screen } from '@testing-library/react';

import ReactStarsRating from '../lib';

const TEST_ID = 'react-awesome-stars-rating';

describe('Render', () => {
  test('ReactStarsRating', () => {
    render(<ReactStarsRating />);

    expect(screen.getByTestId(TEST_ID)).toBeInTheDocument();
  });
});

describe('Count stars', () => {
  test('Count stars is equal 5', () => {
    render(<ReactStarsRating count={5} />);

    expect(screen.getAllByTestId('star')).toHaveLength(5);
  });

  test('Count stars is equal 10', () => {
    render(<ReactStarsRating count={10} />);

    expect(screen.getAllByTestId('star')).toHaveLength(10);
  });
});

describe('Mouse onChange simulate', () => {
  describe('isEdit is equal true', () => {
    test('without isHalf', () => {
      const onChange = vi.fn();

      render(<ReactStarsRating count={5} isHalf={false} onChange={onChange} />);

      const star = screen.getAllByTestId('star')[2];
      const svgStar = star.querySelector('svg')!;
      fireEvent.click(svgStar);

      expect(onChange).toBeCalledWith(3);
    });

    test('with isHalf', () => {
      const onChange = vi.fn();

      render(<ReactStarsRating count={5} isHalf onChange={onChange} />);

      const star = screen.getAllByTestId('star')[2];
      const svgStar = star.querySelector('svg')!;
      fireEvent.click(svgStar);

      expect(onChange).toBeCalledWith(2.5);
    });

    test('onMouseOver', () => {
      const onChange = vi.fn();

      render(
        <ReactStarsRating
          count={5}
          isHalf={false}
          value={1}
          onChange={onChange}
        />,
      );
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-value', '1');

      const star = screen.getAllByTestId('star')[2];
      const svgStar = star.querySelector('svg')!;

      fireEvent.mouseMove(svgStar);
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-value', '3');

      fireEvent.mouseLeave(svgStar);
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-value', '1');
    });

    test('onMouseOver with half', () => {
      const onChange = vi.fn();

      render(<ReactStarsRating count={5} isHalf onChange={onChange} />);
      const star = screen.getAllByTestId('star')[2];
      const svgStar = star.querySelector('svg')!;

      fireEvent.mouseMove(svgStar);
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-value', '2.5');
    });
  });

  describe('isEdit is equal false', () => {
    test('without isHalf', () => {
      const onChange = vi.fn();

      render(
        <ReactStarsRating
          count={5}
          isHalf={false}
          isEdit={false}
          onChange={onChange}
        />,
      );

      const star = screen.getAllByTestId('star')[2];
      const svgStar = star.querySelector('svg')!;
      fireEvent.click(svgStar);

      expect(onChange).not.toBeCalled();
    });
  });
});

describe('Keyboard onChange simulate', () => {
  describe('isEdit is equal true', () => {
    test('without isHalf', () => {
      const onChange = vi.fn();

      const { container } = render(
        <ReactStarsRating
          id="simple"
          count={5}
          isHalf={false}
          value={1}
          onChange={onChange}
        />,
      );
      const element = container.querySelector('span#simple')!;

      fireEvent.keyDown(element, { key: 'ArrowRight' });
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-value', '2');

      fireEvent.keyDown(element, { key: 'ArrowRight' });
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-value', '3');

      fireEvent.keyDown(element, { key: 'ArrowLeft' });
      fireEvent.keyDown(element, { key: 'ArrowLeft' });
      fireEvent.keyDown(element, { key: 'Enter' });
      fireEvent.keyDown(element, { key: 'ArrowUp' });

      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-value', '1');
    });

    test('with isHalf and arrow submit', () => {
      const onChange = vi.fn();

      const { container } = render(
        <ReactStarsRating
          id="simple"
          count={5}
          isHalf
          value={1}
          isArrowSubmit
          onChange={onChange}
        />,
      );
      const element = container.querySelector('span#simple')!;

      fireEvent.keyDown(element, { key: 'ArrowRight' });
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-value', '1.5');

      fireEvent.keyDown(element, { key: 'ArrowLeft' });
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-value', '1');
    });
  });

  describe('Accessibility', () => {
    test('isSubmitted', () => {
      const { container } = render(
        <ReactStarsRating id="simple" count={5} isHalf={false} value={1} />,
      );
      const element = container.querySelector('span#simple')!;

      fireEvent.keyDown(element, { key: 'ArrowRight' });
      fireEvent.keyDown(element, { key: 'Tab' });
      fireEvent.blur(element);

      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-value', '2');
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute(
        'data-submitted',
        'true',
      );
    });

    test('aria-label defaults and aria-labelledby overrides', () => {
      const { rerender } = render(<ReactStarsRating id="aria" />);
      const element = screen.getByTestId(TEST_ID);
      expect(element).toHaveAttribute('aria-label', 'Star rating');
      expect(element).toHaveAttribute('role', 'slider');
      expect(element).toHaveAttribute('aria-valuemin', '0');
      expect(element).toHaveAttribute('aria-valuemax', '5');
      expect(element).toHaveAttribute('aria-valuenow', '0');

      rerender(
        <>
          <span id="label">Custom label</span>
          <ReactStarsRating id="aria" ariaLabelledBy="label" />
        </>,
      );
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute(
        'aria-labelledby',
        'label',
      );
    });
  });

  describe('componentDidUpdate', () => {
    test('Change value', () => {
      const { rerender } = render(
        <ReactStarsRating count={5} isHalf={false} value={3} />,
      );
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-value', '3');

      rerender(<ReactStarsRating value={4} />);
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-value', '4');
    });
  });

  describe('Arrow submit', () => {
    test('fires onChange when isArrowSubmit enabled', () => {
      const onChange = vi.fn();
      const { container } = render(
        <ReactStarsRating
          id="arrows"
          value={2}
          isHalf
          onChange={onChange}
          isArrowSubmit
        />,
      );
      const element = container.querySelector('span#arrows')!;

      fireEvent.keyDown(element, { key: 'ArrowRight' });
      expect(onChange).toHaveBeenCalledWith(2.5);
    });
  });
});
