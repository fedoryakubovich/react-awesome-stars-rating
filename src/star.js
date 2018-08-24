import React from 'react';
import PropTypes from 'prop-types';

import Gradient from './gradient';

const StarSVG = ({
  viewBox,
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
  isEdit,
  primaryOffset,
  secondaryOffset,
}) => {
  if (isEdit) {
    if (index <= value) {
      fill = 'url(#full)';
    } else if (isHalf && index - 0.5 === value) {
      fill = 'url(#half)';
    }
  } else {
    if (index === 1) {
      const rest = value - Math.floor(value);
      primaryOffset = Math.round(rest * 100);
    }
    const ceilValue = Math.ceil(value);
    if (index < ceilValue) {
      fill = 'url(#full)';
    } else if (isHalf && index === ceilValue) {
      fill = 'url(#half)';
    }
  }

  const props = {
    primaryColor,
    primaryOffset,
    secondaryColor,
    secondaryOffset,
  };

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
      {index === 1 && <Gradient {...props} />}

      <polygon
        fill={fill}
        points="153,230.775 247.35,299.625 211.65,187.425 306,121.125 191.25,121.125 153,6.375 114.75,121.125 0,121.125 
      94.35,187.425 58.65,299.625"
        pointerEvents="none"
      />
    </svg>
  );
};

StarSVG.propTypes = {
  viewBox: PropTypes.string,
  size: PropTypes.number.isRequired,
  primaryColor: PropTypes.string.isRequired,
  secondaryColor: PropTypes.string.isRequired,
  onMouseLeave: PropTypes.func,
  onMouseMove: PropTypes.func,
  onChange: PropTypes.func,
  isHalf: PropTypes.bool.isRequired,
  fill: PropTypes.string,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  isEdit: PropTypes.bool.isRequired,
  primaryOffset: PropTypes.number.isRequired,
  secondaryOffset: PropTypes.number.isRequired,
};

StarSVG.defaultProps = {
  viewBox: '0 0 306 306',
  fill: 'url(#none)',
  primaryOffset: 50,
  secondaryOffset: 50,
};

export default StarSVG;
