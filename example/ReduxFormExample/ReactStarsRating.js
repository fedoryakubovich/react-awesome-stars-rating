import React from 'react';
import PropTypes from 'prop-types';

import ReactStarsRating from '../../src';

const ReactStarsRatingComponent = ({ input, isEdit }) => {
  return <ReactStarsRating {...input} isEdit={isEdit} />;
};

ReactStarsRatingComponent.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  input: PropTypes.object.isRequired,
};

export default ReactStarsRatingComponent;
