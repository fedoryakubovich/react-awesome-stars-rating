import { render, screen, fireEvent } from '@testing-library/react';

import ReactAwesomeStarsRating from '../lib';

describe('ReactAwesomeStarsRating Component', () => {
  const defaultProps = {
    isEdit: true,
    isHalf: true,
    count: 5,
    value: 0,
    size: 25,
    primaryColor: 'orange',
    secondaryColor: 'grey',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with default props', () => {
    render(<ReactAwesomeStarsRating {...defaultProps} />);

    const container = screen.getByTestId('react-awesome-stars-rating');
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('role', 'button');
    expect(container).toHaveAttribute('tabindex', '0');

    const stars = screen.getAllByTestId('star');
    expect(stars).toHaveLength(5);
  });

  test('renders correct number of stars based on count prop', () => {
    render(<ReactAwesomeStarsRating {...defaultProps} count={3} />);
    expect(screen.getAllByTestId('star')).toHaveLength(3);
  });

  test('handles mouse interactions correctly', () => {
    render(<ReactAwesomeStarsRating {...defaultProps} isHalf={false} />);

    const stars = screen.getAllByTestId('star');
    const firstStar = stars[0].querySelector('svg');

    // Test mouse move
    fireEvent.mouseMove(firstStar!);
    expect(defaultProps.onChange).not.toHaveBeenCalled(); // onChange not called on mouseMove

    // Test click
    fireEvent.click(firstStar!);
    expect(defaultProps.onChange).toHaveBeenCalledWith(1);
  });

  test('handles half-star rating when isHalf is true', () => {
    render(<ReactAwesomeStarsRating {...defaultProps} />);

    const stars = screen.getAllByTestId('star');
    const firstStar = stars[0].querySelector('svg')!;

    // Mock getBoundingClientRect for half-star calculation
    firstStar.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      width: 25,
      height: 25,
      top: 0,
      right: 25,
      bottom: 25,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));

    // Click on left half (should be 0.5)
    fireEvent.mouseMove(firstStar, { clientX: 10 });
    fireEvent.click(firstStar, { clientX: 10 });
    expect(defaultProps.onChange).toHaveBeenCalledWith(0.5);

    // Click on right half (should be 1)
    fireEvent.mouseMove(firstStar, { clientX: 20 });
    fireEvent.click(firstStar, { clientX: 20 });
    expect(defaultProps.onChange).toHaveBeenCalledWith(1);
  });

  test('handles keyboard interactions', () => {
    render(<ReactAwesomeStarsRating {...defaultProps} />);

    const container = screen.getByTestId('react-awesome-stars-rating');

    // Right arrow increases rating
    fireEvent.keyDown(container, { key: 'ArrowRight' });
    expect(defaultProps.onChange).not.toHaveBeenCalled(); // Not called when isArrowSubmit is false

    // Left arrow decreases rating
    fireEvent.keyDown(container, { key: 'ArrowLeft' });
    expect(defaultProps.onChange).not.toHaveBeenCalled();

    // Enter submits rating
    fireEvent.keyDown(container, { key: 'Enter' });
    expect(defaultProps.onChange).toHaveBeenCalledWith(0);
  });

  test('handles keyboard interactions with isArrowSubmit', () => {
    render(<ReactAwesomeStarsRating {...defaultProps} isArrowSubmit />);

    const container = screen.getByTestId('react-awesome-stars-rating');

    // Right arrow increases rating
    fireEvent.keyDown(container, { key: 'ArrowRight' });
    expect(defaultProps.onChange).toHaveBeenCalledWith(0.5);

    // Left arrow decreases rating
    fireEvent.keyDown(container, { key: 'ArrowLeft' });
    expect(defaultProps.onChange).toHaveBeenCalledWith(0);
  });

  test('resets to initial value on mouse leave', () => {
    render(<ReactAwesomeStarsRating {...defaultProps} value={3} isHalf={false} />);

    const stars = screen.getAllByTestId('star');
    const container = screen.getByTestId('react-awesome-stars-rating');
    const firstStar = stars[0].querySelector('svg')!;

    // Hover over first star
    fireEvent.mouseMove(firstStar);
    expect(container).toHaveAttribute('data-value', '1');

    // Mouse leave from the star
    fireEvent.mouseLeave(firstStar);
    expect(container).toHaveAttribute('data-value', '3');
  });

  test('handles non-editable mode', () => {
    render(<ReactAwesomeStarsRating {...defaultProps} isEdit={false} />);

    const container = screen.getByTestId('react-awesome-stars-rating');
    expect(container).toHaveAttribute('tabindex', '-1');

    const stars = screen.getAllByTestId('star');
    fireEvent.click(stars[0].querySelector('svg')!);
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });

  test('handles submitted state', () => {
    render(<ReactAwesomeStarsRating {...defaultProps} value={3} isEdit={false} />);

    const container = screen.getByTestId('react-awesome-stars-rating');
    const stars = screen.getAllByTestId('star');

    // Shouldn't respond to keyboard after submission
    fireEvent.keyDown(container, { key: 'ArrowRight' });
    expect(defaultProps.onChange).not.toHaveBeenCalled();

    // Shouldn't respond to mouse interactions after submission
    fireEvent.mouseMove(stars[0].querySelector('svg')!);
    expect(container).toHaveAttribute('data-value', '3'); // Value should stay at 3

    // Shouldn't respond to clicks after submission
    fireEvent.click(stars[0].querySelector('svg')!);
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });

  test('handles blur event', () => {
    render(<ReactAwesomeStarsRating {...defaultProps} value={3} />);

    const container = screen.getByTestId('react-awesome-stars-rating');

    expect(container).toHaveAttribute('data-submitted', 'false');

    fireEvent.blur(container);
    expect(container).toHaveAttribute('data-submitted', 'true');
  });

  test('applies custom className and styles', () => {
    render(<ReactAwesomeStarsRating {...defaultProps} className="custom-class" starGap={10} />);

    const container = screen.getByTestId('react-awesome-stars-rating');
    expect(container).toHaveClass('custom-class');

    const stars = screen.getAllByTestId('star');
    expect(stars[0]).toHaveStyle('padding-right: 10px');
  });

  test('uses custom colors and size', () => {
    render(
      <ReactAwesomeStarsRating
        {...defaultProps}
        primaryColor="red"
        secondaryColor="blue"
        size={30}
      />,
    );

    const stars = screen.getAllByTestId('star');
    const svgs = stars.map((star) => star.querySelector('svg'));
    expect(svgs[0]).toHaveAttribute('width', '30');
  });
});
