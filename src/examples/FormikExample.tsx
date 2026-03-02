import { Field, FieldProps, Form, Formik } from 'formik';

import ReactStarsRating from '../lib';

type FormValues = {
  rating: number;
  feedback: string;
};

const FormikExample = () => {
  const initialValues: FormValues = { rating: 2.5, feedback: '' };

  return (
    <div className="flex h-full flex-col rounded-3xl bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <h3 className="font-display text-2xl text-slate-900">Formik</h3>
      <p className="mt-2 text-sm text-slate-600">
        Formik Field render prop with a custom rating input.
      </p>

      <Formik
        initialValues={initialValues}
        validate={(values) => {
          const errors: Partial<Record<keyof FormValues, string>> = {};
          if (!values.feedback) {
            errors.feedback = 'Feedback is required.';
          }
          if (values.rating < 1) {
            errors.rating = 'Minimum rating is 1.';
          }
          return errors;
        }}
        onSubmit={(values, { resetForm }) => {
          window.alert(JSON.stringify(values, null, 2));
          resetForm();
        }}
      >
        {({ errors, touched, values }) => (
          <Form className="mt-6 flex flex-1 flex-col space-y-4">
            <div>
              <label htmlFor="formik" className="text-sm text-slate-700">
                Rating:{' '}
                <span className="font-medium">{values.rating.toFixed(1)}</span>
              </label>
              <div className="mt-2">
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
              </div>
              {touched.rating && errors.rating && (
                <p className="mt-2 text-xs text-ember-500">{errors.rating}</p>
              )}
            </div>

            <div className="flex-1">
              <label className="text-sm text-slate-700" htmlFor="feedback">
                Feedback
              </label>
              <Field
                as="textarea"
                id="feedback"
                name="feedback"
                rows={2}
                placeholder="Share your feedback"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20"
              />
              {touched.feedback && errors.feedback && (
                <p className="mt-2 text-xs text-ember-500">{errors.feedback}</p>
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
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormikExample;
