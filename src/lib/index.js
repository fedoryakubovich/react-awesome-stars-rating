import React from 'react';
import PropTypes from 'prop-types';

import Star from './star';
import styles from './styles';

const ReactStarsRating = (props) => {
  const [state, setState] = React.useState({
    value: props.value,
    isSubmitted: false,
  });

  React.useEffect(() => {
    setState((prevState) => ({ ...prevState, value: props.value }));
  }, [props.value]);

  const isMoreThanHalf = (event) => {
    const point = event.clientX - event.target.getBoundingClientRect().left;

    return point > props.size / 2;
  };

  const onMouseMove = (event) => {
    let value = Number(event.target.getAttribute('data-stars'));

    if (props.isHalf) {
      if (!isMoreThanHalf(event)) {
        value -= 0.5;
      }
    }

    setState((prevState) => ({ ...prevState, value }));
  };

  const onMouseLeave = () => {
    setState((prevState) => ({ ...prevState, value: props.value || 0 }));
  };

  const onBlur = () => {
    props.onChange(state.value);
    setState((prevState) => ({ ...prevState, isSubmitted: true }));
  };

  const onChange = (event) => {
    let value = Number(event.target.getAttribute('data-stars'));

    if (props.isHalf) {
      if (!isMoreThanHalf(event)) {
        value -= 0.5;
      }
    }

    props.onChange(value);
  };

  const onChangeStars = (newValue) => {
    let { value } = state;

    if (value > 0 || value < props.count) {
      if (
        (value > 0 && newValue < 0) ||
        (value < props.count && newValue > 0)
      ) {
        value = (value % 1 === 0.5 ? value : Math.round(value)) + newValue;
      }

      setState((prevState) => ({ ...prevState, value }));

      if (props.isArrowSubmit) {
        props.onChange(value);
      }
    }
  };

  const onKeyDown = (event) => {
    switch (event.keyCode) {
      case 37:
        onChangeStars(props.isHalf ? -0.5 : -1);
        break;
      case 39:
        onChangeStars(props.isHalf ? 0.5 : 1);
        break;
      case 13:
        props.onChange(state.value);
        break;
      default:
        break;
    }
  };

  const renderStars = () => {
    const starsList = [];
    let starProps = {
      primaryColor: props.primaryColor,
      secondaryColor: props.secondaryColor,
    };
    const fullId = `fullId-${props.id}`;
    const halfId = `halfId-${props.id}`;
    const noneId = `noneId-${props.id}`;

    if (props.isEdit) {
      starProps = { ...starProps, onMouseMove, onMouseLeave, onChange };
    }

    for (let i = 1; i <= props.count; i++) {
      const style = i !== props.count ? { paddingRight: props.starGap } : null;

      starsList.push(
        <span
          key={`react-stars-rating-char${i}`}
          className={`star star-${i}`}
          style={style}
          data-testid="star"
        >
          <Star
            index={i}
            value={state.value}
            size={props.size}
            isHalf={props.isHalf}
            fullId={fullId}
            halfId={halfId}
            noneId={noneId}
            {...starProps}
          />
        </span>,
      );
    }

    return starsList;
  };

  let resultProps = { tabIndex: -1 };

  if ((props.isEdit || props.isArrowSubmit) && !state.isSubmitted) {
    resultProps = { onKeyDown, onBlur, tabIndex: 0 };
  }

  return (
    <span
      id={props.id}
      role="button"
      {...resultProps}
      style={props.isEdit ? styles.activeContainer : styles.inActiveContainer}
      className={props.className}
      data-testid="react-awesome-stars-rating"
      data-value={state.value}
      data-submitted={state.isSubmitted}
    >
      {renderStars()}
    </span>
  );
};

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
