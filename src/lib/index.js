import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Star from './star';
import styles from './styles';

class ReactStarsRating extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      isSubmitted: false,
    };

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.setState({ value: this.props.value });
    }
  }

  isMoreThanHalf(event) {
    const { size } = this.props;
    const point = event.clientX - event.target.getBoundingClientRect().left;

    return point > size / 2;
  }

  onMouseMove(event) {
    const { isHalf } = this.props;

    let value = Number(event.target.getAttribute('data-stars'));

    if (isHalf) {
      const isMoreThanHalf = this.isMoreThanHalf(event);

      if (!isMoreThanHalf) {
        value -= 0.5;
      }
    }

    this.setState({ value });
  }

  onMouseLeave() {
    const { value } = this.props;

    this.setState({ value: value || 0 });
  }

  onBlur() {
    const { onChange } = this.props;
    const { value } = this.state;

    onChange(value);
    this.setState({ isSubmitted: true });
  }

  onChange(event) {
    const { onChange, isHalf } = this.props;

    let value = Number(event.target.getAttribute('data-stars'));

    if (isHalf) {
      const isMoreThanHalf = this.isMoreThanHalf(event);

      if (!isMoreThanHalf) {
        value -= 0.5;
      }
    }

    onChange(value);
  }

  onChangeStars(newValue) {
    let { value } = this.state;
    const { count } = this.props;

    if (value > 0 || value < count) {
      const { isArrowSubmit, onChange } = this.props;

      if ((value > 0 && newValue < 0) || (value < count && newValue > 0)) {
        value = (value % 1 === 0.5 ? value : Math.round(value)) + newValue;
      }

      this.setState({ value });

      if (isArrowSubmit) {
        onChange(value);
      }
    }
  }

  onKeyDown(event) {
    const { keyCode } = event;
    const { value } = this.state;
    const { isHalf, onChange } = this.props;

    switch (keyCode) {
      case 37:
        this.onChangeStars(isHalf ? -0.5 : -1);
        break;
      case 39:
        this.onChangeStars(isHalf ? 0.5 : 1);
        break;
      case 13:
        onChange(value);
        break;
      default:
        break;
    }
  }

  renderStars() {
    const {
      count,
      size,
      isHalf,
      isEdit,
      primaryColor,
      secondaryColor,
      starGap,
      id,
    } = this.props;
    const { value } = this.state;
    const starsList = [];
    let props = { primaryColor, secondaryColor };
    const fullId = `fullId-${id}`;
    const halfId = `halfId-${id}`;
    const noneId = `noneId-${id}`;

    if (isEdit) {
      props = {
        ...props,
        onMouseMove: this.onMouseMove,
        onMouseLeave: this.onMouseLeave,
        onChange: this.onChange,
      };
    }

    for (let i = 1; i <= count; i++) {
      const style = i !== count ? { paddingRight: starGap } : null;

      starsList.push(
        <span
          key={`react-stars-rating-char${i}`}
          className={`star star-${i}`}
          style={style}
        >
          <Star
            index={i}
            value={value}
            size={size}
            isHalf={isHalf}
            fullId={fullId}
            halfId={halfId}
            noneId={noneId}
            {...props}
          />
        </span>,
      );
    }

    return starsList;
  }

  render() {
    const { isEdit, className, isArrowSubmit, id } = this.props;
    const stars = this.renderStars();
    let props = { tabIndex: -1 };
    const { isSubmitted } = this.state;

    if ((isEdit || isArrowSubmit) && !isSubmitted) {
      props = {
        onKeyDown: this.onKeyDown,
        onBlur: this.onBlur,
        tabIndex: 0,
      };
    }

    return (
      <span
        id={id}
        role="button"
        {...props}
        style={isEdit ? styles.activeContainer : styles.inActiveContainer}
        className={className}
      >
        {stars}
      </span>
    );
  }
}

ReactStarsRating.propTypes = {
  onChange: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  primaryColor: PropTypes.string.isRequired,
  secondaryColor: PropTypes.string.isRequired,
  isEdit: PropTypes.bool.isRequired,
  isHalf: PropTypes.bool.isRequired,
  className: PropTypes.string.isRequired,
  starGap: PropTypes.number.isRequired,
  isArrowSubmit: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
};

ReactStarsRating.defaultProps = {
  isEdit: true,
  isHalf: true,
  count: 5,
  value: 0,
  size: 25,
  primaryColor: 'orange',
  secondaryColor: 'grey',
  className: '',
  starGap: 0,
  isArrowSubmit: false,
  onChange: () => {},
  id: `${Date.now()}`,
};

export default ReactStarsRating;
