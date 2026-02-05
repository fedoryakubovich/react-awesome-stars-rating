import { useState } from 'react';

import ReactStarsRating from '../lib';

const SimpleExample = () => {
  const [value, setValue] = useState(3.2);
  const [submittedValue, setSubmittedValue] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');

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
      <div className="mt-6 space-y-4">
        <div className="space-y-3">
          <p className="text-sm text-slate-700">
            Rating:{' '}
            <span className="font-medium">
              {(submittedValue ?? value).toFixed(1)}
            </span>
          </p>
          <ReactStarsRating
            value={value}
            onChange={handleChange}
            isHalf
            size={32}
            id="simple"
          />
        </div>

        <div>
          <label className="text-sm text-slate-700" htmlFor="simple-feedback">
            Feedback
          </label>
          <textarea
            id="simple-feedback"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20"
            rows={2}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your feedback"
          />
        </div>
      </div>
    </div>
  );
};

export default SimpleExample;
