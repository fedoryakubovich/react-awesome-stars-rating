import React from 'react';
import Gradient from './gradient';

var StarSVG = function StarSVG(_ref) {
  var viewBox = _ref.viewBox,
      size = _ref.size,
      onMouseMove = _ref.onMouseMove,
      onMouseLeave = _ref.onMouseLeave,
      onChange = _ref.onChange,
      index = _ref.index,
      value = _ref.value,
      isHalf = _ref.isHalf,
      primaryColor = _ref.primaryColor,
      secondaryColor = _ref.secondaryColor,
      fill = _ref.fill,
      offset = _ref.offset;

  if (index <= value) {
    fill = 'url(#full)';
  } else if (isHalf && Math.ceil(value) === index) {
    fill = 'url(#half)';
  }

  var props = {
    primaryColor: primaryColor,
    secondaryColor: secondaryColor,
    offset: offset,
    index: index,
    value: value
  };
  return React.createElement("svg", {
    width: size,
    viewBox: viewBox,
    xmlns: "http://www.w3.org/2000/svg",
    xmlnsXlink: "http://www.w3.org/1999/xlink",
    onMouseLeave: onMouseLeave,
    onClick: onChange,
    "data-stars": index,
    onMouseMove: onMouseMove
  }, React.createElement(Gradient, props), React.createElement("polygon", {
    fill: fill,
    points: "153,230.775 247.35,299.625 211.65,187.425 306,121.125 191.25,121.125 153,6.375 114.75,121.125 0,121.125  94.35,187.425 58.65,299.625",
    pointerEvents: "none"
  }));
};

StarSVG.defaultProps = {
  viewBox: '0 0 306 306',
  fill: 'url(#none)',
  offset: 50
};
export default StarSVG;