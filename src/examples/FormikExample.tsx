import React from 'react';
import { Field, FieldProps, Form, Formik } from 'formik';

import ReactStarsRating from '../lib';

type FormValues = {
  rating: number;
  title: string;
};

const FormikExample = () => {
  const initialValues: FormValues = { rating: 2.5, title: '' };

  return (
    <div className="rounded-3xl border border-ink-700/60 bg-ink-800/60 p-6">
      <h3 className="font-display text-2xl text-ink-100">Formik</h3>
      <p className="mt-2 text-sm text-ink-200">
        Formik Field render prop with a custom rating input.
      </p>

      <Formik
        initialValues={initialValues}
        validate={(values) => {
          const errors: Partial<Record<keyof FormValues, string>> = {};
          if (!values.title) {
            errors.title = 'Title is required.';
          }
          if (values.rating < 1) {
            errors.rating = 'Minimum rating is 1.';
          }
          return errors;
        }}
        onSubmit={(values, { resetForm }) => {
          console.log('formik submit', values);
          resetForm();
        }}
      >
        {({ errors, touched, values }) => (
          <Form className="mt-6 space-y-4">
            <div>
              <label htmlFor="formik" className="text-sm text-ink-200">
                Rating
              </label>
              <div className="mt-2 flex items-center gap-4">
                <Field name="rating">
                  {({ field, form }: FieldProps<number>) => (
                    <ReactStarsRating
                      value={field.value}
                      onChange={(next) => form.setFieldValue('rating', next)}
                      isHalf
                      size={28}
                      id="formik"
                    />
                  )}
                </Field>
                <span className="text-sm text-ink-200">
                  {values.rating.toFixed(1)}
                </span>
              </div>
              {touched.rating && errors.rating && (
                <p className="mt-2 text-xs text-ember-500">{errors.rating}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-ink-200" htmlFor="title">
                Review title
              </label>
              <Field
                id="title"
                name="title"
                placeholder="Keep it short"
                className="mt-2 w-full rounded-2xl border border-ink-700 bg-ink-900/80 p-3 text-sm text-ink-100 outline-none focus:border-ember-500"
              />
              {touched.title && errors.title && (
                <p className="mt-2 text-xs text-ember-500">{errors.title}</p>
              )}
            </div>

            <button
              type="submit"
              className="rounded-full bg-ember-500 px-5 py-2 text-sm font-semibold text-ink-900 transition hover:bg-ember-400"
            >
              Send
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormikExample;
