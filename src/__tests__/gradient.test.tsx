import { render } from '@testing-library/react';

import Gradient from '../lib/gradient';

const props = {
  primaryColor: 'orange',
  secondaryColor: 'grey',
  fullId: 'full',
  halfId: 'half',
  noneId: 'none',
};

describe('Gradient', () => {
  test('defines the three gradients once, on the first star', () => {
    const { container } = render(<Gradient {...props} index={1} value={1} />);

    expect(container.querySelectorAll('linearGradient')).toHaveLength(3);
  });

  test('renders nothing for the remaining stars', () => {
    const { container } = render(<Gradient {...props} index={2} value={1} />);

    expect(container.querySelector('defs')).toBeNull();
  });

  test('splits the half gradient at the fractional part of the value', () => {
    const { container } = render(<Gradient {...props} index={1} value={3.4} />);

    const half = container.querySelector('#half')!;
    const [primaryStop, secondaryStop] = half.querySelectorAll('stop');

    // 3.4 fills 40% of the star it lands on.
    expect(primaryStop).toHaveAttribute('offset', '40%');
    expect(primaryStop).toHaveAttribute('stop-color', props.primaryColor);
    expect(secondaryStop).toHaveAttribute('offset', '40%');
    expect(secondaryStop).toHaveAttribute('stop-color', props.secondaryColor);
  });

  test('fills the full and empty gradients with a single colour', () => {
    const { container } = render(<Gradient {...props} index={1} value={2} />);

    expect(container.querySelector('#full stop')).toHaveAttribute(
      'stop-color',
      props.primaryColor,
    );
    expect(container.querySelector('#none stop')).toHaveAttribute(
      'stop-color',
      props.secondaryColor,
    );
  });
});
