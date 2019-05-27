import React from 'react';
import PropTypes from 'prop-types';

const Gradient = ({
  primaryColor,
  secondaryColor,
  offset,
  index,
  value,
  fullId,
  halfId,
  noneId,
}) => {
  if (index === 1) {
    offset = (value % 1) * 100;
  }

  return (
    index === 1 && (
      <defs>
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
    )
  );
};

Gradient.propTypes = {
  primaryColor: PropTypes.string.isRequired,
  secondaryColor: PropTypes.string.isRequired,
  offset: PropTypes.number,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default Gradient;
