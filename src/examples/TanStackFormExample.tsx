import { useForm } from '@tanstack/react-form';

import ReactStarsRating from '../lib';

const TanStackFormExample = () => {
  const form = useForm({
    defaultValues: {
      rating: 3.5,
      note: '',
    },
    onSubmit: ({ value }) => {
      window.alert(JSON.stringify(value, null, 2));
    },
  });

  return (
    <div className="flex h-full flex-col rounded-3xl bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <h3 className="font-display text-2xl text-slate-900">TanStack Form</h3>
      <p className="mt-2 text-sm text-slate-600">
        Headless form state with rating.
      </p>

      <form
        className="mt-6 flex flex-1 flex-col space-y-4"
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
                Rating:{' '}
                <span className="font-medium">
                  {field.state.value.toFixed(1)}
                </span>
              </label>
              <div className="mt-2">
                <ReactStarsRating
                  id="tanstack-rating"
                  value={field.state.value}
                  onChange={field.handleChange}
                  isHalf
                  size={28}
                />
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
              value.trim().length === 0 ? 'Feedback is required.' : undefined,
          }}
        >
          {(field) => (
            <div className="flex-1">
              <label htmlFor="tanstack-note" className="text-sm text-slate-700">
                Feedback
              </label>
              <textarea
                id="tanstack-note"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20"
                rows={2}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Share your feedback"
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

        <div className="pt-2">
          <button
            type="submit"
            disabled={form.state.isSubmitting}
            className="w-full rounded-2xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white border border-slate-800 transition hover:bg-slate-800 disabled:opacity-60"
          >
            {form.state.isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TanStackFormExample;
