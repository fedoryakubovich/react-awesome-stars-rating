import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Star from './star';

class ReactStarsRating extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      stars: props.value,
    };

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  isMoreThanHalf(event) {
    const { size } = this.props;
    const point = event.clientX - event.target.getBoundingClientRect().left;

    return point > size / 2;
  }

  onMouseMove(event) {
    const { isEdit, isHalf } = this.props;

    if (isEdit) {
      let stars = event.target.getAttribute('data-stars');

      if (isHalf) {
        const isMoreThanHalf = this.isMoreThanHalf(event);

        if (!isMoreThanHalf) {
          stars -= 0.5;
        }
      }

      this.setState({
        stars,
      });
    }
  }

  onMouseLeave() {
    const { isEdit } = this.props;

    if (isEdit) {
      this.setState({
        stars: null,
      });
    }
  }

  onClick(event) {
    const { isEdit, onClick, isHalf } = this.props;

    if (isEdit) {
      let stars = event.target.getAttribute('data-stars');

      if (isHalf) {
        const isMoreThanHalf = this.isMoreThanHalf(event);

        if (!isMoreThanHalf) {
          stars -= 0.5;
        }
      }

      onClick(stars);
    }
  }

  renderStars() {
    const { count, size, isHalf } = this.props;
    const { stars } = this.state;
    const starsList = [];

    for (let i = 1; i <= count; i++) {
      starsList.push(
        <span key={`char${i}`}>
          <Star
            index={i}
            stars={stars}
            onMouseMove={this.onMouseMove}
            onMouseLeave={this.onMouseLeave}
            onClick={this.onClick}
            size={size}
            isHalf={isHalf}
          />
        </span>,
      );
    }

    return starsList;
  }

  render() {
    const stars = this.renderStars();

    return (
      <div>
        <span>{stars}</span>
      </div>
    );
  }
}

ReactStarsRating.propTypes = {
  isEdit: PropTypes.bool,
  isHalf: PropTypes.bool,
  onClick: PropTypes.func,
  count: PropTypes.number,
  value: PropTypes.number,
  size: PropTypes.number,
};

ReactStarsRating.defaultProps = {
  isEdit: true,
  isHalf: true,
  count: 5,
  value: null,
  size: 25,
};

export default ReactStarsRating;
