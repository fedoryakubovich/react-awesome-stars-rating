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
    <div className="rounded-3xl bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <h3 className="font-display text-2xl text-slate-900">Simple example</h3>
      <p className="mt-2 text-sm text-slate-600">
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
        <span className="text-sm text-slate-600">
          Selected: {submittedValue ?? '—'}
        </span>
      </div>
    </div>
  );
};

export default SimpleExample;
