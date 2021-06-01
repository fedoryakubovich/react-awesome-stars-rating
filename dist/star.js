"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _gradient = _interopRequireDefault(require("./gradient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      offset = _ref.offset,
      fullId = _ref.fullId,
      halfId = _ref.halfId,
      noneId = _ref.noneId;

  if (index <= value) {
    fill = "url(#".concat(fullId, ")");
  } else if (isHalf && Math.ceil(value) === index) {
    fill = "url(#".concat(halfId, ")");
  } else {
    fill = "url(#".concat(noneId, ")");
  }

  var props = {
    primaryColor: primaryColor,
    secondaryColor: secondaryColor,
    offset: offset,
    index: index,
    value: value,
    fullId: fullId,
    halfId: halfId,
    noneId: noneId
  };
  return /*#__PURE__*/_react.default.createElement("svg", {
    width: size,
    viewBox: viewBox,
    xmlns: "http://www.w3.org/2000/svg",
    xmlnsXlink: "http://www.w3.org/1999/xlink",
    onMouseLeave: onMouseLeave,
    onClick: onChange,
    "data-stars": index,
    onMouseMove: onMouseMove
  }, /*#__PURE__*/_react.default.createElement(_gradient.default, props), /*#__PURE__*/_react.default.createElement("polygon", {
    fill: fill,
    points: "153,230.775 247.35,299.625 211.65,187.425 306,121.125 191.25,121.125 153,6.375 114.75,121.125 0,121.125  94.35,187.425 58.65,299.625",
    pointerEvents: "none"
  }));
};

StarSVG.propTypes = {
  viewBox: _propTypes.default.string,
  size: _propTypes.default.number.isRequired,
  primaryColor: _propTypes.default.string.isRequired,
  secondaryColor: _propTypes.default.string.isRequired,
  onMouseLeave: _propTypes.default.func,
  onMouseMove: _propTypes.default.func,
  onChange: _propTypes.default.func,
  isHalf: _propTypes.default.bool.isRequired,
  fill: _propTypes.default.string,
  index: _propTypes.default.number.isRequired,
  value: _propTypes.default.number.isRequired,
  offset: _propTypes.default.number.isRequired
};
StarSVG.defaultProps = {
  viewBox: '0 0 306 306',
  offset: 50
};
var _default = StarSVG;
exports.default = _default;