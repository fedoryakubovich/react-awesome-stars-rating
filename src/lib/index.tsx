'use client';

import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';

import Star from './star';
import styles from './styles';

type ReservedSpanProps =
  | 'aria-disabled'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-orientation'
  | 'aria-readonly'
  | 'aria-valuemax'
  | 'aria-valuemin'
  | 'aria-valuenow'
  | 'aria-valuetext'
  | 'children'
  | 'className'
  | 'dangerouslySetInnerHTML'
  | 'defaultValue'
  | 'dir'
  | 'id'
  | 'onChange'
  | 'onKeyDown'
  | 'onPointerCancel'
  | 'onPointerDown'
  | 'onPointerLeave'
  | 'onPointerMove'
  | 'onPointerUp'
  | 'role'
  | 'style'
  | 'tabIndex';

export type ReactStarsRatingStyle = CSSProperties & {
  '--stars-rating-focus-color'?: string;
  '--stars-rating-gap'?: string;
  '--stars-rating-primary-color'?: string;
  '--stars-rating-secondary-color'?: string;
  '--stars-rating-size'?: string;
};

export type ReactStarsRatingProps = Omit<
  ComponentPropsWithoutRef<'span'>,
  ReservedSpanProps
> & {
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
   * Called when a pointer gesture commits, on `Enter`, and on blur — and on
   * every arrow key when {@link ReactStarsRatingProps.isArrowSubmit} is set.
   * Pointer previews never call it.
   */
  onChange?: (value: number) => void;
  /** Name of the hidden input contributed to the nearest HTML form. */
  name?: string;
  /** `id` of a form to associate with the hidden input. */
  form?: string;
  /** Layout, fill and horizontal keyboard direction. Defaults to `ltr`. */
  dir?: 'ltr' | 'rtl';
  /** Disable interaction and native form submission. */
  disabled?: boolean;
  /** Prevent editing while keeping the current value exposed to assistive technology. */
  readOnly?: boolean;
  /**
   * Whether the rating can be changed. When `false` the control has no hover
   * preview, no keyboard handling, and is removed from the tab order.
   *
   * @defaultValue true
   * @deprecated Prefer {@link ReactStarsRatingProps.readOnly}.
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
   * Space between stars, in pixels. Applied as inline-end padding to every star
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
  /** Container styles, including the documented `--stars-rating-*` variables. */
  style?: ReactStarsRatingStyle;
  /**
   * Any CSS color for the filled part of a star.
   *
   * @defaultValue 'var(--stars-rating-primary-color, orange)'
   */
  primaryColor?: string;
  /**
   * Any CSS color for the empty part of a star.
   *
   * @defaultValue 'var(--stars-rating-secondary-color, grey)'
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
const ReactStarsRating = forwardRef<HTMLSpanElement, ReactStarsRatingProps>(
  function ReactStarsRating(
    {
      id,
      value,
      defaultValue = 0,
      onChange = () => {},
      onBlur,
      onFocus,
      name,
      form,
      disabled = false,
      readOnly = false,
      isEdit = true,
      isHalf = true,
      count = 5,
      size = 25,
      starGap = 0,
      className = '',
      style,
      dir = 'ltr',
      primaryColor = 'var(--stars-rating-primary-color, orange)',
      secondaryColor = 'var(--stars-rating-secondary-color, grey)',
      hoverColor,
      isArrowSubmit = false,
      ariaLabel = 'Star rating',
      ariaLabelledBy,
      getValueText = (currentValue, maximum) => `${currentValue} of ${maximum}`,
      ...spanProps
    },
    forwardedRef,
  ) {
    const isRtl = dir === 'rtl';
    const isEditable = isEdit && !readOnly;
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
    const activePointerRef = useRef<number | null>(null);
    const [hoverValue, setHoverValue] = useState<number | null>(null);
    const [isFocusVisible, setIsFocusVisible] = useState(false);
    const containerRef = useRef<HTMLSpanElement>(null);
    useImperativeHandle(forwardedRef, () => containerRef.current!, []);
    // Synchronize the preview's source, not just its rendered value. Otherwise
    // an A -> B -> A controlled update can resurrect the old preview for A.
    if (displayState.sourceValue !== committedValue) {
      setDisplayState({
        sourceValue: committedValue,
        displayValue: committedValue,
      });
      setHoverValue(null);
    }
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

      const associatedForm = form
        ? document.getElementById(form)
        : containerRef.current?.closest('form');
      let mounted = true;
      const handleReset = (event: Event) => {
        // Browsers may flush microtasks between native listeners. Wait for the
        // next task so React/ancestor listeners have time to cancel the reset.
        setTimeout(() => {
          if (!mounted || event.defaultPrevented) return;
          const resetValue = normalizeValue(
            defaultValue,
            normalizedCount,
            isHalf,
          );
          pendingKeyboardValueRef.current = null;
          activePointerRef.current = null;
          setHoverValue(null);
          setUncontrolledValue(resetValue);
          setDisplayState({
            sourceValue: resetValue,
            displayValue: resetValue,
          });
        });
      };

      associatedForm?.addEventListener('reset', handleReset);
      return () => {
        mounted = false;
        associatedForm?.removeEventListener('reset', handleReset);
      };
    }, [defaultValue, form, isControlled, isHalf, normalizedCount]);

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
          return (
            bounds.width > 0 &&
            (isRtl
              ? event.clientX >= bounds.left
              : event.clientX <= bounds.right)
          );
        }) ??
        stars[stars.length - 1] ??
        event.currentTarget;
      const starPosition = stars.indexOf(selectedStar) + 1;
      const selectedIndex = starPosition || fallbackIndex;

      if (!isHalf) {
        return selectedIndex;
      }

      const bounds = selectedStar.getBoundingClientRect();
      const point = isRtl
        ? bounds.right - event.clientX
        : event.clientX - bounds.left;

      // Rendered geometry keeps half selection correct under consumer scaling.
      return point > bounds.width / 2 ? selectedIndex : selectedIndex - 0.5;
    };

    const handlePointerMove = (
      event: PointerEvent<SVGSVGElement>,
      index: number,
    ) => {
      if (!isEditable || disabled) {
        return;
      }

      const activePointer = activePointerRef.current;
      if (
        (activePointer !== null && activePointer !== event.pointerId) ||
        (activePointer === null &&
          (event.pointerType === 'touch' || event.buttons !== 0))
      ) {
        return;
      }

      const nextValue = getValueFromEvent(event, index);
      pendingKeyboardValueRef.current = null;
      setHoverValue(nextValue);
      setDisplayValue(nextValue);
    };

    const handlePointerLeave = (event: PointerEvent<SVGSVGElement>) => {
      if (!isEditable || disabled || event.buttons !== 0) {
        return;
      }

      setHoverValue(null);
      setDisplayValue(committedValue);
    };

    const handleBlur = (event: FocusEvent<HTMLSpanElement>) => {
      setIsFocusVisible(false);
      const pendingValue = pendingKeyboardValueRef.current;
      pendingKeyboardValueRef.current = null;

      if (isEditable && !disabled && pendingValue !== null) {
        commitValue(pendingValue);
      }
      onBlur?.(event);
    };

    const commitValue = (nextValue: number) => {
      const normalizedValue = normalizeValue(
        nextValue,
        normalizedCount,
        isHalf,
      );
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
      if (
        !isEditable ||
        disabled ||
        event.button !== 0 ||
        event.isPrimary === false ||
        activePointerRef.current !== null
      ) {
        return;
      }

      containerRef.current?.focus();
      activePointerRef.current = event.pointerId;
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
      if (activePointerRef.current !== event.pointerId || event.button !== 0) {
        return;
      }

      activePointerRef.current = null;
      event.currentTarget.releasePointerCapture?.(event.pointerId);
      if (!isEditable || disabled) return;
      commitValue(getValueFromEvent(event, index));
      if (event.pointerType === 'touch') {
        setHoverValue(null);
      }
    };

    const handlePointerCancel = (event: PointerEvent<SVGSVGElement>) => {
      if (activePointerRef.current !== event.pointerId) return;
      activePointerRef.current = null;
      // Cancellation/lost capture already releases capture in the browser.
      pendingKeyboardValueRef.current = null;
      setHoverValue(null);
      setDisplayValue(committedValue);
    };

    const updateValueFromKeyboard = (nextValue: number) => {
      const clampedNextValue = normalizeValue(
        nextValue,
        normalizedCount,
        isHalf,
      );

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
          event.preventDefault();
          updateValueByStep((isHalf ? 0.5 : 1) * (isRtl ? 1 : -1));
          break;
        case 'ArrowRight':
          event.preventDefault();
          updateValueByStep((isHalf ? 0.5 : 1) * (isRtl ? -1 : 1));
          break;
        case 'ArrowDown':
          event.preventDefault();
          updateValueByStep(isHalf ? -0.5 : -1);
          break;
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
        const hasGap = index !== normalizedCount;

        return (
          <span
            key={`react-stars-rating-char${index}`}
            className={`star star-${index}`}
            style={
              hasGap
                ? { paddingInlineEnd: 'var(--stars-rating-gap)' }
                : undefined
            }
          >
            <Star
              index={index}
              value={displayValue}
              size={normalizedSize}
              isHalf={isHalf}
              isRtl={isRtl}
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
              onLostPointerCapture={handlePointerCancel}
            />
          </span>
        );
      });

    const interactiveProps = isEditable && !disabled;

    const clampedValue = normalizeValue(displayValue, normalizedCount, isHalf);
    const handleFocus = (event: FocusEvent<HTMLSpanElement>) => {
      setIsFocusVisible(event.currentTarget.matches(':focus-visible'));
      onFocus?.(event);
    };
    const containerStyle = {
      ...(isEditable ? styles.activeContainer : styles.inActiveContainer),
      '--stars-rating-gap': `${normalizedGap}px`,
      '--stars-rating-size': `${normalizedSize}px`,
      ...(isFocusVisible
        ? {
            outline: '2px solid var(--stars-rating-focus-color, highlight)',
            outlineOffset: 2,
          }
        : undefined),
      ...style,
    } as ReactStarsRatingStyle;

    return (
      <span
        {...spanProps}
        ref={containerRef}
        id={resolvedId}
        dir={dir}
        role="slider"
        aria-label={ariaLabelledBy ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-valuemin={0}
        aria-valuemax={normalizedCount}
        aria-valuenow={clampedValue}
        aria-valuetext={getValueText(clampedValue, normalizedCount)}
        aria-orientation="horizontal"
        aria-readonly={!isEditable}
        aria-disabled={disabled || undefined}
        tabIndex={interactiveProps ? 0 : -1}
        onKeyDown={interactiveProps ? handleKeyDown : undefined}
        onBlur={handleBlur}
        onFocus={handleFocus}
        style={containerStyle}
        className={className}
      >
        {renderStars()}
        {name ? (
          <input
            type="hidden"
            name={name}
            value={committedValue}
            disabled={disabled}
            form={form}
          />
        ) : null}
      </span>
    );
  },
);

export { ReactStarsRating };
export default ReactStarsRating;
