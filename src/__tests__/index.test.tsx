import userEvent from '@testing-library/user-event';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import ReactStarsRating from '../lib';

const getSlider = () => screen.getByRole('slider');

const getStars = () =>
  [...getSlider().querySelectorAll('svg')] as SVGSVGElement[];

// jsdom has no layout, so every rect is zero. Pointer coordinates only mean
// something once the star reports a real width.
const withLayout = (star: SVGSVGElement, size: number) => {
  star.getBoundingClientRect = () =>
    ({ left: 0, width: size, right: size }) as DOMRect;
  return star;
};

describe('Rendering', () => {
  test('exposes a labelled slider', () => {
    render(<ReactStarsRating />);

    const slider = screen.getByRole('slider', { name: 'Star rating' });
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '5');
    expect(slider).toHaveAttribute('aria-valuenow', '0');
    expect(slider).toHaveAttribute('aria-valuetext', '0 of 5');
    expect(slider).toHaveAttribute('aria-readonly', 'false');
  });

  test('renders one star per count', () => {
    const { rerender } = render(<ReactStarsRating count={5} />);
    expect(getStars()).toHaveLength(5);

    rerender(<ReactStarsRating count={10} />);
    expect(getStars()).toHaveLength(10);
    expect(getSlider()).toHaveAttribute('aria-valuemax', '10');
  });

  test('aria-labelledby replaces the default label', () => {
    render(
      <>
        <span id="label">How was it?</span>
        <ReactStarsRating ariaLabelledBy="label" />
      </>,
    );

    const slider = screen.getByRole('slider', { name: 'How was it?' });
    expect(slider).toHaveAttribute('aria-labelledby', 'label');
    expect(slider).not.toHaveAttribute('aria-label');
  });
});

describe('Pointer interaction', () => {
  test('selects a half star before the middle of a star', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ReactStarsRating size={30} isHalf onChange={onChange} />);

    const third = withLayout(getStars()[2], 30);
    await user.pointer({
      keys: '[MouseLeft]',
      target: third,
      coords: { clientX: 5 },
    });

    expect(onChange).toHaveBeenCalledWith(2.5);
    expect(getSlider()).toHaveAttribute('aria-valuetext', '2.5 of 5');
  });

  test('selects a full star past the middle of a star', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ReactStarsRating size={30} isHalf onChange={onChange} />);

    const third = withLayout(getStars()[2], 30);
    await user.pointer({
      keys: '[MouseLeft]',
      target: third,
      coords: { clientX: 25 },
    });

    expect(onChange).toHaveBeenCalledWith(3);
  });

  test('ignores pointer position when isHalf is false', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ReactStarsRating size={30} isHalf={false} onChange={onChange} />);

    const third = withLayout(getStars()[2], 30);
    await user.pointer({
      keys: '[MouseLeft]',
      target: third,
      coords: { clientX: 1 },
    });

    expect(onChange).toHaveBeenCalledWith(3);
  });

  test('previews on hover and restores the value on leave', async () => {
    const user = userEvent.setup();
    render(<ReactStarsRating size={30} isHalf={false} value={1} />);

    const fourth = withLayout(getStars()[3], 30);
    await user.pointer({ target: fourth, coords: { clientX: 25 } });
    expect(getSlider()).toHaveAttribute('aria-valuenow', '4');

    await user.unhover(fourth);
    expect(getSlider()).toHaveAttribute('aria-valuenow', '1');
  });

  test('falls back to zero on leave when no value is given', async () => {
    const user = userEvent.setup();
    render(<ReactStarsRating size={30} isHalf={false} />);

    const fourth = withLayout(getStars()[3], 30);
    await user.pointer({ target: fourth, coords: { clientX: 25 } });
    expect(getSlider()).toHaveAttribute('aria-valuenow', '4');

    await user.unhover(fourth);
    expect(getSlider()).toHaveAttribute('aria-valuenow', '0');
  });

  test('restores the committed value when a pointer gesture is cancelled', () => {
    const onChange = vi.fn();
    render(
      <ReactStarsRating
        value={1}
        size={30}
        isHalf={false}
        onChange={onChange}
      />,
    );

    const fourth = withLayout(getStars()[3], 30);
    fireEvent.pointerDown(fourth, {
      clientX: 25,
      pointerId: 1,
      pointerType: 'mouse',
    });
    expect(getSlider()).toHaveAttribute('aria-valuenow', '4');

    fireEvent.pointerCancel(fourth, { pointerId: 1, pointerType: 'mouse' });
    expect(getSlider()).toHaveAttribute('aria-valuenow', '1');
    expect(onChange).not.toHaveBeenCalled();
  });

  test('only previews captured touch pointers and clears the preview on release', () => {
    const onChange = vi.fn();
    render(
      <ReactStarsRating
        value={1}
        size={30}
        isHalf={false}
        onChange={onChange}
      />,
    );

    const fourth = withLayout(getStars()[3], 30);
    fourth.hasPointerCapture = vi.fn(() => false);
    fireEvent.pointerMove(fourth, {
      clientX: 25,
      pointerId: 1,
      pointerType: 'touch',
    });
    expect(getSlider()).toHaveAttribute('aria-valuenow', '1');

    fourth.hasPointerCapture = vi.fn(() => true);
    fireEvent.pointerMove(fourth, {
      clientX: 25,
      pointerId: 1,
      pointerType: 'touch',
    });
    expect(getSlider()).toHaveAttribute('aria-valuenow', '4');

    fireEvent.pointerUp(fourth, {
      clientX: 25,
      pointerId: 1,
      pointerType: 'touch',
    });
    expect(onChange).toHaveBeenCalledWith(4);
    expect(getSlider().querySelectorAll('[id*="-hover-"]')).toHaveLength(0);
  });
});

