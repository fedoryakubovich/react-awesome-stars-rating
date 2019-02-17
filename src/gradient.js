import React from 'react';
import PropTypes from 'prop-types';

const Gradient = ({ primaryColor, secondaryColor, offset, index, value }) => {
  if (index === 1) {
    offset = (value % 1) * 100;
  }

  return (
    index === 1 && (
      <defs>
        <linearGradient id="full">
          <stop offset="100%" stopColor={primaryColor} />
        </linearGradient>
        <linearGradient id="none">
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
        <linearGradient id="half">
          <stop offset={`${offset}%`} stopColor={primaryColor} />
          <stop offset={`${offset}%`} stopColor={secondaryColor} />
        </linearGradient>
      </defs>
    )
  );
};

Gradient.propTypes = {
  primaryColor: PropTypes.string.isRequired,
  secondaryColor: PropTypes.string.isRequired,
  offset: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default Gradient;
