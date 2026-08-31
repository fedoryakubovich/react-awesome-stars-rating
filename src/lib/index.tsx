'use client';

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
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
   * Controlled current rating. Values outside `0` to
   * {@link ReactStarsRatingProps.count} are clamped. When omitted, the
   * component manages its own value.
   */
  value?: number;
  /**
   * Initial value when the component is uncontrolled. Ignored when
   * {@link ReactStarsRatingProps.value} is provided.
   *
   * @defaultValue 0
   */
  defaultValue?: number;
  /**
   * Called with the new rating on click, on `Enter`, and on blur — and on
   * every arrow key when {@link ReactStarsRatingProps.isArrowSubmit} is set.
   * Hovering never calls it.
   */
  onChange?: (value: number) => void;
  /** Name of the hidden input contributed to the nearest HTML form. */
  name?: string;
  /** Disable interaction and native form submission. */
  disabled?: boolean;
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
   * Optional color for the portion being previewed by the pointer. The saved
   * value keeps {@link ReactStarsRatingProps.primaryColor}, so moving below an
   * existing rating can display preview, saved, and inactive regions at once.
   * When omitted, hover previews retain the original two-color behavior.
   */
  hoverColor?: string;
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
  /**
   * Formats the accessible value description.
   *
   * @defaultValue `(value, count) => `${value} of ${count}``
   */
  getValueText?: (value: number, count: number) => string;
};

const normalizeCount = (value: number) =>
  Number.isFinite(value) && value >= 1 ? Math.floor(value) : 5;

const normalizeDimension = (value: number, fallback: number, minimum = 0) =>
  Number.isFinite(value) && value >= minimum ? value : fallback;

