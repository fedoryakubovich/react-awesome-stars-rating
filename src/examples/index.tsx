import { lazy, Suspense, type ReactNode } from 'react';

import SimpleExample from './SimpleExample';
import Playground from './Playground';
import ProductRatingExample from './ProductRatingExample';
import ScaleExample from './ScaleExample';
import CodeBlock from './CodeBlock';
import ReactStarsRating from '../lib';

const HookFormExample = lazy(() => import('./HookFormExample'));
const FormikExample = lazy(() => import('./FormikExample'));
const TanStackFormExample = lazy(() => import('./TanStackFormExample'));

const USAGE = `import ReactStarsRating from 'react-awesome-stars-rating';

const Review = () => {
  const [value, setValue] = useState(3.5);

  return <ReactStarsRating value={value} onChange={setValue} />;
};`;

const FEATURES = [
  { title: '~3 kB gzipped', detail: 'No runtime dependencies beyond React.' },
  { title: 'Half stars', detail: 'Pointer position decides half or full.' },
  { title: 'Keyboard ready', detail: 'Arrow keys, Enter and blur submit.' },
  {
    title: 'role="slider"',
    detail: 'Labelled and value-reporting by default.',
  },
];

const Section = ({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) => (
  <section className="space-y-6">
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember-500">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
    {children}
  </section>
);

const Examples = () => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff7ed_0%,#ffffff_45%)]">
    <main className="mx-auto flex max-w-6xl flex-col gap-20 px-6 py-16">
      <header className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember-500">
            React Awesome Stars Rating
          </p>
          <h1 className="mt-4 bg-linear-to-r from-slate-900 to-slate-600 bg-clip-text font-display text-4xl text-transparent sm:text-5xl">
            The star rating React has been missing.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600">
            One accessible component: half stars from pointer position, full
            keyboard control, any scale or palette, and first-class bindings for
            React Hook Form, Formik and TanStack Form.
          </p>

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200/80 bg-white/70 p-4"
              >
                <dt className="text-sm font-semibold text-slate-900">
                  {feature.title}
                </dt>
                <dd className="mt-1 text-xs text-slate-600">
                  {feature.detail}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
              href="https://github.com/fedoryakubovich/react-awesome-stars-rating"
            >
              View on GitHub
            </a>
            <a
              className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-500"
              href="https://www.npmjs.com/package/react-awesome-stars-rating"
            >
              npm package
            </a>
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <div className="rounded-3xl bg-white/90 p-8 text-center shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <ReactStarsRating
              id="hero"
              value={4.5}
              isEdit={false}
              size={52}
              style={{ '--stars-rating-size': 'clamp(24px, 8vw, 52px)' }}
              starGap={6}
              ariaLabel="Example rating of 4.5 out of 5"
            />
            <p className="mt-4 text-sm text-slate-500">
              4.5 out of 5 — rendered from a single prop
            </p>
          </div>
          <CodeBlock label="npm i react-awesome-stars-rating" code={USAGE} />
        </div>
      </header>

      <Section
        eyebrow="Try it"
        title="Playground"
        description="Every prop, live. Click a star, or focus the rating and use the arrow keys, then copy the result straight into your project."
      >
        <Playground />
      </Section>

      <Section
        eyebrow="Use cases"
        title="Beyond a single input"
        description="Read-only summaries, alternative scales and custom palettes come from the same component."
      >
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          <ProductRatingExample />
          <ScaleExample />
        </div>
      </Section>

      <Section
        eyebrow="Forms"
        title="Works with your form library"
        description="Controlled value and onChange are all any of these adapters need."
      >
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 xl:grid-cols-4">
          <SimpleExample />
          <Suspense fallback={<p>Loading form examples…</p>}>
            <HookFormExample />
            <FormikExample />
            <TanStackFormExample />
          </Suspense>
        </div>
      </Section>

      <footer className="border-t border-slate-200 pt-8 text-xs text-slate-500">
        MIT licensed. Built with Vite, tested with Vitest and axe-core.
      </footer>
    </main>
  </div>
);

export default Examples;
