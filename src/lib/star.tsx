import type { PointerEvent } from 'react';

import Gradient from './gradient';

type StarProps = {
  viewBox?: string;
  size: number;
  primaryColor: string;
  secondaryColor: string;
  hoverColor?: string;
  hoverValue?: number | null;
  committedValue?: number;
  onPointerLeave?: (event: PointerEvent<SVGSVGElement>) => void;
  onPointerMove?: (event: PointerEvent<SVGSVGElement>) => void;
  onPointerDown?: (event: PointerEvent<SVGSVGElement>) => void;
  onPointerUp?: (event: PointerEvent<SVGSVGElement>) => void;
  onPointerCancel?: (event: PointerEvent<SVGSVGElement>) => void;
  isHalf: boolean;
  isRtl: boolean;
  onLostPointerCapture?: (event: PointerEvent<SVGSVGElement>) => void;
  fill?: string;
  index: number;
  value: number;
  offset?: number;
  fullId: string;
  halfId: string;
  noneId: string;
};

const StarSVG = ({
  viewBox = '0 0 306 306',
  size,
  onPointerMove,
  onPointerLeave,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  index,
  value,
  isHalf,
  isRtl,
  onLostPointerCapture,
  primaryColor,
  secondaryColor,
  hoverColor,
  hoverValue = null,
  committedValue = value,
  fill,
  offset = 50,
  fullId,
  halfId,
  noneId,
}: StarProps) => {
  let computedFill = fill;
  const hoverGradientId = `${fullId}-hover-${index}`;

  if (hoverColor && hoverValue !== null) {
    computedFill = `url(#${hoverGradientId})`;
  } else if (index <= value) {
    computedFill = `url(#${fullId})`;
  } else if (isHalf && Math.ceil(value) === index) {
    computedFill = `url(#${halfId})`;
  } else {
    computedFill = `url(#${noneId})`;
  }

  return (
    <svg
      width={size}
      style={{
        forcedColorAdjust: 'auto',
        width: 'var(--stars-rating-size)',
        transform: isRtl ? 'scaleX(-1)' : undefined,
      }}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      onPointerLeave={onPointerLeave}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onLostPointerCapture={onLostPointerCapture}
    >
      <Gradient
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        offset={offset}
        index={index}
        value={value}
        fullId={fullId}
        halfId={halfId}
        noneId={noneId}
        hoverColor={hoverColor}
        hoverValue={hoverValue}
        committedValue={committedValue}
        hoverGradientId={hoverGradientId}
      />
      <polygon
        fill={computedFill}
        points="153,230.775 247.35,299.625 211.65,187.425 306,121.125 191.25,121.125 153,6.375 114.75,121.125 0,121.125 94.35,187.425 58.65,299.625"
        pointerEvents="none"
      />
    </svg>
  );
};

export default StarSVG;
