import axe from 'axe-core';
import { render, screen } from '@testing-library/react';

import Examples from '../examples';

describe('Demo site', () => {
  test('renders every section', async () => {
    render(<Examples />);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Playground' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Product summary')).toBeInTheDocument();
    expect(screen.getByText('Scales and sizes')).toBeInTheDocument();
    expect(await screen.findByText('React Hook Form')).toBeInTheDocument();
    expect(screen.getAllByRole('slider').length).toBeGreaterThan(5);
  });

  test('has no obvious accessibility violations', async () => {
    const { container } = render(<Examples />);
    await screen.findByText('React Hook Form');

    const results = await axe.run(container);

    expect(results.violations).toEqual([]);
  });
});
