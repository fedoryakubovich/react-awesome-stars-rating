import React from 'react';

import Gradient from './gradient';

type StarProps = {
  viewBox?: string;
  size: number;
  primaryColor: string;
  secondaryColor: string;
  onMouseLeave?: (event: React.MouseEvent<SVGSVGElement>) => void;
  onMouseMove?: (event: React.MouseEvent<SVGSVGElement>) => void;
  onChange?: (event: React.MouseEvent<SVGSVGElement>) => void;
  isHalf: boolean;
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
  onMouseMove,
  onMouseLeave,
  onChange,
  index,
  value,
  isHalf,
  primaryColor,
  secondaryColor,
  fill,
  offset = 50,
  fullId,
  halfId,
  noneId,
}: StarProps) => {
  let computedFill = fill;

  if (index <= value) {
    computedFill = `url(#${fullId})`;
  } else if (isHalf && Math.ceil(value) === index) {
    computedFill = `url(#${halfId})`;
  } else {
    computedFill = `url(#${noneId})`;
  }

  return (
    <svg
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
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        offset={offset}
        index={index}
        value={value}
        fullId={fullId}
        halfId={halfId}
        noneId={noneId}
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
