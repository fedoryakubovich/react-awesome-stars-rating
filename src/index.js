import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ReactStarsRating extends PureComponent {
  constructor(props) {
    super(props);
  }

  renderStars() {
    const { count, char } = this.props;
    const stars = [];

    for (let i = 0; i < count; i++) {
      stars.push(<span key={`char${i}`}>{char}</span>);
    }

    return stars;
  }

  render() {
    const stars = this.renderStars();

    return (
      <div>
        <h2>Hello React!</h2>
        <div>{stars}</div>
      </div>
    );
  }
}

ReactStarsRating.propTypes = {};

ReactStarsRating.defaultProps = {
  isEditable: true,
  count: 5,
  char: '★',
};

export default ReactStarsRating;
