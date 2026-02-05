import SimpleExample from './SimpleExample';
import HookFormExample from './HookFormExample';
import FormikExample from './FormikExample';
import TanStackFormExample from './TanStackFormExample';

const Examples = () => {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-16">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember-500">
          React Awesome Stars Rating
        </p>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Modern star rating component for React.
        </h1>
        <p className="mt-4 text-sm text-slate-600">
          Explore simple usage and deep form integrations with React Hook Form,
          Formik, and TanStack Form — all powered by a single accessible rating
          component.
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
