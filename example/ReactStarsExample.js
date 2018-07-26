import React, { PureComponent } from 'react';
import ReactStarsRating from '../src';

class ReactStarsExample extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: null,
      isEdit: true,
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick(value) {
    this.setState({
      value,
      isEdit: false,
    });
  }

  render() {
    const { isEdit, value } = this.state;

    return (
      <ReactStarsRating onClick={this.onClick} isEdit={isEdit} value={value} />
    );
  }
}

export default ReactStarsExample;
