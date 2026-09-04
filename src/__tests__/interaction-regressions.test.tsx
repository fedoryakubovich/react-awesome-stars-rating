import { act, fireEvent, render, screen } from '@testing-library/react';
import ReactStarsRating from '../lib';

const pointer = {
  pointerId: 1,
  pointerType: 'mouse',
  button: 0,
  isPrimary: true,
  clientX: 75,
  buttons: 1,
};
function setup(rtl = false) {
  const stars = Array.from(screen.getByRole('slider').querySelectorAll('svg'));
  stars.forEach((star, index) => {
    const left = (rtl ? 4 - index : index) * 30;
    star.getBoundingClientRect = () =>
      ({ left, right: left + 30, width: 30 }) as DOMRect;
  });
  return stars[2];
}

test.each([1, 2])('ignores mouse button %s', (button) => {
  const onChange = vi.fn();
  render(<ReactStarsRating defaultValue={1} onChange={onChange} />);
  const star = setup();
  fireEvent.pointerDown(star, { ...pointer, button });
  fireEvent.pointerMove(star, { ...pointer, button, buttons: 2 });
  fireEvent.pointerUp(star, { ...pointer, button });
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '1');
});

test('only the active primary pointer can move, cancel or commit a gesture', () => {
  const onChange = vi.fn();
  render(<ReactStarsRating defaultValue={1} onChange={onChange} />);
  const star = setup();
  fireEvent.pointerUp(star, pointer);
  fireEvent.pointerDown(star, { ...pointer, isPrimary: false });
  fireEvent.pointerUp(star, pointer);
  expect(onChange).not.toHaveBeenCalled();
  fireEvent.pointerDown(star, pointer);
  fireEvent.pointerDown(star, { ...pointer, pointerId: 2 });
  fireEvent.pointerMove(star, { ...pointer, pointerId: 2, clientX: 140 });
  fireEvent.pointerCancel(star, { ...pointer, pointerId: 2 });
  fireEvent.pointerUp(star, { ...pointer, pointerId: 2 });
  expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '2.5');
  expect(onChange).not.toHaveBeenCalled();
  fireEvent.pointerUp(star, pointer);
  fireEvent.pointerUp(star, pointer);
  expect(onChange).toHaveBeenCalledExactlyOnceWith(2.5);
});

test('losing pointer capture cancels the gesture', () => {
  const onChange = vi.fn();
  render(<ReactStarsRating defaultValue={1} onChange={onChange} />);
  const star = setup();
  fireEvent.pointerDown(star, pointer);
  star.releasePointerCapture = vi.fn(() => {
    throw new DOMException('Pointer is no longer active', 'NotFoundError');
  });
  fireEvent.lostPointerCapture(star, pointer);
  fireEvent.pointerUp(star, pointer);
  expect(onChange).not.toHaveBeenCalled();
  expect(star.releasePointerCapture).not.toHaveBeenCalled();
  expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '1');
});

test('a gesture cannot commit after editing is disabled', () => {
  const onChange = vi.fn();
  const { rerender } = render(
    <ReactStarsRating defaultValue={1} onChange={onChange} />,
  );
  const star = setup();
  fireEvent.pointerDown(star, pointer);
  rerender(<ReactStarsRating defaultValue={1} onChange={onChange} disabled />);
  fireEvent.pointerUp(star, pointer);
  expect(onChange).not.toHaveBeenCalled();
});

test('respects a reset canceled by a React ancestor listener', async () => {
  render(
    <form onReset={(event) => event.preventDefault()}>
      <ReactStarsRating defaultValue={1} isArrowSubmit />
      <button type="reset">Reset</button>
    </form>,
  );
  const slider = screen.getByRole('slider');
  fireEvent.keyDown(slider, { key: 'End' });
  await act(async () => {
    screen.getByRole('button').closest('form')!.reset();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
  expect(slider).toHaveAttribute('aria-valuenow', '5');
});

test('does not update an unmounted control after reset', async () => {
  const { unmount } = render(
    <form>
      <ReactStarsRating defaultValue={1} />
    </form>,
  );
  const form = screen.getByRole('slider').closest('form')!;
  await act(async () => {
    form.reset();
    unmount();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
  expect(screen.queryByRole('slider')).not.toBeInTheDocument();
});

test('composes focus and blur callbacks with internal commit behavior', () => {
  const calls: string[] = [];
  render(
    <ReactStarsRating
      defaultValue={1}
      onFocus={() => calls.push('focus')}
      onBlur={() => calls.push('blur')}
      onChange={() => calls.push('change')}
    />,
  );
  const slider = screen.getByRole('slider');
  fireEvent.focus(slider);
  fireEvent.keyDown(slider, { key: 'End' });
  fireEvent.blur(slider);
  expect(calls).toEqual(['focus', 'change', 'blur']);
  expect(slider).toHaveAttribute('aria-valuenow', '5');
});

test('readonly focus callbacks do not commit an earlier keyboard preview', () => {
  const onChange = vi.fn(),
    onBlur = vi.fn();
  const { rerender } = render(
    <ReactStarsRating defaultValue={1} onChange={onChange} onBlur={onBlur} />,
  );
  fireEvent.keyDown(screen.getByRole('slider'), { key: 'End' });
  rerender(
    <ReactStarsRating
      defaultValue={1}
      onChange={onChange}
      onBlur={onBlur}
      readOnly
    />,
  );
  fireEvent.blur(screen.getByRole('slider'));
  expect(onBlur).toHaveBeenCalledOnce();
  expect(onChange).not.toHaveBeenCalled();
});

test('RTL reverses horizontal arrows, pointer halves and SVG fill direction', () => {
  render(<ReactStarsRating dir="rtl" defaultValue={1} isArrowSubmit />);
  const slider = screen.getByRole('slider'),
    star = setup(true);
  fireEvent.keyDown(slider, { key: 'ArrowLeft' });
  expect(slider).toHaveAttribute('aria-valuenow', '1.5');
  fireEvent.keyDown(slider, { key: 'ArrowRight' });
  expect(slider).toHaveAttribute('aria-valuenow', '1');
  fireEvent.keyDown(slider, { key: 'ArrowUp' });
  expect(slider).toHaveAttribute('aria-valuenow', '1.5');
  fireEvent.keyDown(slider, { key: 'ArrowDown' });
  expect(slider).toHaveAttribute('aria-valuenow', '1');
  fireEvent.pointerDown(star, { ...pointer, clientX: 85 });
  fireEvent.pointerUp(star, { ...pointer, clientX: 85 });
  expect(slider).toHaveAttribute('aria-valuenow', '2.5');
  expect(star).toHaveStyle({ transform: 'scaleX(-1)' });
  fireEvent.pointerDown(star, { ...pointer, clientX: 65 });
  fireEvent.pointerUp(star, { ...pointer, clientX: 65 });
  expect(slider).toHaveAttribute('aria-valuenow', '3');
});
