import { GradientProps } from './types';

export default function Gradient({
  primaryColor,
  secondaryColor,
  index,
  value,
  fullId,
  halfId,
  noneId,
}: GradientProps) {
  if (index !== 1) return null;

  const offset = (value % 1) * 100;

  return (
    <defs data-testid="gradient" data-offset={offset}>
      <linearGradient id={fullId}>
        <stop offset="100%" stopColor={primaryColor} />
      </linearGradient>
      <linearGradient id={noneId}>
        <stop offset="100%" stopColor={secondaryColor} />
      </linearGradient>
      <linearGradient id={halfId}>
        <stop offset={`${offset}%`} stopColor={primaryColor} />
        <stop offset={`${offset}%`} stopColor={secondaryColor} />
      </linearGradient>
    </defs>
  );
}