describe('Uncontrolled usage', () => {
  test('tracks its own value when no onChange is given', async () => {
    const user = userEvent.setup();
    render(<ReactStarsRating size={30} isHalf={false} />);

    const second = withLayout(getStars()[1], 30);
    await user.pointer({
      keys: '[MouseLeft]',
      target: second,
      coords: { clientX: 25 },
    });

    expect(getSlider()).toHaveAttribute('aria-valuenow', '2');
  });

  test('keeps a committed value after the pointer leaves', async () => {
    const user = userEvent.setup();
    render(
      <ReactStarsRating
        defaultValue={1}
        size={30}
        isHalf={false}
        name="rating"
      />,
    );

    const third = withLayout(getStars()[2], 30);
    await user.pointer({
      keys: '[MouseLeft]',
      target: third,
      coords: { clientX: 25 },
    });
    await user.unhover(third);

    expect(getSlider()).toHaveAttribute('aria-valuenow', '3');
    expect(screen.getByDisplayValue('3')).toHaveAttribute('name', 'rating');
  });

  test('resets defaultValue and its native form field', async () => {
    const user = userEvent.setup();
    render(
      <form data-testid="form">
        <ReactStarsRating
          defaultValue={2}
          size={30}
          isHalf={false}
          name="rating"
        />
        <button type="reset">Reset</button>
      </form>,
    );

    await user.pointer({
      keys: '[MouseLeft]',
      target: withLayout(getStars()[3], 30),
      coords: { clientX: 25 },
    });
    expect(new FormData(screen.getByTestId('form')).get('rating')).toBe('4');

    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(getSlider()).toHaveAttribute('aria-valuenow', '2');
    expect(new FormData(screen.getByTestId('form')).get('rating')).toBe('2');
  });

  test('associates with and resets from an external form', async () => {
    const user = userEvent.setup();
    render(
      <>
        <form id="review-form" data-testid="form" />
        <ReactStarsRating
          defaultValue={1}
          form="review-form"
          isHalf={false}
          name="rating"
        />
      </>,
    );

    await user.pointer({
      keys: '[MouseLeft]',
      target: withLayout(getStars()[2], 25),
      coords: { clientX: 20 },
    });
    const form = screen.getByTestId('form') as HTMLFormElement;
    expect(new FormData(form).get('rating')).toBe('3');

    act(() => form.reset());
    expect(getSlider()).toHaveAttribute('aria-valuenow', '1');
    expect(new FormData(form).get('rating')).toBe('1');
  });
});

