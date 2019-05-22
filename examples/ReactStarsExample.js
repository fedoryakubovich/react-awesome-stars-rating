import React, { PureComponent } from 'react';

import ReactStarsRating from '../src';

class ReactStarsExample extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: 3.2,
      isEdit: true,
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    this.setState({
      value,
      isEdit: false,
      selectedValue: value,
    });
  }

  render() {
    const { isEdit, value, selectedValue } = this.state;
    return (
      <section>
        <ReactStarsRating
          onChange={this.onChange}
          isEdit={isEdit}
          value={value}
          isHalf={false}
          selectedValue={selectedValue}
        />

        <div>Selected value: {selectedValue}</div>
      </section>
    );
  }
}

export default ReactStarsExample;
