import React from 'react';
import PropTypes from 'prop-types';

const Gradient = ({
  primaryColor,
  primaryOffset,
  secondaryColor,
  secondaryOffset,
}) => {
  return (
    <defs>
      <linearGradient id="full">
        <stop offset="100%" stopColor={primaryColor} />
      </linearGradient>
      <linearGradient id="none">
        <stop offset="100%" stopColor={secondaryColor} />
      </linearGradient>
      <linearGradient id="half">
        <stop offset={`${primaryOffset}%`} stopColor={primaryColor} />
        <stop offset={`${secondaryOffset}%`} stopColor={secondaryColor} />
      </linearGradient>
    </defs>
  );
};

Gradient.propTypes = {
  primaryColor: PropTypes.string.isRequired,
  primaryOffset: PropTypes.number.isRequired,
  secondaryColor: PropTypes.string.isRequired,
  secondaryOffset: PropTypes.number.isRequired,
};

export default Gradient;
