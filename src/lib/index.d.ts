import * as React from 'react';

declare class ReactStarsRating extends React.Component<
  ReactStarsRatingProps,
  any
> {}

export interface ReactStarsRatingProps {
  isEdit?: boolean;
  isHalf?: boolean;
  count?: number;
  value?: number;
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
  className?: string;
  starGap?: number;
  isArrowSubmit?: boolean;
  onChange?: () => void;
}

export default ReactStarsRating;
