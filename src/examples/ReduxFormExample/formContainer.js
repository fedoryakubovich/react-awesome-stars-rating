import React, { PureComponent } from 'react';

import Form from './form';

class FormContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { isEdit: true };
    this.handleChange = this.handleChange.bind(this);
    this.initialValues = {
      reactStarsRating: 0,
    };
  }

  handleChange(value) {
    this.setState({
      isEdit: false,
      selectedValue: value,
    });
  }

  render() {
    const { isEdit, selectedValue } = this.state;
    const props = {
      initialValues: this.initialValues,
      isEdit,
      selectedValue,
      handleChange: this.handleChange,
    };

    return <Form {...props} />;
  }
}

export default FormContainer;