describe('Read only mode', () => {
  test('supports the standard readOnly prop', () => {
    render(<ReactStarsRating readOnly value={2} />);

    expect(getSlider()).toHaveAttribute('aria-readonly', 'true');
    expect(getSlider()).toHaveAttribute('tabindex', '-1');
  });

  test('does not report or preview changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ReactStarsRating
        size={30}
        isEdit={false}
        value={2}
        onChange={onChange}
      />,
    );

    const fifth = withLayout(getStars()[4], 30);
    await user.pointer({ target: fifth, coords: { clientX: 25 } });
    expect(getSlider()).toHaveAttribute('aria-valuenow', '2');

    await user.pointer({
      keys: '[MouseLeft]',
      target: fifth,
      coords: { clientX: 25 },
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(getSlider()).toHaveAttribute('aria-valuenow', '2');

    await user.unhover(fifth);
    expect(getSlider()).toHaveAttribute('aria-valuenow', '2');
  });

  test('is removed from the tab order', async () => {
    const user = userEvent.setup();
    render(<ReactStarsRating isEdit={false} value={2} />);

    expect(getSlider()).toHaveAttribute('tabindex', '-1');
    expect(getSlider()).toHaveAttribute('aria-readonly', 'true');

    await user.tab();
    expect(getSlider()).not.toHaveFocus();
  });

  test('isArrowSubmit does not make a read-only rating interactive', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ReactStarsRating
        isEdit={false}
        isArrowSubmit
        value={2}
        onChange={onChange}
      />,
    );

    expect(getSlider()).toHaveAttribute('tabindex', '-1');
    expect(getSlider()).not.toHaveAttribute('onkeydown');

    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('Disabled mode', () => {
  test('is inert, announced as disabled, and omitted from FormData', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <form data-testid="form">
        <ReactStarsRating
          disabled
          name="rating"
          value={2}
          onChange={onChange}
        />
      </form>,
    );

    expect(getSlider()).toHaveAttribute('aria-disabled', 'true');
    expect(getSlider()).toHaveAttribute('tabindex', '-1');
    expect(new FormData(screen.getByTestId('form')).has('rating')).toBe(false);

    await user.pointer({
      keys: '[MouseLeft]',
      target: withLayout(getStars()[3], 25),
      coords: { clientX: 20 },
    });
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('Keyboard interaction', () => {
  test('is reachable with Tab', async () => {
    const user = userEvent.setup();
    render(<ReactStarsRating value={1} />);

    await user.tab();

    expect(getSlider()).toHaveFocus();
  });

  test('steps by a whole star when isHalf is false', async () => {
    const user = userEvent.setup();
    render(<ReactStarsRating isHalf={false} value={1} />);

    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(getSlider()).toHaveAttribute('aria-valuenow', '2');

    await user.keyboard('{ArrowLeft}');
    expect(getSlider()).toHaveAttribute('aria-valuenow', '1');
  });

  test('steps by a half star when isHalf is true', async () => {
    const user = userEvent.setup();
    render(<ReactStarsRating isHalf value={1} />);

    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(getSlider()).toHaveAttribute('aria-valuetext', '1.5 of 5');

    await user.keyboard('{ArrowLeft}');
    expect(getSlider()).toHaveAttribute('aria-valuetext', '1 of 5');
  });

  test('supports vertical arrow keys', async () => {
    const user = userEvent.setup();
    render(<ReactStarsRating isHalf={false} value={1} />);

    await user.tab();
    await user.keyboard('{ArrowUp}');
    expect(getSlider()).toHaveAttribute('aria-valuenow', '2');

    await user.keyboard('{ArrowDown}');
    expect(getSlider()).toHaveAttribute('aria-valuenow', '1');
  });

  test('Home and End move to the bounds', async () => {
    const user = userEvent.setup();
    render(<ReactStarsRating count={7} isHalf value={3.5} />);

    await user.tab();
    await user.keyboard('{End}');
    expect(getSlider()).toHaveAttribute('aria-valuenow', '7');

    await user.keyboard('{Home}');
    expect(getSlider()).toHaveAttribute('aria-valuenow', '0');
  });

  test.each([
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End',
    'Enter',
  ])('prevents the default action for %s', (key) => {
    render(<ReactStarsRating value={2} />);

    expect(fireEvent.keyDown(getSlider(), { key })).toBe(false);
  });

  test('does not prevent unrelated keys', () => {
    render(<ReactStarsRating value={2} />);

    expect(fireEvent.keyDown(getSlider(), { key: 'Tab' })).toBe(true);
  });

  test('stops at both bounds', async () => {
    const user = userEvent.setup();
    render(<ReactStarsRating count={2} isHalf={false} value={2} />);

    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(getSlider()).toHaveAttribute('aria-valuenow', '2');

    await user.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}');
    expect(getSlider()).toHaveAttribute('aria-valuenow', '0');
  });

  test('arrow steps stay local until submitted', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ReactStarsRating isHalf value={2} onChange={onChange} />);

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(getSlider()).toHaveAttribute('aria-valuetext', '2.5 of 5');
    expect(onChange).not.toHaveBeenCalled();
  });

  test('isArrowSubmit reports every arrow step', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ReactStarsRating isHalf value={2} onChange={onChange} isArrowSubmit />,
    );

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(onChange).toHaveBeenCalledWith(2.5);
  });

  test('does not report a blocked arrow step at a bound', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ReactStarsRating
        count={5}
        isHalf={false}
        value={5}
        onChange={onChange}
        isArrowSubmit
      />,
    );

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('Submitting', () => {
  test('Enter reports the previewed value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ReactStarsRating isHalf value={2} onChange={onChange} />);

    await user.tab();
    await user.keyboard('{ArrowRight}{Enter}');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(2.5);
  });

  test('blurring reports the value and remains keyboard accessible', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <>
        <ReactStarsRating isHalf={false} value={1} onChange={onChange} />
        <button type="button">Next control</button>
      </>,
    );

    await user.tab();
    await user.keyboard('{ArrowRight}');
    await user.tab();

    expect(onChange).toHaveBeenCalledWith(2);
    expect(getSlider()).toHaveAttribute('tabindex', '0');

    await user.tab({ shift: true });
    expect(getSlider()).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    await user.tab();

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith(3);
  });

  test('does not report again on blur after a click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <>
        <ReactStarsRating isHalf={false} value={1} onChange={onChange} />
        <button type="button">Next control</button>
      </>,
    );

    await user.tab();
    await user.click(withLayout(getStars()[2], 25));
    await user.tab();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  test('does not report again on blur after Enter', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <>
        <ReactStarsRating isHalf={false} value={1} onChange={onChange} />
        <button type="button">Next control</button>
      </>,
    );

    await user.tab();
    await user.keyboard('{ArrowRight}{Enter}');
    await user.tab();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  test('does not report again on blur after immediate arrow submission', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <>
        <ReactStarsRating
          isHalf={false}
          value={1}
          onChange={onChange}
          isArrowSubmit
        />
        <button type="button">Next control</button>
      </>,
    );

    await user.tab();
    await user.keyboard('{ArrowRight}');
    await user.tab();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  test('does not report on blur when the value was not changed', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <>
        <ReactStarsRating value={1} onChange={onChange} />
        <button type="button">Next control</button>
      </>,
    );

    await user.tab();
    await user.tab();

    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('Value reporting', () => {
  test('clamps a value above count', () => {
    render(<ReactStarsRating count={5} value={12} />);

    expect(getSlider()).toHaveAttribute('aria-valuenow', '5');
    expect(getSlider()).toHaveAttribute('aria-valuetext', '5 of 5');
  });

  test('clamps a negative value', () => {
    render(<ReactStarsRating count={5} value={-3} />);

    expect(getSlider()).toHaveAttribute('aria-valuenow', '0');
    expect(getSlider()).toHaveAttribute('aria-valuetext', '0 of 5');
  });

  test('a new value from the parent replaces an active preview', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ReactStarsRating size={30} isHalf={false} value={1} />,
    );

    await user.pointer({
      target: withLayout(getStars()[3], 30),
      coords: { clientX: 25 },
    });
    expect(getSlider()).toHaveAttribute('aria-valuenow', '4');

    rerender(<ReactStarsRating size={30} isHalf={false} value={2} />);
    expect(getSlider()).toHaveAttribute('aria-valuenow', '2');
  });

  test('an unchanged value keeps the preview', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ReactStarsRating size={30} isHalf={false} value={1} />,
    );

    await user.pointer({
      target: withLayout(getStars()[3], 30),
      coords: { clientX: 25 },
    });
    expect(getSlider()).toHaveAttribute('aria-valuenow', '4');

    rerender(<ReactStarsRating size={30} isHalf={false} value={1} />);
    expect(getSlider()).toHaveAttribute('aria-valuenow', '4');
  });
});

