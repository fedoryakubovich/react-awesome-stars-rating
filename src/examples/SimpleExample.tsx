import React, { useState } from 'react';

import ReactStarsRating from '../lib';

const SimpleExample = () => {
  const [value, setValue] = useState(3.2);
  const [submittedValue, setSubmittedValue] = useState<number | null>(null);

  const handleChange = (nextValue: number) => {
    setValue(nextValue);
    setSubmittedValue(nextValue);
  };

  return (
    <div className="rounded-3xl border border-ink-700/60 bg-ink-800/60 p-6 shadow-glow">
      <h3 className="font-display text-2xl text-ink-100">Simple Example</h3>
      <p className="mt-2 text-sm text-ink-200">
        Hover or click to set a rating. Keyboard arrows work too.
      </p>
      <div className="mt-6 flex items-center gap-4">
        <ReactStarsRating
          value={value}
          onChange={handleChange}
          isHalf
          size={32}
          id="simple"
        />
        <span className="text-sm text-ink-200">
          Selected: {submittedValue ?? '—'}
        </span>
      </div>
    </div>
  );
};

export default SimpleExample;
