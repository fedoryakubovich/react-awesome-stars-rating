import React from 'react';

import Form from './form';

const FormContainer = () => {
  const [state, setState] = React.useState({ isEdit: true });

  const handleChange = (value) => {
    setState((prevState) => ({
      ...prevState,
      isEdit: false,
      selectedValue: value,
    }));
  };

  return (
    <Form
      initialValues={{ reactStarsRating: 0 }}
      isEdit={state.isEdit}
      handleChange={handleChange}
      selectedValue={state.selectedValue}
    />
  );
};

export default FormContainer;
