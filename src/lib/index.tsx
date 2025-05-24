import { KeyboardEvent, MouseEvent, useId, useState } from 'react';

import Star from './star';
import { ReactAwesomeStarsRatingProps } from './types';

export default function ReactAwesomeStarsRating({
  isEdit = true,
  isHalf = true,
  count = 5,
  value: propsValue = 0,
  size = 25,
  primaryColor = 'orange',
  secondaryColor = 'grey',
  className = '',
  starGap = 0,
  isArrowSubmit = false,
  onChange = () => {},
  id,
}: ReactAwesomeStarsRatingProps) {
  const [value, setValue] = useState(propsValue);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const componentId = useId();

  const isMoreThanHalf = (event: MouseEvent<SVGSVGElement>) => {
    const target = event.target as SVGSVGElement;
    const point = event.clientX - target.getBoundingClientRect().left;

    return point > size / 2;
  };

  const onMouseMove = (event: MouseEvent<SVGSVGElement>) => {
    const target = event.target as HTMLSpanElement;
    let newValue = Number(target.getAttribute('data-stars'));

    if (isHalf && !isMoreThanHalf(event)) newValue -= 0.5;

    setValue(newValue);
  };

  const onMouseLeave = () => {
    setValue(propsValue || 0);
  };

  const onBlur = () => {
    onChange(value);
    setIsSubmitted(true);
  };

  const handleChange = (event: MouseEvent<SVGSVGElement>) => {
    const target = event.target as SVGSVGElement;
    let newValue = Number(target.getAttribute('data-stars'));

    if (isHalf && !isMoreThanHalf(event)) newValue -= 0.5;

    onChange(newValue);
  };

  const onChangeStars = (newValue: number) => {
    let resultValue = value;

    if (resultValue > 0 || resultValue < count) {
      if ((resultValue > 0 && newValue < 0) || (resultValue < count && newValue > 0)) {
        resultValue = (value % 1 === 0.5 ? value : Math.round(value)) + newValue;
      }

      setValue(resultValue);

      if (isArrowSubmit) onChange(resultValue);
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') onChangeStars(isHalf ? -0.5 : -1);
    else if (event.key === 'ArrowRight') onChangeStars(isHalf ? 0.5 : 1);
    else if (event.key === 'Enter') onChange(value);
  };

  const renderStars = () => {
    const starsList = [];
    const fullId = `fullId-${id}`;
    const halfId = `halfId-${id}`;
    const noneId = `noneId-${id}`;

    for (let i = 1; i <= count; i++) {
      starsList.push(
        <span
          key={`react-stars-rating-char${i}`}
          className={`star star-${i}`}
          style={i !== count ? { paddingRight: starGap } : undefined}
          data-testid="star"
        >
          <Star
            index={i}
            value={value}
            size={size}
            isHalf={isHalf}
            fullId={fullId}
            halfId={halfId}
            noneId={noneId}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            onMouseMove={isEdit ? onMouseMove : undefined}
            onMouseLeave={isEdit ? onMouseLeave : undefined}
            onChange={isEdit ? handleChange : undefined}
          />
        </span>,
      );
    }

    return starsList;
  };

  const isAvailable = (isEdit || isArrowSubmit) && !isSubmitted;

  return (
    <span
      id={id || componentId}
      role="button"
      onKeyDown={isAvailable ? onKeyDown : undefined}
      onBlur={isAvailable ? onBlur : undefined}
      tabIndex={isAvailable ? 0 : -1}
      style={isEdit ? { border: 'none' } : { border: 'none', outline: 0 }}
      className={className}
      data-testid="react-awesome-stars-rating"
      data-value={value}
      data-submitted={isSubmitted}
    >
      {renderStars()}
    </span>
  );
}
