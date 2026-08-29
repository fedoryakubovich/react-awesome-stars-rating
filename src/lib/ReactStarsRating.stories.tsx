import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';

import ReactStarsRating from './index';

const meta = {
  title: 'Components/ReactStarsRating',
  component: ReactStarsRating,
  tags: ['autodocs'],
  args: {
    value: 3.5,
    isHalf: true,
    count: 5,
    size: 32,
    primaryColor: '#ff8a3d',
    secondaryColor: '#374151',
    onChange: fn(),
  },
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 5, step: 0.5 },
      description: 'Current rating value',
    },
    count: {
      control: { type: 'number', min: 1, max: 10, step: 1 },
      description: 'Number of stars',
    },
    size: {
      control: { type: 'number', min: 16, max: 64, step: 4 },
      description: 'Star size in pixels',
    },
    starGap: {
      control: { type: 'number', min: 0, max: 16, step: 1 },
      description: 'Gap between stars',
    },
    isEdit: {
      control: 'boolean',
      description: 'Whether the rating is editable',
    },
    isHalf: {
      control: 'boolean',
      description: 'Allow half-star precision',
    },
    isArrowSubmit: {
      control: 'boolean',
      description: 'Arrow keys trigger onChange immediately',
    },
    primaryColor: {
      control: 'color',
      description: 'Active star color',
    },
    secondaryColor: {
      control: 'color',
      description: 'Inactive star color',
    },
    onChange: {
      action: 'onChange',
      description: 'Called when the value changes',
      table: {
        category: 'Events',
      },
    },
  },
  decorators: [
    (StoryFn) => (
      <div className="min-h-screen bg-ink-900 p-12 text-ink-100">
        <div className="max-w-md rounded-3xl border border-ink-700/60 bg-ink-800/60 p-8">
          <StoryFn />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof ReactStarsRating>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ReadOnly: Story = {
  args: {
    isEdit: false,
    value: 4,
  },
};

export const ArrowSubmit: Story = {
  args: {
    isArrowSubmit: true,
    value: 2.5,
  },
};

export const CustomPalette: Story = {
  args: {
    primaryColor: '#22c55e',
    secondaryColor: '#0f172a',
  },
};
