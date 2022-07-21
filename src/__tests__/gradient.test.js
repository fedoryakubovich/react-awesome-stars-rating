import { render, screen } from '@testing-library/react';

import Gradient from '../lib/gradient';

describe('Gradient', () => {
  test('Render', () => {
    const props = {
      primaryColor: 'orange',
      secondaryColor: 'grey',
      primaryOffset: 50,
      secondaryOffset: 50,
      index: 1,
      value: 1,
    };

    render(<Gradient {...props} />);

    expect(screen.getByTestId('gradient')).toBeInTheDocument();
  });

  test('Not Render', () => {
    const props = {
      primaryColor: 'orange',
      secondaryColor: 'grey',
      primaryOffset: 50,
      secondaryOffset: 50,
      index: 0,
      value: 1,
    };

    render(<Gradient {...props} />);

    expect(screen.queryByTestId('gradient')).not.toBeInTheDocument();
  });

  test('Props checking', () => {
    const props = {
      primaryColor: 'orange',
      secondaryColor: 'grey',
      index: 1,
      value: 1,
    };

    const { container } = render(<Gradient {...props} />);
    expect(screen.getByTestId('gradient')).toHaveAttribute(
      'data-offset',
      `${(props.value % 1) * 100}`,
    );

    const [full, none, half] = container.querySelectorAll('linearGradient');

    const fullStop = full.querySelector('stop');
    expect(fullStop).toHaveAttribute('stop-color', props.primaryColor);

    const noneStop = none.querySelector('stop');
    expect(noneStop).toHaveAttribute('stop-color', props.secondaryColor);

    const [primaryStop, secondaryStop] = half.querySelectorAll('stop');
    expect(primaryStop).toHaveAttribute('stop-color', props.primaryColor);
    expect(secondaryStop).toHaveAttribute('stop-color', props.secondaryColor);
  });
});