const normalizeValue = (value: number, count: number, isHalf: boolean) => {
  const finiteValue = Number.isFinite(value) ? value : 0;
  const clampedValue = Math.min(Math.max(finiteValue, 0), count);

  return isHalf ? clampedValue : Math.round(clampedValue);
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
  value,
  defaultValue = 0,
  onChange = () => {},
  name,
  disabled = false,
  isEdit = true,
  isHalf = true,
  count = 5,
  size = 25,
  starGap = 0,
  className = '',
  primaryColor = 'orange',
  secondaryColor = 'grey',
  hoverColor,
  isArrowSubmit = false,
  ariaLabel = 'Star rating',
  ariaLabelledBy,
  getValueText = (currentValue, maximum) => `${currentValue} of ${maximum}`,
}: ReactStarsRatingProps) => {
  const normalizedCount = normalizeCount(count);
  const normalizedSize = normalizeDimension(size, 25, Number.EPSILON);
  const normalizedGap = normalizeDimension(starGap, 0);
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    normalizeValue(defaultValue, normalizedCount, isHalf),
  );
  const committedValue = normalizeValue(
    value ?? uncontrolledValue,
    normalizedCount,
    isHalf,
  );
  const generatedId = useId().replace(/:/g, '');
  const resolvedId = id ?? `react-stars-rating-${generatedId}`;
  const [displayState, setDisplayState] = useState(() => ({
    sourceValue: committedValue,
    displayValue: committedValue,
  }));
  const pendingKeyboardValueRef = useRef<number | null>(null);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const displayValue =
    displayState.sourceValue === committedValue
      ? displayState.displayValue
      : committedValue;
  const setDisplayValue = (nextValue: number) => {
    setDisplayState({
      sourceValue: committedValue,
      displayValue: normalizeValue(nextValue, normalizedCount, isHalf),
    });
  };

  const fullId = useMemo(() => `fullId-${resolvedId}`, [resolvedId]);
  const halfId = useMemo(() => `halfId-${resolvedId}`, [resolvedId]);
  const noneId = useMemo(() => `noneId-${resolvedId}`, [resolvedId]);

  useEffect(() => {
    pendingKeyboardValueRef.current = null;
  }, [committedValue]);

  useEffect(() => {
    if (isControlled) {
      return;
    }

    const form = containerRef.current?.closest('form');
    const handleReset = () => {
      const resetValue = normalizeValue(defaultValue, normalizedCount, isHalf);
      pendingKeyboardValueRef.current = null;
      setHoverValue(null);
      setUncontrolledValue(resetValue);
      setDisplayState({ sourceValue: resetValue, displayValue: resetValue });
    };

    form?.addEventListener('reset', handleReset);
    return () => form?.removeEventListener('reset', handleReset);
  }, [defaultValue, isControlled, isHalf, normalizedCount]);

  const getValueFromEvent = (
    event: PointerEvent<SVGSVGElement>,
    fallbackIndex: number,
  ) => {
    const stars = Array.from(
      containerRef.current?.querySelectorAll('svg') ?? [],
    );
    const selectedStar =
      stars.find((star) => {
        const bounds = star.getBoundingClientRect();
        return bounds.width > 0 && event.clientX <= bounds.right;
      }) ??
      stars[stars.length - 1] ??
      event.currentTarget;
    const starPosition = stars.indexOf(selectedStar) + 1;
    const selectedIndex = starPosition || fallbackIndex;

    if (!isHalf) {
      return selectedIndex;
    }

    const bounds = selectedStar.getBoundingClientRect();
    const point = event.clientX - bounds.left;

    // Rendered geometry keeps half selection correct under consumer scaling.
    return point > bounds.width / 2 ? selectedIndex : selectedIndex - 0.5;
  };

  const handlePointerMove = (
    event: PointerEvent<SVGSVGElement>,
    index: number,
  ) => {
    if (!isEdit || disabled) {
      return;
    }

    const isCaptured =
      typeof event.currentTarget.hasPointerCapture === 'function' &&
      event.currentTarget.hasPointerCapture(event.pointerId);
    if (event.pointerType === 'touch' && !isCaptured) {
      return;
    }

    const nextValue = getValueFromEvent(event, index);
    pendingKeyboardValueRef.current = null;
    setHoverValue(nextValue);
    setDisplayValue(nextValue);
  };

  const handlePointerLeave = (event: PointerEvent<SVGSVGElement>) => {
    if (!isEdit || disabled || event.buttons !== 0) {
      return;
    }

    setHoverValue(null);
    setDisplayValue(committedValue);
  };

  const handleBlur = () => {
    const pendingValue = pendingKeyboardValueRef.current;

    if (pendingValue !== null) {
      pendingKeyboardValueRef.current = null;
      commitValue(pendingValue);
    }
  };

  const commitValue = (nextValue: number) => {
    const normalizedValue = normalizeValue(nextValue, normalizedCount, isHalf);
    setDisplayValue(normalizedValue);
    if (!isControlled) {
      setUncontrolledValue(normalizedValue);
    }
    onChange(normalizedValue);
  };

  const handlePointerDown = (
    event: PointerEvent<SVGSVGElement>,
    index: number,
  ) => {
    if (!isEdit || disabled) {
      return;
    }

    containerRef.current?.focus();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    pendingKeyboardValueRef.current = null;
    const nextValue = getValueFromEvent(event, index);
    setHoverValue(nextValue);
    setDisplayValue(nextValue);
  };

  const handlePointerUp = (
    event: PointerEvent<SVGSVGElement>,
    index: number,
  ) => {
    if (!isEdit || disabled) {
      return;
    }

    commitValue(getValueFromEvent(event, index));
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    if (event.pointerType === 'touch') {
      setHoverValue(null);
    }
  };

  const handlePointerCancel = (event: PointerEvent<SVGSVGElement>) => {
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    pendingKeyboardValueRef.current = null;
    setHoverValue(null);
    setDisplayValue(committedValue);
  };

  const updateValueFromKeyboard = (nextValue: number) => {
    const clampedNextValue = normalizeValue(nextValue, normalizedCount, isHalf);

    if (clampedNextValue === displayValue) {
      return;
    }

    setDisplayValue(clampedNextValue);

    if (isArrowSubmit) {
      pendingKeyboardValueRef.current = null;
      commitValue(clampedNextValue);
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
        updateValueFromKeyboard(normalizedCount);
        break;
      case 'Enter':
        event.preventDefault();
        pendingKeyboardValueRef.current = null;
        commitValue(displayValue);
        break;
      default:
        break;
    }
  };

  const renderStars = () =>
    Array.from({ length: normalizedCount }, (_, position) => {
      const index = position + 1;
      const style =
        index !== normalizedCount ? { paddingRight: normalizedGap } : undefined;

      return (
        <span
          key={`react-stars-rating-char${index}`}
          className={`star star-${index}`}
          style={style}
        >
          <Star
            index={index}
            value={displayValue}
            size={normalizedSize}
            isHalf={isHalf}
            fullId={fullId}
            halfId={halfId}
            noneId={noneId}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            hoverColor={hoverColor}
            hoverValue={hoverValue}
            committedValue={committedValue}
            onPointerMove={(event) => handlePointerMove(event, index)}
            onPointerLeave={handlePointerLeave}
            onPointerDown={(event) => handlePointerDown(event, index)}
            onPointerUp={(event) => handlePointerUp(event, index)}
            onPointerCancel={handlePointerCancel}
          />
        </span>
      );
    });

  const interactiveProps = isEdit && !disabled;

  const clampedValue = normalizeValue(displayValue, normalizedCount, isHalf);

  return (
    <span
      ref={containerRef}
      id={resolvedId}
      role="slider"
      aria-label={ariaLabelledBy ? undefined : ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-valuemin={0}
      aria-valuemax={normalizedCount}
      aria-valuenow={clampedValue}
      aria-valuetext={getValueText(clampedValue, normalizedCount)}
      aria-orientation="horizontal"
      aria-readonly={!isEdit}
      aria-disabled={disabled || undefined}
      tabIndex={interactiveProps ? 0 : -1}
      onKeyDown={interactiveProps ? handleKeyDown : undefined}
      onBlur={interactiveProps ? handleBlur : undefined}
      style={isEdit ? styles.activeContainer : styles.inActiveContainer}
      className={className}
    >
      {renderStars()}
      {name ? (
        <input
          type="hidden"
          name={name}
          value={committedValue}
          disabled={disabled}
        />
      ) : null}
    </span>
  );
};

export { ReactStarsRating };
export default ReactStarsRating;
