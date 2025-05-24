import { useMemo } from 'react';

import Gradient from './gradient';
import { StarProps } from './types';

export default function Star({
  viewBox = '0 0 306 306',
  fill,
  index,
  value,
  fullId,
  halfId,
  noneId,
  primaryColor,
  secondaryColor,
  isHalf,
  size,
  onMouseLeave,
  onChange,
  onMouseMove,
}: StarProps) {
  fill = useMemo(() => {
    if (index <= value) return `url(#${fullId})`;
    if (isHalf && Math.ceil(value) === index) return `url(#${halfId})`;

    return `url(#${noneId})`;
  }, [fullId, halfId, noneId, index, isHalf, value]);

  return (
    <svg
      data-testid="star-svg"
      width={size}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      onMouseLeave={onMouseLeave}
      onClick={onChange}
      data-stars={index}
      onMouseMove={onMouseMove}
    >
      <Gradient
        index={index}
        value={value}
        fullId={fullId}
        halfId={halfId}
        noneId={noneId}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      />
      <polygon
        data-testid="star-polygon"
        fill={fill}
        points="153,230.775 247.35,299.625 211.65,187.425 306,121.125 191.25,121.125 153,6.375 114.75,121.125 0,121.125 94.35,187.425 58.65,299.625"
        pointerEvents="none"
      />
    </svg>
  );
}
