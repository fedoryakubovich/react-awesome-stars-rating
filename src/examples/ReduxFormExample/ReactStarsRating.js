import PropTypes from 'prop-types';
import React from 'react';

import ReactStarsRating from '../../lib';

const ReactStarsRatingComponent = ({ input, isEdit }) => {
  return <ReactStarsRating {...input} isEdit={isEdit} />;
};

ReactStarsRatingComponent.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  input: PropTypes.object.isRequired,
};

export default ReactStarsRatingComponent;
