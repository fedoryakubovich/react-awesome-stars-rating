import React from 'react';

import SimpleExample from './SimpleExample';
import HookFormExample from './HookFormExample';
import FormikExample from './FormikExample';
import TanStackFormExample from './TanStackFormExample';

const Examples = () => {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-12">
      <header className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-ember-500">
          React Awesome Stars Rating
        </p>
        <h1 className="mt-3 font-display text-4xl text-ink-100">
          Modern star rating component, rebuilt with Vite, TypeScript, and
          Tailwind.
        </h1>
        <p className="mt-4 text-sm text-ink-200">
          Explore the simple usage and form integrations with react-hook-form,
          Formik, and TanStack Form.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
        <SimpleExample />
        <HookFormExample />
        <FormikExample />
        <TanStackFormExample />
      </section>
    </main>
  );
};

export default Examples;
