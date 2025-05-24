import { SVGProps } from 'react';

export type GradientProps = {
  primaryColor: string;
  secondaryColor: string;
  index: number;
  value: number;
  fullId: string;
  halfId: string;
  noneId: string;
};

export type StarProps = SVGProps<SVGSVGElement> & GradientProps & { isHalf: boolean; size: number };

export type ReactAwesomeStarsRatingProps = {
  primaryColor?: string;
  secondaryColor?: string;
  isHalf?: boolean;
  size?: number;
  count?: number;
  isEdit?: boolean;
  starGap?: number;
  isArrowSubmit?: boolean;
  onChange?: (value: number) => void;
  value?: number;
  id?: string;
  className?: string;
};
