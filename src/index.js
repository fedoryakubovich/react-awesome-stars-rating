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
    const { isEdit, isHalf } = this.props;

    if (isEdit) {
      let value = event.target.getAttribute('data-stars');

      if (isHalf) {
        const isMoreThanHalf = this.isMoreThanHalf(event);

        if (!isMoreThanHalf) {
          value -= 0.5;
        }
      }

      this.setState({ value });
    }
  }

  onMouseLeave() {
    const { isEdit } = this.props;

    if (isEdit) {
      this.setState({ value: 0 });
    }
  }

  onBlur() {
    const { isEdit } = this.props;

    if (isEdit) {
      this.setState({ value: 0 });
    }
  }

  onClick(event) {
    const { isEdit, onClick, isHalf } = this.props;

    if (isEdit) {
      let value = event.target.getAttribute('data-stars');

      if (isHalf) {
        const isMoreThanHalf = this.isMoreThanHalf(event);

        if (!isMoreThanHalf) {
          value -= 0.5;
        }
      }

      onClick(value);
    }
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
    const { isHalf, isEdit, onClick } = this.props;

    if (isEdit) {
      switch (keyCode) {
        case 37:
          this.onChangeStars(isHalf ? -0.5 : -1);
          break;
        case 39:
          this.onChangeStars(isHalf ? 0.5 : 1);
          break;
        case 13:
          if (isEdit) {
            onClick(value);
          }
          break;
        default:
          break;
      }
    }
  }

  renderStars() {
    const { count, size, isHalf } = this.props;
    const { value } = this.state;
    const starsList = [];

    for (let i = 1; i <= count; i++) {
      starsList.push(
        <span key={`char${i}`}>
          <Star
            index={i}
            value={value}
            onMouseMove={this.onMouseMove}
            onMouseLeave={this.onMouseLeave}
            onClick={this.onClick}
            onBlur={this.onBlur}
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
      <button
        onKeyDown={this.onKeyDown}
        style={styles.container}
        onBlur={this.onBlur}
      >
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
