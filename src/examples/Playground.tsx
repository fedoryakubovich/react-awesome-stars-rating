import { useState } from 'react';

import ReactStarsRating from '../lib';
import CodeBlock from './CodeBlock';

const PALETTES = [
  {
    name: 'Ember',
    primary: '#ff8a3d',
    hover: '#38bdf8',
    secondary: '#e2e8f0',
  },
  {
    name: 'Gold',
    primary: '#f5b301',
    hover: '#f97316',
    secondary: '#ede9e0',
  },
  {
    name: 'Rose',
    primary: '#f43f5e',
    hover: '#a855f7',
    secondary: '#fbe3e8',
  },
  {
    name: 'Ocean',
    primary: '#0ea5e9',
    hover: '#22c55e',
    secondary: '#dbeafe',
  },
  {
    name: 'Forest',
    primary: '#16a34a',
    hover: '#eab308',
    secondary: '#dcfce7',
  },
];

const Playground = () => {
  const [value, setValue] = useState(3.5);
  const [count, setCount] = useState(5);
  const [size, setSize] = useState(36);
  const [starGap, setStarGap] = useState(6);
  const [isHalf, setIsHalf] = useState(true);
  const [isEdit, setIsEdit] = useState(true);
  const [isArrowSubmit, setIsArrowSubmit] = useState(false);
  const [palette, setPalette] = useState(PALETTES[0]);

  const snippet = [
    '<ReactStarsRating',
    `  value={${value}}`,
    '  onChange={setValue}',
    `  count={${count}}`,
    `  size={${size}}`,
    `  starGap={${starGap}}`,
    `  isHalf={${isHalf}}`,
    `  isEdit={${isEdit}}`,
    isArrowSubmit ? '  isArrowSubmit' : null,
    `  primaryColor="${palette.primary}"`,
    `  hoverColor="${palette.hover}"`,
    `  secondaryColor="${palette.secondary}"`,
    '/>',
  ]
    .filter(Boolean)
    .join('\n');

  const toggles = [
    { label: 'Half stars', value: isHalf, set: setIsHalf },
    { label: 'Editable', value: isEdit, set: setIsEdit },
    { label: 'Arrow submits', value: isArrowSubmit, set: setIsArrowSubmit },
  ];

  const sliders = [
    { label: 'Stars', value: count, set: setCount, min: 3, max: 10, step: 1 },
    { label: 'Size', value: size, set: setSize, min: 16, max: 72, step: 2 },
    { label: 'Gap', value: starGap, set: setStarGap, min: 0, max: 24, step: 1 },
  ];

  return (
    <div className="grid gap-6 rounded-3xl bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] lg:grid-cols-[1.1fr_1fr] lg:p-8">
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6">
          <ReactStarsRating
            id="playground"
            value={value}
            onChange={setValue}
            count={count}
            size={size}
            starGap={starGap}
            isHalf={isHalf}
            isEdit={isEdit}
            isArrowSubmit={isArrowSubmit}
            primaryColor={palette.primary}
            hoverColor={palette.hover}
            secondaryColor={palette.secondary}
          />
          <p className="mt-4 text-sm text-slate-600">
            Value{' '}
            <span className="font-medium text-slate-900">
              {value.toFixed(1)}
            </span>{' '}
            of {count}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {sliders.map((slider) => (
            <label key={slider.label} className="text-sm text-slate-700">
              <span className="flex items-center justify-between">
                {slider.label}
                <span className="font-medium text-slate-900">
                  {slider.value}
                </span>
              </span>
              <input
                type="range"
                className="mt-2 w-full accent-ember-500"
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={slider.value}
                onChange={(event) => slider.set(Number(event.target.value))}
              />
            </label>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          {toggles.map((toggle) => (
            <label
              key={toggle.label}
              className="flex items-center gap-2 text-sm text-slate-700"
            >
              <input
                type="checkbox"
                className="size-4 accent-ember-500"
                checked={toggle.value}
                onChange={(event) => toggle.set(event.target.checked)}
              />
              {toggle.label}
            </label>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {PALETTES.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setPalette(item)}
              aria-pressed={palette.name === item.name}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                palette.name === item.name
                  ? 'border-slate-900 text-slate-900'
                  : 'border-slate-200 text-slate-500 hover:border-slate-400'
              }`}
            >
              <span
                aria-hidden="true"
                className="size-3 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${item.primary} 50%, ${item.hover} 50%)`,
                }}
              />
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <CodeBlock label="Generated usage" code={snippet} />
    </div>
  );
};

export default Playground;
