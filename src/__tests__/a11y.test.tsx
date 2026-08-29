import axe from 'axe-core';
import { render } from '@testing-library/react';

import ReactStarsRating from '../lib';

describe('Accessibility', () => {
  test('no obvious violations', async () => {
    const { container } = render(
      <ReactStarsRating id="a11y" value={3} isHalf count={5} size={32} />,
    );

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});
