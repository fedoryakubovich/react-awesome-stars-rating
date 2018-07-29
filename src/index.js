import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Star from './star';
import styles from './styles';

class ReactStarsRating extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      stars: props.value,
    };

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
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

  onChangeStars(value) {
    let { stars } = this.state;
    const { count } = this.props;

    if ((stars > 0 && value < 0) || (stars < count && value > 0)) {
      stars += value;
      this.setState({ stars });
    }
  }

  onKeyDown(event) {
    const { keyCode } = event;
    const { isHalf } = this.props;

    switch (keyCode) {
      case 37:
        this.onChangeStars(isHalf ? -0.5 : -1);
        break;
      case 39:
        this.onChangeStars(isHalf ? 0.5 : 1);
        break;
      default:
        break;
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
      <button onKeyDown={this.onKeyDown} style={styles.container}>
        {stars}
      </button>
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
  value: 0,
  size: 25,
};

export default ReactStarsRating;
