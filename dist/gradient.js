"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Gradient = function Gradient(_ref) {
  var primaryColor = _ref.primaryColor,
      secondaryColor = _ref.secondaryColor,
      offset = _ref.offset,
      index = _ref.index,
      value = _ref.value,
      fullId = _ref.fullId,
      halfId = _ref.halfId,
      noneId = _ref.noneId;

  if (index === 1) {
    offset = value % 1 * 100;
  }

  return index === 1 && /*#__PURE__*/_react.default.createElement("defs", null, /*#__PURE__*/_react.default.createElement("linearGradient", {
    id: fullId
  }, /*#__PURE__*/_react.default.createElement("stop", {
    offset: "100%",
    stopColor: primaryColor
  })), /*#__PURE__*/_react.default.createElement("linearGradient", {
    id: noneId
  }, /*#__PURE__*/_react.default.createElement("stop", {
    offset: "100%",
    stopColor: secondaryColor
  })), /*#__PURE__*/_react.default.createElement("linearGradient", {
    id: halfId
  }, /*#__PURE__*/_react.default.createElement("stop", {
    offset: "".concat(offset, "%"),
    stopColor: primaryColor
  }), /*#__PURE__*/_react.default.createElement("stop", {
    offset: "".concat(offset, "%"),
    stopColor: secondaryColor
  })));
};

Gradient.propTypes = {
  primaryColor: _propTypes.default.string.isRequired,
  secondaryColor: _propTypes.default.string.isRequired,
  offset: _propTypes.default.number,
  index: _propTypes.default.number.isRequired,
  value: _propTypes.default.number.isRequired
};
var _default = Gradient;
exports.default = _default;