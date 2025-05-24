import { render, screen } from '@testing-library/react';

import Gradient from '../lib/gradient';

describe('Gradient Component', () => {
  const defaultProps = {
    index: 1,
    value: 2.5,
    fullId: 'full-gradient',
    halfId: 'half-gradient',
    noneId: 'none-gradient',
    primaryColor: 'gold',
    secondaryColor: 'gray',
  };

  test('renders nothing when index is not 1', () => {
    render(
      <svg>
        <Gradient {...defaultProps} index={2} />
      </svg>,
    );
    const { container } = render(<Gradient {...defaultProps} index={2} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders gradient definitions when index is 1', () => {
    render(
      <svg>
        <Gradient {...defaultProps} />
      </svg>,
    );

    const defsElement = screen.getByTestId('gradient');
    expect(defsElement).toBeInTheDocument();
    expect(defsElement).toHaveAttribute('data-offset', '50');
  });

  test('renders full gradient with correct properties', () => {
    render(
      <svg>
        <Gradient {...defaultProps} />
      </svg>,
    );

    const fullGradient = document.getElementById(defaultProps.fullId);
    expect(fullGradient).toBeInTheDocument();
    expect(fullGradient?.querySelector('stop')).toHaveAttribute('offset', '100%');
    expect(fullGradient?.querySelector('stop')).toHaveAttribute(
      'stop-color',
      defaultProps.primaryColor,
    );
  });

  test('renders none gradient with correct properties', () => {
    render(
      <svg>
        <Gradient {...defaultProps} />
      </svg>,
    );

    const noneGradient = document.getElementById(defaultProps.noneId);
    expect(noneGradient).toBeInTheDocument();
    expect(noneGradient?.querySelector('stop')).toHaveAttribute('offset', '100%');
    expect(noneGradient?.querySelector('stop')).toHaveAttribute(
      'stop-color',
      defaultProps.secondaryColor,
    );
  });

  test('renders half gradient with correct properties', () => {
    render(
      <svg>
        <Gradient {...defaultProps} value={0.75} />
      </svg>,
    );

    const halfGradient = document.getElementById(defaultProps.halfId);
    expect(halfGradient).toBeInTheDocument();

    const stops = halfGradient?.querySelectorAll('stop') || [];
    expect(stops[0]).toHaveAttribute('offset', '75%');
    expect(stops[0]).toHaveAttribute('stop-color', defaultProps.primaryColor);
    expect(stops[1]).toHaveAttribute('offset', '75%');
    expect(stops[1]).toHaveAttribute('stop-color', defaultProps.secondaryColor);
  });

  describe('offset calculations', () => {
    test('calculates offset for value 1.8', () => {
      const props = {
        ...defaultProps,
        fullId: 'full-gradient-1',
        halfId: 'half-gradient-1',
        noneId: 'none-gradient-1',
      };
      render(
        <svg>
          <Gradient {...props} value={1.8} />
        </svg>,
      );
      expect(screen.getByTestId('gradient')).toHaveAttribute('data-offset', '80');
    });

    test('calculates offset for value 0.3', () => {
      const props = {
        ...defaultProps,
        fullId: 'full-gradient-2',
        halfId: 'half-gradient-2',
        noneId: 'none-gradient-2',
      };
      render(
        <svg>
          <Gradient {...props} value={0.3} />
        </svg>,
      );
      expect(screen.getByTestId('gradient')).toHaveAttribute('data-offset', '30');
    });

    test('calculates offset for value 0', () => {
      const props = {
        ...defaultProps,
        fullId: 'full-gradient-3',
        halfId: 'half-gradient-3',
        noneId: 'none-gradient-3',
      };
      render(
        <svg>
          <Gradient {...props} value={0} />
        </svg>,
      );
      expect(screen.getByTestId('gradient')).toHaveAttribute('data-offset', '0');
    });

    test('calculates offset for value 1', () => {
      const props = {
        ...defaultProps,
        fullId: 'full-gradient-4',
        halfId: 'half-gradient-4',
        noneId: 'none-gradient-4',
      };
      render(
        <svg>
          <Gradient {...props} value={1} />
        </svg>,
      );
      expect(screen.getByTestId('gradient')).toHaveAttribute('data-offset', '0');
    });
  });

  test('renders with custom colors', () => {
    const customProps = {
      ...defaultProps,
      primaryColor: 'red',
      secondaryColor: 'blue',
    };

    render(
      <svg>
        <Gradient {...customProps} />
      </svg>,
    );

    const fullGradient = document.getElementById(customProps.fullId);
    expect(fullGradient?.querySelector('stop')).toHaveAttribute('stop-color', 'red');

    const noneGradient = document.getElementById(customProps.noneId);
    expect(noneGradient?.querySelector('stop')).toHaveAttribute('stop-color', 'blue');
  });
});
