import React from 'react';
import { useForm } from '@tanstack/react-form';

import ReactStarsRating from '../lib';

const TanStackFormExample = () => {
  const form = useForm({
    defaultValues: {
      rating: 3.5,
      note: '',
    },
    onSubmit: ({ value }) => {
      console.log('tanstack-form submit', value);
    },
  });

  return (
    <div className="rounded-3xl bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <h3 className="font-display text-2xl text-slate-900">TanStack Form</h3>
      <p className="mt-2 text-sm text-slate-600">
        Headless form state management with a custom rating input.
      </p>

      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field
          name="rating"
          validators={{
            onChange: ({ value }) =>
              value < 1 ? 'Minimum rating is 1.' : undefined,
          }}
        >
          {(field) => (
            <div>
              <label
                htmlFor="tanstack-rating"
                className="text-sm text-slate-700"
              >
                Rating
              </label>
              <div className="mt-2 flex items-center gap-4">
                <ReactStarsRating
                  id="tanstack-rating"
                  value={field.state.value}
                  onChange={field.handleChange}
                  isHalf
                  size={28}
                />
                <span className="text-sm text-slate-600">
                  {field.state.value.toFixed(1)}
                </span>
              </div>
              {!field.state.meta.isValid &&
                field.state.meta.errors.length > 0 && (
                  <p className="mt-2 text-xs text-ember-500">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="note"
          validators={{
            onChange: ({ value }) =>
              value.trim().length === 0 ? 'Note is required.' : undefined,
          }}
        >
          {(field) => (
            <div>
              <label htmlFor="tanstack-note" className="text-sm text-slate-700">
                Note
              </label>
              <textarea
                id="tanstack-note"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20"
                rows={3}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Share a short note"
              />
              {!field.state.meta.isValid &&
                field.state.meta.errors.length > 0 && (
                  <p className="mt-2 text-xs text-ember-500">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
            </div>
          )}
        </form.Field>

        <button
          type="submit"
          disabled={form.state.isSubmitting}
          className="rounded-full bg-ember-500 px-5 py-2 text-sm font-semibold text-ink-900 transition hover:bg-ember-400 disabled:opacity-60"
        >
          {form.state.isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default TanStackFormExample;
