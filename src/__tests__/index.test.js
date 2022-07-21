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
      const props = { count: 5, isHalf: false, onChange: jest.fn() };

      render(<ReactStarsRating {...props} />);

      const star = screen.getAllByTestId('star')[2];
      const svgStar = star.querySelector('svg');
      fireEvent.click(svgStar);

      expect(props.onChange).toBeCalledWith(3);
    });

    test('with isHalf', () => {
      const props = { count: 5, isHalf: true, onChange: jest.fn() };

      render(<ReactStarsRating {...props} />);

      const star = screen.getAllByTestId('star')[2];
      const svgStar = star.querySelector('svg');
      fireEvent.click(svgStar);

      expect(props.onChange).toBeCalledWith(2.5);
    });

    test('onMouseOver', () => {
      const props = {
        count: 5,
        isHalf: false,
        value: 1,
        onChange: jest.fn(),
      };

      render(<ReactStarsRating {...props} />);
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-value', '1');

      const star = screen.getAllByTestId('star')[2];
      const svgStar = star.querySelector('svg');

      fireEvent.mouseMove(svgStar);
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-value', '3');

      fireEvent.mouseLeave(svgStar);
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-value', '1');
    });

    test('onMouseOver', () => {
      const props = { countStars: 5, isHalf: true, onChange: jest.fn() };

      render(<ReactStarsRating {...props} />);
      const star = screen.getAllByTestId('star')[2];
      const svgStar = star.querySelector('svg');

      fireEvent.mouseMove(svgStar);
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-value', '2.5');
    });
  });

  describe('isEdit is equal false', () => {
    test('without isHalf', () => {
      const props = {
        count: 5,
        isHalf: false,
        isEdit: false,
        onChange: jest.fn(),
      };

      render(<ReactStarsRating {...props} />);

      const star = screen.getAllByTestId('star')[2];
      const svgStar = star.querySelector('svg');
      fireEvent.click(svgStar);

      expect(props.onChange).not.toBeCalled();
    });
  });
});

describe('Keyboard onChange simulate', () => {
  describe('isEdit is equal true', () => {
    test('without isHalf', () => {
      const props = {
        id: 'simple',
        countStars: 5,
        isHalf: false,
        value: 1,
        onChange: jest.fn(),
      };

      const { container } = render(<ReactStarsRating {...props} />);
      const elementId = `span#${props.id}`;

      fireEvent.keyDown(container.querySelector(elementId), { keyCode: 39 });
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-value', '2');

      fireEvent.keyDown(container.querySelector(elementId), { keyCode: 39 });
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-value', '3');

      fireEvent.keyDown(container.querySelector(elementId), { keyCode: 37 });
      fireEvent.keyDown(container.querySelector(elementId), { keyCode: 37 });
      fireEvent.keyDown(container.querySelector(elementId), { keyCode: 13 });
      fireEvent.keyDown(container.querySelector(elementId), { keyCode: 38 });

      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-value', '1');
    });

    test('without isHalf', () => {
      const props = {
        id: 'simple',
        count: 5,
        isHalf: true,
        value: 1,
        isArrowSubmit: true,
        onChange: jest.fn(),
      };

      const { container } = render(<ReactStarsRating {...props} />);
      const elementId = `span#${props.id}`;

      fireEvent.keyDown(container.querySelector(elementId), { keyCode: 39 });
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-value', '1.5');

      fireEvent.keyDown(container.querySelector(elementId), { keyCode: 37 });
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-value', '1');
    });
  });

  describe('Accessibility', () => {
    test('isSubmitted', () => {
      const props = {
        id: 'simple',
        count: 5,
        isHalf: false,
        value: 1,
        isArrowSubmit: false,
      };

      const { container } = render(<ReactStarsRating {...props} />);
      const elementId = `span#${props.id}`;

      fireEvent.keyDown(container.querySelector(elementId), { keyCode: 39 });
      fireEvent.keyDown(container.querySelector(elementId), { keyCode: 9 });
      fireEvent.blur(container.querySelector(elementId));

      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-value', '2');
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute(
        'data-submitted',
        'true',
      );
    });
  });

  describe('componentDidUpdate', () => {
    test('Change value', () => {
      const props = { count: 5, isHalf: false, value: 3 };

      const { rerender } = render(<ReactStarsRating {...props} />);
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-value', '3');

      rerender(<ReactStarsRating value={4} />);
      expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-value', '4');
    });
  });
});
