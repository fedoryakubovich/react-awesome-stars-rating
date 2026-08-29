import type { ReactNode } from 'react';

type CardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

const Card = ({ title, description, children, className = '' }: CardProps) => (
  <div
    className={`flex h-full flex-col rounded-3xl bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] ${className}`}
  >
    <h3 className="font-display text-2xl text-slate-900">{title}</h3>
    {description ? (
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    ) : null}
    <div className="mt-6 flex flex-1 flex-col">{children}</div>
  </div>
);

export default Card;
