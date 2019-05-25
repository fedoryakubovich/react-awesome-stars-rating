import React from 'react';

var Gradient = function Gradient(_ref) {
  var primaryColor = _ref.primaryColor,
      secondaryColor = _ref.secondaryColor,
      offset = _ref.offset,
      index = _ref.index,
      value = _ref.value;

  if (index === 1) {
    offset = value % 1 * 100;
  }

  return index === 1 && React.createElement("defs", null, React.createElement("linearGradient", {
    id: "full"
  }, React.createElement("stop", {
    offset: "100%",
    stopColor: primaryColor
  })), React.createElement("linearGradient", {
    id: "none"
  }, React.createElement("stop", {
    offset: "100%",
    stopColor: secondaryColor
  })), React.createElement("linearGradient", {
    id: "half"
  }, React.createElement("stop", {
    offset: "".concat(offset, "%"),
    stopColor: primaryColor
  }), React.createElement("stop", {
    offset: "".concat(offset, "%"),
    stopColor: secondaryColor
  })));
};

export default Gradient;