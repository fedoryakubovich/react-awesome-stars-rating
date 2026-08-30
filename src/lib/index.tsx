'use client';

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';

import Star from './star';
import styles from './styles';

export type ReactStarsRatingProps = {
  /**
   * `id` of the rendered element. Defaults to a generated, SSR-safe id, so
   * only set this when something else needs to reference the control.
   */
  id?: string;
  /**
   * Current rating. Values outside `0` to {@link ReactStarsRatingProps.count}
   * are clamped before they are reported to assistive technology.
   *
   * @defaultValue 0
   */
  value?: number;
  /**
   * Called with the new rating on click, on `Enter`, and on blur — and on
   * every arrow key when {@link ReactStarsRatingProps.isArrowSubmit} is set.
   * Hovering never calls it.
   */
  onChange?: (value: number) => void;
  /**
   * Whether the rating can be changed. When `false` the control has no hover
   * preview, no keyboard handling, and is removed from the tab order.
   *
   * @defaultValue true
   */
  isEdit?: boolean;
  /**
   * Whether half stars can be selected. When `true` the half of the star the
   * pointer is over decides between `n - 0.5` and `n`, and the arrow keys step
   * by `0.5` instead of `1`.
   *
   * @defaultValue true
   */
  isHalf?: boolean;
  /**
   * How many stars to render. Also becomes `aria-valuemax`.
   *
   * @defaultValue 5
   */
  count?: number;
  /**
   * Width of one star, in pixels.
   *
   * @defaultValue 25
   */
  size?: number;
  /**
   * Space between stars, in pixels. Applied as right padding to every star
   * except the last.
   *
   * @defaultValue 0
   */
  starGap?: number;
  /**
   * Class name for the container element. The stars themselves always carry
   * `star` and `star-1`, `star-2`, … class names.
   *
   * @defaultValue ''
   */
  className?: string;
  /**
   * Any CSS color for the filled part of a star.
   *
   * @defaultValue 'orange'
   */
  primaryColor?: string;
  /**
   * Any CSS color for the empty part of a star.
   *
   * @defaultValue 'grey'
   */
  secondaryColor?: string;
  /**
   * Report every arrow-key step through
   * {@link ReactStarsRatingProps.onChange} immediately, instead of waiting for
   * `Enter` or blur.
   *
   * @defaultValue false
   */
  isArrowSubmit?: boolean;
  /**
   * Accessible name for the control. Ignored when
   * {@link ReactStarsRatingProps.ariaLabelledBy} is set.
   *
   * @defaultValue 'Star rating'
   */
  ariaLabel?: string;
  /**
   * `id` of an element that labels this control, for when the label already
   * exists on the page. Takes precedence over
   * {@link ReactStarsRatingProps.ariaLabel}.
   */
  ariaLabelledBy?: string;
};

/**
 * A star rating control. Renders as a single `role="slider"` element that
 * reports its value through `aria-valuenow` and `aria-valuetext`.
 *
 * @example
 * ```tsx
 * const [value, setValue] = useState(3.5);
 *
 * <ReactStarsRating value={value} onChange={setValue} isHalf size={32} />
 * ```
 */
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
  const [displayState, setDisplayState] = useState(() => ({
    sourceValue: value,
    displayValue: value,
  }));
  const pendingKeyboardValueRef = useRef<number | null>(null);
  const displayValue =
    displayState.sourceValue === value ? displayState.displayValue : value;
  const setDisplayValue = (nextValue: number) => {
    setDisplayState({ sourceValue: value, displayValue: nextValue });
  };

  const fullId = useMemo(() => `fullId-${resolvedId}`, [resolvedId]);
  const halfId = useMemo(() => `halfId-${resolvedId}`, [resolvedId]);
  const noneId = useMemo(() => `noneId-${resolvedId}`, [resolvedId]);

  useEffect(() => {
    pendingKeyboardValueRef.current = null;
  }, [value]);

  const isMoreThanHalf = (event: MouseEvent<SVGSVGElement>) => {
    const point =
      event.clientX - event.currentTarget.getBoundingClientRect().left;
    return point > size / 2;
  };

  const getValueFromEvent = (
    event: MouseEvent<SVGSVGElement>,
    index: number,
  ) => {
    if (!isHalf) {
      return index;
    }

    return isMoreThanHalf(event) ? index : index - 0.5;
  };

  const handleMouseMove = (event: MouseEvent<SVGSVGElement>, index: number) => {
    if (!isEdit) {
      return;
    }

    setDisplayValue(getValueFromEvent(event, index));
  };

  const handleMouseLeave = () => {
    if (!isEdit) {
      return;
    }

    setDisplayValue(value || 0);
  };

  const handleBlur = () => {
    const pendingValue = pendingKeyboardValueRef.current;

    if (pendingValue !== null) {
      pendingKeyboardValueRef.current = null;
      onChange(pendingValue);
    }
  };

  const handleChange = (event: MouseEvent<SVGSVGElement>, index: number) => {
    if (!isEdit) {
      return;
    }

    const nextValue = getValueFromEvent(event, index);
    setDisplayValue(nextValue);
    pendingKeyboardValueRef.current = null;
    onChange(nextValue);
  };

  const updateValueFromKeyboard = (nextValue: number) => {
    const clampedNextValue = Math.min(Math.max(nextValue, 0), count);

    if (clampedNextValue === displayValue) {
      return;
    }

    setDisplayValue(clampedNextValue);

    if (isArrowSubmit) {
      pendingKeyboardValueRef.current = null;
      onChange(clampedNextValue);
    } else {
      pendingKeyboardValueRef.current = clampedNextValue;
    }
  };

  const updateValueByStep = (delta: number) => {
    const normalizedValue =
      displayValue % 1 === 0.5 ? displayValue : Math.round(displayValue);
    updateValueFromKeyboard(normalizedValue + delta);
  };

  // Only attached while editing is enabled, so no isEdit guard is needed.
  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault();
        updateValueByStep(isHalf ? -0.5 : -1);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        updateValueByStep(isHalf ? 0.5 : 1);
        break;
      case 'Home':
        event.preventDefault();
        updateValueFromKeyboard(0);
        break;
      case 'End':
        event.preventDefault();
        updateValueFromKeyboard(count);
        break;
      case 'Enter':
        event.preventDefault();
        pendingKeyboardValueRef.current = null;
        onChange(displayValue);
        break;
      default:
        break;
    }
  };

  const renderStars = () =>
    Array.from({ length: count }, (_, position) => {
      const index = position + 1;
      const style = index !== count ? { paddingRight: starGap } : undefined;

      return (
        <span
          key={`react-stars-rating-char${index}`}
          className={`star star-${index}`}
          style={style}
        >
          <Star
            index={index}
            value={displayValue}
            size={size}
            isHalf={isHalf}
            fullId={fullId}
            halfId={halfId}
            noneId={noneId}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            onMouseMove={(event) => handleMouseMove(event, index)}
            onMouseLeave={handleMouseLeave}
            onChange={(event) => handleChange(event, index)}
          />
        </span>
      );
    });

  const interactiveProps = isEdit;

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
      aria-readonly={!isEdit}
      tabIndex={interactiveProps ? 0 : -1}
      onKeyDown={interactiveProps ? handleKeyDown : undefined}
      onBlur={interactiveProps ? handleBlur : undefined}
      style={isEdit ? styles.activeContainer : styles.inActiveContainer}
      className={className}
    >
      {renderStars()}
    </span>
  );
};

export { ReactStarsRating };
export default ReactStarsRating;
