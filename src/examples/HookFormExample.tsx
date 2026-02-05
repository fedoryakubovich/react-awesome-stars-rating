import React from 'react';
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
    formState: { errors, isSubmitSuccessful },
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      rating: 4,
      feedback: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('react-hook-form submit', data);
  };

  // eslint-disable-next-line react-hooks/incompatible-library -- demo: watch for display only
  const rating = watch('rating') ?? 0;

  return (
    <div className="rounded-3xl border border-ink-700/60 bg-ink-800/60 p-6">
      <h3 className="font-display text-2xl text-ink-100">React Hook Form</h3>
      <p className="mt-2 text-sm text-ink-200">
        Uses Controller to bind the rating component.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label htmlFor="rhf" className="text-sm text-ink-200">
            Rating
          </label>
          <div className="mt-2 flex items-center gap-4">
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
            <span className="text-sm text-ink-200">{rating.toFixed(1)}</span>
          </div>
          {errors.rating && (
            <p className="mt-2 text-xs text-ember-500">
              Please select at least 1 star.
            </p>
          )}
        </div>

        <div>
          <label className="text-sm text-ink-200" htmlFor="feedback">
            Feedback
          </label>
          <textarea
            id="feedback"
            {...register('feedback', { required: true })}
            className="mt-2 w-full rounded-2xl border border-ink-700 bg-ink-900/80 p-3 text-sm text-ink-100 outline-none focus:border-ember-500"
            rows={3}
            placeholder="What made it awesome?"
          />
          {errors.feedback && (
            <p className="mt-2 text-xs text-ember-500">Feedback is required.</p>
          )}
        </div>

        <button
          type="submit"
          className="rounded-full bg-ember-500 px-5 py-2 text-sm font-semibold text-ink-900 transition hover:bg-ember-400"
        >
          Submit
        </button>

        {isSubmitSuccessful && (
          <p className="text-xs text-ink-200">
            Submitted! Check the console for form data.
          </p>
        )}
      </form>
    </div>
  );
};

export default HookFormExample;
