type GradientProps = {
  primaryColor: string;
  secondaryColor: string;
  offset?: number;
  index: number;
  value: number;
  fullId: string;
  halfId: string;
  noneId: string;
  hoverColor?: string;
  hoverValue?: number | null;
  committedValue?: number;
  hoverGradientId?: string;
};

const asPercent = (value: number, index: number) =>
  Math.min(100, Math.max(0, Math.round((value - (index - 1)) * 10000) / 100));

const Gradient = ({
  primaryColor,
  secondaryColor,
  offset = 50,
  index,
  value,
  fullId,
  halfId,
  noneId,
  hoverColor,
  hoverValue = null,
  committedValue = value,
  hoverGradientId,
}: GradientProps) => {
  if (hoverColor && hoverValue !== null && hoverGradientId) {
    const lowerValue = Math.min(committedValue, hoverValue);
    const upperValue = Math.max(committedValue, hoverValue);
    const lowerOffset = asPercent(lowerValue, index);
    const upperOffset = asPercent(upperValue, index);
    const lowerColor = hoverValue <= committedValue ? hoverColor : primaryColor;
    const middleColor =
      hoverValue <= committedValue ? primaryColor : hoverColor;
    const ranges = [
      { start: 0, end: lowerOffset, color: lowerColor },
      { start: lowerOffset, end: upperOffset, color: middleColor },
      { start: upperOffset, end: 100, color: secondaryColor },
    ].filter(({ start, end }) => end > start);

    return (
      <defs>
        <linearGradient id={hoverGradientId}>
          {ranges.flatMap(({ start, end, color }, rangeIndex) => [
            <stop
              key={`${rangeIndex}-start`}
              offset={`${start}%`}
              stopColor={color}
            />,
            <stop
              key={`${rangeIndex}-end`}
              offset={`${end}%`}
              stopColor={color}
            />,
          ])}
        </linearGradient>
      </defs>
    );
  }

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
