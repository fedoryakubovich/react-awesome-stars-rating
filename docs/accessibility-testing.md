# Manual assistive-technology checks

Status: **not yet performed on physical devices** for this release. Automated
axe, keyboard, touch-emulation and hydration tests are not a substitute.

Use the deployed demo and Storybook linked in the README. Test Safari with
VoiceOver on an iPhone and Chrome with TalkBack on an Android device. Record
device, OS, browser, assistive-technology version, package version and date.

For each platform:

- Navigate to the rating without sight; confirm its name, slider role, value
  and range are announced meaningfully.
- Use the screen reader's adjustment gestures to increase/decrease; verify
  half-star and whole-star values, zero and maximum, and announcements.
- Leave the control and return; confirm it remains reachable and changes
  commit exactly once. Repeat with immediate keyboard submission enabled.
- Verify read-only average ratings are readable without suggesting they can
  be edited, and disabled controls cannot change or submit their value.
- Check Arabic RTL and localized value text, including direction of changes.
- Submit a required-rating example with zero: hear the error, find the focused
  rating, correct it, and submit. Clear/reset and verify the submitted value.
- Test at larger text/display sizes and confirm the page still scrolls.

Record each case as pass, fail or not tested, with exact reproduction steps.
Do not infer a pass from the visual display or automated accessibility score.
Report failures as issues with device details; do not include personal data.

WAI explicitly recommends testing sliders with touch-based assistive technology:
[Slider pattern guidance](https://www.w3.org/WAI/ARIA/apg/patterns/slider/).
