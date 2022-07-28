import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';

import ReactStarsRating from './ReactStarsRating';

const Form = ({ handleSubmit, handleChange, isEdit, selectedValue }) => {
  return (
    <section>
      <form onSubmit={handleSubmit}>
        <Field
          id="reduxExample"
          name="reactStarsRating"
          component={ReactStarsRating}
          isEdit={isEdit}
          isHalf
          onChange={handleChange}
        />
      </form>

      <div>Selected value: {selectedValue}</div>
    </section>
  );
};

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  selectedValue: PropTypes.number,
};

Form.defaultProps = {
  isEdit: true,
};

export default reduxForm({ form: 'Form' })(Form);
