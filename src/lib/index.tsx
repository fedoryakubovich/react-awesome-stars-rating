import {
  useEffect,
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';

import Star from './star';
import styles from './styles';

export type ReactStarsRatingProps = {
  id?: string;
  value?: number;
  onChange?: (value: number) => void;
  isEdit?: boolean;
  isHalf?: boolean;
  count?: number;
  size?: number;
  starGap?: number;
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
  isArrowSubmit?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
};

const ReactStarsRating = ({
  id,
  value = 0,
  onChange = () => {},
  isEdit = true,
  isHalf = true,
  count = 5,
  size = 25,
  starGap = 0,
  className = '',
  primaryColor = 'orange',
  secondaryColor = 'grey',
  isArrowSubmit = false,
  ariaLabel = 'Star rating',
  ariaLabelledBy,
}: ReactStarsRatingProps) => {
  const generatedId = useId().replace(/:/g, '');
  const resolvedId = id ?? `react-stars-rating-${generatedId}`;
  const [displayValue, setDisplayValue] = useState<number>(value);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const fullId = useMemo(() => `fullId-${resolvedId}`, [resolvedId]);
  const halfId = useMemo(() => `halfId-${resolvedId}`, [resolvedId]);
  const noneId = useMemo(() => `noneId-${resolvedId}`, [resolvedId]);

  const isMoreThanHalf = (event: MouseEvent<SVGSVGElement>) => {
    const point =
      event.clientX - event.currentTarget.getBoundingClientRect().left;
    return point > size / 2;
  };

  const getValueFromEvent = (event: MouseEvent<SVGSVGElement>) => {
    const index = Number(event.currentTarget.getAttribute('data-stars'));
    if (!isHalf) {
      return index;
    }

    return isMoreThanHalf(event) ? index : index - 0.5;
  };

  const handleMouseMove = (event: MouseEvent<SVGSVGElement>) => {
    if (!isEdit) {
      return;
    }

    setDisplayValue(getValueFromEvent(event));
  };

  const handleMouseLeave = () => {
    if (!isEdit) {
      return;
    }

    setDisplayValue(value || 0);
  };

  const handleBlur = () => {
    onChange(displayValue);
    setIsSubmitted(true);
  };

  const handleChange = (event: MouseEvent<SVGSVGElement>) => {
    if (!isEdit) {
      return;
    }

    const nextValue = getValueFromEvent(event);
    setDisplayValue(nextValue);
    onChange(nextValue);
  };

  const updateValueByStep = (delta: number) => {
    let nextValue = displayValue;
    const isHalfValue = nextValue % 1 === 0.5;

    if (!isHalfValue) {
      nextValue = Math.round(nextValue);
    }

    nextValue = Math.min(Math.max(nextValue + delta, 0), count);
    setDisplayValue(nextValue);

    if (isArrowSubmit) {
      onChange(nextValue);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (!isEdit && !isArrowSubmit) {
      return;
    }

    switch (event.key) {
      case 'ArrowLeft':
        updateValueByStep(isHalf ? -0.5 : -1);
        break;
      case 'ArrowRight':
        updateValueByStep(isHalf ? 0.5 : 1);
        break;
      case 'Enter':
        onChange(displayValue);
        break;
      default:
        break;
    }
  };

  const renderStars = () => {
    const starsList = [];

    for (let i = 1; i <= count; i += 1) {
      const style = i !== count ? { paddingRight: starGap } : undefined;

      starsList.push(
        <span
          key={`react-stars-rating-char${i}`}
          className={`star star-${i}`}
          style={style}
          data-testid="star"
        >
          <Star
            index={i}
            value={displayValue}
            size={size}
            isHalf={isHalf}
            fullId={fullId}
            halfId={halfId}
            noneId={noneId}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onChange={handleChange}
          />
        </span>,
      );
    }

    return starsList;
  };

  const interactiveProps = (isEdit || isArrowSubmit) && !isSubmitted;

  const clampedValue = Math.min(Math.max(displayValue, 0), count);

  return (
    <span
      id={resolvedId}
      role="slider"
      aria-label={ariaLabelledBy ? undefined : ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-valuemin={0}
      aria-valuemax={count}
      aria-valuenow={clampedValue}
      aria-valuetext={`${clampedValue} of ${count}`}
      tabIndex={interactiveProps ? 0 : -1}
      onKeyDown={interactiveProps ? handleKeyDown : undefined}
      onBlur={interactiveProps ? handleBlur : undefined}
      style={isEdit ? styles.activeContainer : styles.inActiveContainer}
      className={className}
      data-testid="react-awesome-stars-rating"
      data-value={displayValue}
      data-submitted={isSubmitted}
    >
      {renderStars()}
    </span>
  );
};

export { ReactStarsRating };
export default ReactStarsRating;
