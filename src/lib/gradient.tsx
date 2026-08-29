type GradientProps = {
  primaryColor: string;
  secondaryColor: string;
  offset?: number;
  index: number;
  value: number;
  fullId: string;
  halfId: string;
  noneId: string;
};

const Gradient = ({
  primaryColor,
  secondaryColor,
  offset = 50,
  index,
  value,
  fullId,
  halfId,
  noneId,
}: GradientProps) => {
  let computedOffset = offset;

  if (index === 1) {
    // Rounded because floating point turns values such as 3.4 into an offset
    // of 39.99999999999999%.
    computedOffset = Math.round((value % 1) * 10000) / 100;
  }

  if (index !== 1) {
    return null;
  }

  return (
    <defs>
      <linearGradient id={fullId}>
        <stop offset="100%" stopColor={primaryColor} />
      </linearGradient>
      <linearGradient id={noneId}>
        <stop offset="100%" stopColor={secondaryColor} />
      </linearGradient>
      <linearGradient id={halfId}>
        <stop offset={`${computedOffset}%`} stopColor={primaryColor} />
        <stop offset={`${computedOffset}%`} stopColor={secondaryColor} />
      </linearGradient>
    </defs>
  );
};

export default Gradient;
