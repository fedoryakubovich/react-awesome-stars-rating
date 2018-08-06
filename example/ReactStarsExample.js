import React, { PureComponent } from 'react';

import ReactStarsRating from '../src';

class ReactStarsExample extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: null,
      isEdit: true,
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    this.setState({
      value,
      isEdit: false,
    });

    console.log(value);
  }

  render() {
    const { isEdit, value } = this.state;

    return (
      <ReactStarsRating
        onChange={this.onChange}
        isEdit={isEdit}
        value={value}
      />
    );
  }
}

export default ReactStarsExample;
