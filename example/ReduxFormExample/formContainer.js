import React, { PureComponent } from 'react';

import Form from './form';

class FormContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { isEdit: true };
    this.onSubmit = this.onSubmit.bind(this);
    this.initialValues = {
      reactStarsRating: 0,
    };
  }

  onSubmit(values) {
    const { reactStarsRating } = values;

    this.setState({
      isEdit: false,
      selectedValue: reactStarsRating,
    });
  }

  render() {
    const { isEdit, selectedValue } = this.state;
    const props = {
      onSubmit: this.onSubmit,
      initialValues: this.initialValues,
      isEdit,
      selectedValue,
    };

    return <Form {...props} />;
  }
}

export default FormContainer;