describe('Presentation props', () => {
  test('applies className, size and the gap between stars', () => {
    render(
      <ReactStarsRating
        count={3}
        size={40}
        starGap={8}
        className="custom-rating"
        value={1}
      />,
    );

    const slider = getSlider();
    expect(slider).toHaveClass('custom-rating');
    expect(getStars()[0]).toHaveAttribute('width', '40');
    expect(getStars()[0]).toHaveStyle({ width: 'var(--stars-rating-size)' });
    expect(slider.style.getPropertyValue('--stars-rating-size')).toBe('40px');
    expect(slider.style.getPropertyValue('--stars-rating-gap')).toBe('8px');

    const wrappers = slider.querySelectorAll('span.star');
    expect(wrappers[0]).toHaveStyle({
      paddingRight: 'var(--stars-rating-gap)',
    });
    expect(wrappers[2]).not.toHaveStyle({
      paddingRight: 'var(--stars-rating-gap)',
    });
  });

  test('forwards refs and safe native span attributes', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <ReactStarsRating
        ref={ref}
        value={1}
        title="Product rating"
        data-testid="custom-rating"
        style={{ '--stars-rating-focus-color': 'purple', marginTop: 4 }}
      />,
    );

    const slider = screen.getByTestId('custom-rating');
    expect(ref.current).toBe(slider);
    expect(slider).toHaveAttribute('title', 'Product rating');
    expect(slider).toHaveStyle({ marginTop: '4px' });
    expect(slider.style.getPropertyValue('--stars-rating-focus-color')).toBe(
      'purple',
    );
  });

  test('attaches and detaches callback refs', () => {
    const ref = vi.fn();
    const { unmount } = render(<ReactStarsRating ref={ref} />);
    expect(ref).toHaveBeenLastCalledWith(getSlider());
    unmount();
    expect(ref).toHaveBeenLastCalledWith(null);
  });

  test('shows a customizable focus-visible ring', async () => {
    const user = userEvent.setup();
    render(
      <ReactStarsRating
        value={1}
        style={{ '--stars-rating-focus-color': 'purple' }}
      />,
    );

    // JSDOM does not implement the browser's keyboard focus modality.
    const matches = vi.spyOn(getSlider(), 'matches').mockReturnValue(true);
    await user.tab();
    expect(getSlider()).toHaveStyle({
      outline: '2px solid var(--stars-rating-focus-color, highlight)',
      'outline-offset': '2px',
    });
    matches.mockRestore();
  });

  test('paints the stars with the given colors', () => {
    render(
      <ReactStarsRating value={1} primaryColor="red" secondaryColor="blue" />,
    );

    const stops = getSlider().querySelectorAll('stop');
    const colors = [...stops].map((stop) => stop.getAttribute('stop-color'));

    expect(colors).toContain('red');
    expect(colors).toContain('blue');
  });

  test('normalizes invalid values and whole-star presentation', () => {
    const { rerender } = render(
      <ReactStarsRating count={Number.NaN} value={Number.NaN} />,
    );

    expect(getStars()).toHaveLength(5);
    expect(getSlider()).toHaveAttribute('aria-valuemax', '5');
    expect(getSlider()).toHaveAttribute('aria-valuenow', '0');

    rerender(
      <ReactStarsRating count={4.9} value={3.5} isHalf={false} size={-1} />,
    );
    expect(getStars()).toHaveLength(4);
    expect(getStars()[0]).toHaveAttribute('width', '25');
    expect(getSlider()).toHaveAttribute('aria-valuenow', '4');
  });

  test('supports localized accessible value text and orientation', () => {
    render(
      <ReactStarsRating
        value={2.5}
        getValueText={(value, count) => `${value} von ${count} Sternen`}
      />,
    );

    expect(getSlider()).toHaveAttribute('aria-valuetext', '2.5 von 5 Sternen');
    expect(getSlider()).toHaveAttribute('aria-orientation', 'horizontal');
  });

  test('uses three regions when hoverColor previews below the saved value', async () => {
    const user = userEvent.setup();
    render(
      <ReactStarsRating
        value={3}
        size={30}
        primaryColor="orange"
        hoverColor="cyan"
        secondaryColor="grey"
      />,
    );

    const second = withLayout(getStars()[1], 30);
    await user.pointer({ target: second, coords: { clientX: 5 } });

    const colorsByStar = getStars().map((star) =>
      [...star.querySelectorAll('stop')].map((stop) =>
        stop.getAttribute('stop-color'),
      ),
    );
    expect(colorsByStar[0]).toEqual(['cyan', 'cyan']);
    expect(colorsByStar[1]).toEqual(['cyan', 'cyan', 'orange', 'orange']);
    expect(colorsByStar[2]).toEqual(['orange', 'orange']);
    expect(colorsByStar[3]).toEqual(['grey', 'grey']);
  });

  test('colors only the additional region when previewing above the value', async () => {
    const user = userEvent.setup();
    render(
      <ReactStarsRating
        value={1.5}
        size={30}
        primaryColor="orange"
        hoverColor="cyan"
        secondaryColor="grey"
      />,
    );

    const third = withLayout(getStars()[2], 30);
    await user.pointer({ target: third, coords: { clientX: 25 } });

    const secondColors = [...getStars()[1].querySelectorAll('stop')].map(
      (stop) => stop.getAttribute('stop-color'),
    );
    expect(secondColors).toEqual(['orange', 'orange', 'cyan', 'cyan']);
    expect(
      [...getStars()[2].querySelectorAll('stop')].map((stop) =>
        stop.getAttribute('stop-color'),
      ),
    ).toEqual(['cyan', 'cyan']);

    await user.unhover(third);
    expect(getSlider().querySelectorAll('[id*="-hover-"]')).toHaveLength(0);
  });
});
