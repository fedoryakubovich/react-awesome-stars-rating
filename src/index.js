import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Star from './star';
import styles from './styles';

class ReactStarsRating extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    };

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  isMoreThanHalf(event) {
    const { size } = this.props;
    const point = event.clientX - event.target.getBoundingClientRect().left;

    return point > size / 2;
  }

  onMouseMove(event) {
    const { isHalf } = this.props;

    let value = event.target.getAttribute('data-stars');

    if (isHalf) {
      const isMoreThanHalf = this.isMoreThanHalf(event);

      if (!isMoreThanHalf) {
        value -= 0.5;
      }
    }

    this.setState({ value });
  }

  onMouseLeave() {
    this.setState({ value: 0 });
  }

  onBlur() {
    const { onClick } = this.props;
    const { value } = this.state;

    onClick(value);
  }

  onClick(event) {
    const { onClick, isHalf } = this.props;

    let value = event.target.getAttribute('data-stars');

    if (isHalf) {
      const isMoreThanHalf = this.isMoreThanHalf(event);

      if (!isMoreThanHalf) {
        value -= 0.5;
      }
    }

    onClick(value);
  }

  onChangeStars(newValue) {
    let { value } = this.state;
    const { count } = this.props;

    if ((value > 0 && newValue < 0) || (value < count && newValue > 0)) {
      value += newValue;

      this.setState({ value });
    }
  }

  onKeyDown(event) {
    const { keyCode } = event;
    const { value } = this.state;
    const { isHalf, onClick } = this.props;

    switch (keyCode) {
      case 37:
        this.onChangeStars(isHalf ? -0.5 : -1);
        break;
      case 39:
        this.onChangeStars(isHalf ? 0.5 : 1);
        break;
      case 13:
        onClick(value);
        break;
      default:
        break;
    }
  }

  renderStars() {
    const { count, size, isHalf, isEdit } = this.props;
    const { value } = this.state;
    const starsList = [];
    let props = {};

    if (isEdit) {
      props = {
        onMouseMove: this.onMouseMove,
        onMouseLeave: this.onMouseLeave,
        onClick: this.onClick,
      };
    }

    for (let i = 1; i <= count; i++) {
      starsList.push(
        <span key={`react-stars-rating-char${i}`}>
          <Star
            index={i}
            value={value}
            size={size}
            isHalf={isHalf}
            {...props}
          />
        </span>,
      );
    }

    return starsList;
  }

  render() {
    const { isEdit } = this.props;
    const stars = this.renderStars();
    let props = { tabIndex: -1 };

    if (isEdit) {
      props = {
        onKeyDown: this.onKeyDown,
        onBlur: this.onBlur,
      };
    }

    return (
      <button style={styles.container} {...props}>
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
