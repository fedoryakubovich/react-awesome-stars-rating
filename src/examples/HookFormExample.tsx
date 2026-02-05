import { Controller, useForm } from 'react-hook-form';

import ReactStarsRating from '../lib';

type FormValues = {
  rating: number;
  feedback: string;
};

const HookFormExample = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      rating: 4,
      feedback: '',
    },
  });

  const onSubmit = (data: FormValues) => {
     
    window.alert(JSON.stringify(data, null, 2));
  };

  // eslint-disable-next-line react-hooks/incompatible-library -- demo: watch for display only
  const rating = watch('rating') ?? 0;

  return (
    <div className="flex h-full flex-col rounded-3xl bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <h3 className="font-display text-2xl text-slate-900">React Hook Form</h3>
      <p className="mt-2 text-sm text-slate-600">
        Uses Controller to bind the rating component.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 flex flex-1 flex-col space-y-4"
      >
        <div>
          <label htmlFor="rhf" className="text-sm text-slate-700">
            Rating: <span className="font-medium">{rating.toFixed(1)}</span>
          </label>
          <div className="mt-2">
            <Controller
              control={control}
              name="rating"
              rules={{ min: 1 }}
              render={({ field }) => (
                <ReactStarsRating
                  value={field.value}
                  onChange={field.onChange}
                  isHalf
                  size={28}
                  id="rhf"
                />
              )}
            />
          </div>
          {errors.rating && (
            <p className="mt-2 text-xs text-ember-500">
              Please select at least 1 star.
            </p>
          )}
        </div>

        <div className="flex-1">
          <label className="text-sm text-slate-700" htmlFor="feedback">
            Feedback
          </label>
          <textarea
            id="feedback"
            {...register('feedback', { required: true })}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20"
            rows={2}
            placeholder="Share your feedback"
          />
          {errors.feedback && (
            <p className="mt-2 text-xs text-ember-500">Feedback is required.</p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full rounded-2xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white border border-slate-800 transition hover:bg-slate-800"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default HookFormExample;
