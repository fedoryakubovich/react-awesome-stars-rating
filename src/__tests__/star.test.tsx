import { render, screen, fireEvent } from '@testing-library/react';

import Star from '../lib/star';

describe('Tests for Star component', () => {
  const defaultProps = {
    index: 1,
    value: 3,
    fullId: 'full-gradient',
    halfId: 'half-gradient',
    noneId: 'none-gradient',
    primaryColor: 'gold',
    secondaryColor: 'gray',
    size: 24,
    onChange: jest.fn(),
    onMouseMove: jest.fn(),
    onMouseLeave: jest.fn(),
    isHalf: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with default props', () => {
    render(<Star {...defaultProps} />);

    const svgElement = screen.getByTestId('star-svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('width', '24');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 306 306');
    expect(svgElement).toHaveAttribute('data-stars', '1');
  });

  test('applies full fill when index <= value', () => {
    render(<Star {...defaultProps} index={2} value={3} />);

    const polygon = screen.getByTestId('star-polygon');
    expect(polygon).toHaveAttribute('fill', 'url(#full-gradient)');
  });

  test('applies half fill when isHalf and Math.ceil(value) === index', () => {
    render(<Star {...defaultProps} index={3} value={2.5} isHalf />);

    const polygon = screen.getByTestId('star-polygon');
    expect(polygon).toHaveAttribute('fill', 'url(#half-gradient)');
  });

  test('applies none fill when index > value', () => {
    render(<Star {...defaultProps} index={4} value={3} />);

    const polygon = screen.getByTestId('star-polygon');
    expect(polygon).toHaveAttribute('fill', 'url(#none-gradient)');
  });

  test('calls onChange when clicked', () => {
    render(<Star {...defaultProps} />);

    const svgElement = screen.getByTestId('star-svg');
    fireEvent.click(svgElement);
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  test('calls onMouseMove when hovered', () => {
    render(<Star {...defaultProps} />);

    const svgElement = screen.getByTestId('star-svg');
    fireEvent.mouseMove(svgElement);
    expect(defaultProps.onMouseMove).toHaveBeenCalledTimes(1);
  });

  test('calls onMouseLeave when mouse leaves', () => {
    render(<Star {...defaultProps} />);

    const svgElement = screen.getByTestId('star-svg');
    fireEvent.mouseLeave(svgElement);
    expect(defaultProps.onMouseLeave).toHaveBeenCalledTimes(1);
  });

  test('uses custom viewBox when provided', () => {
    render(<Star {...defaultProps} viewBox="0 0 100 100" />);

    const svgElement = screen.getByTestId('star-svg');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 100 100');
  });

  test('renders Gradient component with correct props', () => {
    render(<Star {...defaultProps} />);

    const gradientDefs = screen.getByTestId('gradient');
    expect(gradientDefs).toBeInTheDocument();
  });

  test('polygon has correct points', () => {
    render(<Star {...defaultProps} />);

    const polygon = screen.getByTestId('star-polygon');
    expect(polygon).toHaveAttribute(
      'points',
      '153,230.775 247.35,299.625 211.65,187.425 306,121.125 191.25,121.125 153,6.375 114.75,121.125 0,121.125 94.35,187.425 58.65,299.625',
    );
  });

  test('renders SVG with correct namespaces', () => {
    render(<Star {...defaultProps} />);

    const svgElement = screen.getByTestId('star-svg');
    expect(svgElement).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
    expect(svgElement).toHaveAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  });
});
