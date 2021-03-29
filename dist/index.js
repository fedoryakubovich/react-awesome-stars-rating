"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _star = _interopRequireDefault(require("./star"));

var _styles = _interopRequireDefault(require("./styles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ReactStarsRating = /*#__PURE__*/function (_PureComponent) {
  _inherits(ReactStarsRating, _PureComponent);

  var _super = _createSuper(ReactStarsRating);

  function ReactStarsRating(props) {
    var _this;

    _classCallCheck(this, ReactStarsRating);

    _this = _super.call(this, props);
    _this.state = {
      value: props.value
    };
    _this.onMouseMove = _this.onMouseMove.bind(_assertThisInitialized(_this));
    _this.onMouseLeave = _this.onMouseLeave.bind(_assertThisInitialized(_this));
    _this.onChange = _this.onChange.bind(_assertThisInitialized(_this));
    _this.onKeyDown = _this.onKeyDown.bind(_assertThisInitialized(_this));
    _this.onBlur = _this.onBlur.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ReactStarsRating, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.value !== prevProps.value) {
        this.setState({
          value: this.props.value
        });
      }
    }
  }, {
    key: "isMoreThanHalf",
    value: function isMoreThanHalf(event) {
      var size = this.props.size;
      var point = event.clientX - event.target.getBoundingClientRect().left;
      return point > size / 2;
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(event) {
      var isHalf = this.props.isHalf;
      var value = Number(event.target.getAttribute('data-stars'));

      if (isHalf) {
        var isMoreThanHalf = this.isMoreThanHalf(event);

        if (!isMoreThanHalf) {
          value -= 0.5;
        }
      }

      this.setState({
        value: value
      });
    }
  }, {
    key: "onMouseLeave",
    value: function onMouseLeave() {
      var value = this.props.value;
      this.setState({
        value: value || 0
      });
    }
  }, {
    key: "onBlur",
    value: function onBlur() {
      var onChange = this.props.onChange;
      var value = this.state.value;
      onChange(value);
    }
  }, {
    key: "onChange",
    value: function onChange(event) {
      var _this$props = this.props,
          onChange = _this$props.onChange,
          isHalf = _this$props.isHalf;
      var value = Number(event.target.getAttribute('data-stars'));

      if (isHalf) {
        var isMoreThanHalf = this.isMoreThanHalf(event);

        if (!isMoreThanHalf) {
          value -= 0.5;
        }
      }

      onChange(value);
    }
  }, {
    key: "onChangeStars",
    value: function onChangeStars(newValue) {
      var value = this.state.value;
      var count = this.props.count;

      if (value > 0 || value < count) {
        var _this$props2 = this.props,
            isArrowSubmit = _this$props2.isArrowSubmit,
            onChange = _this$props2.onChange;

        if (value > 0 && newValue < 0 || value < count && newValue > 0) {
          value = (value % 1 === 0.5 ? value : Math.round(value)) + newValue;
        }

        this.setState({
          value: value
        });

        if (isArrowSubmit) {
          onChange(value);
        }
      }
    }
  }, {
    key: "onKeyDown",
    value: function onKeyDown(event) {
      var keyCode = event.keyCode;
      var value = this.state.value;
      var _this$props3 = this.props,
          isHalf = _this$props3.isHalf,
          onChange = _this$props3.onChange;

      switch (keyCode) {
        case 37:
          this.onChangeStars(isHalf ? -0.5 : -1);
          break;

        case 39:
          this.onChangeStars(isHalf ? 0.5 : 1);
          break;

        case 13:
          onChange(value);
          break;

        default:
          break;
      }
    }
  }, {
    key: "renderStars",
    value: function renderStars() {
      var _this$props4 = this.props,
          count = _this$props4.count,
          size = _this$props4.size,
          isHalf = _this$props4.isHalf,
          isEdit = _this$props4.isEdit,
          primaryColor = _this$props4.primaryColor,
          secondaryColor = _this$props4.secondaryColor,
          starGap = _this$props4.starGap,
          id = _this$props4.id;
      var value = this.state.value;
      var starsList = [];
      var props = {
        primaryColor: primaryColor,
        secondaryColor: secondaryColor
      };
      var fullId = "fullId-".concat(id);
      var halfId = "halfId-".concat(id);
      var noneId = "noneId-".concat(id);

      if (isEdit) {
        props = _objectSpread(_objectSpread({}, props), {}, {
          onMouseMove: this.onMouseMove,
          onMouseLeave: this.onMouseLeave,
          onChange: this.onChange
        });
      }

      for (var i = 1; i <= count; i++) {
        var style = i !== count ? {
          paddingRight: starGap
        } : null;
        starsList.push( /*#__PURE__*/_react.default.createElement("span", {
          key: "react-stars-rating-char".concat(i),
          className: "star star-".concat(i),
          style: style
        }, /*#__PURE__*/_react.default.createElement(_star.default, _extends({
          index: i,
          value: value,
          size: size,
          isHalf: isHalf,
          fullId: fullId,
          halfId: halfId,
          noneId: noneId
        }, props))));
      }

      return starsList;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          isEdit = _this$props5.isEdit,
          className = _this$props5.className,
          isArrowSubmit = _this$props5.isArrowSubmit,
          id = _this$props5.id;
      var stars = this.renderStars();
      var props;

      if (isEdit || isArrowSubmit) {
        props = {
          onKeyDown: this.onKeyDown,
          onBlur: this.onBlur
        };
      }

      return /*#__PURE__*/_react.default.createElement("span", _extends({
        id: id,
        role: "button"
      }, props, {
        style: isEdit ? _styles.default.activeContainer : _styles.default.inActiveContainer,
        className: className,
        tabIndex: "0"
      }), stars);
    }
  }]);

  return ReactStarsRating;
}(_react.PureComponent);

ReactStarsRating.propTypes = {
  onChange: _propTypes.default.func.isRequired,
  count: _propTypes.default.number.isRequired,
  value: _propTypes.default.number.isRequired,
  size: _propTypes.default.number.isRequired,
  primaryColor: _propTypes.default.string.isRequired,
  secondaryColor: _propTypes.default.string.isRequired,
  isEdit: _propTypes.default.bool.isRequired,
  isHalf: _propTypes.default.bool.isRequired,
  className: _propTypes.default.string.isRequired,
  starGap: _propTypes.default.number.isRequired,
  isArrowSubmit: _propTypes.default.bool.isRequired,
  id: _propTypes.default.string.isRequired
};
ReactStarsRating.defaultProps = {
  isEdit: true,
  isHalf: true,
  count: 5,
  value: 0,
  size: 25,
  primaryColor: 'orange',
  secondaryColor: 'grey',
  className: '',
  starGap: 0,
  isArrowSubmit: false,
  onChange: function onChange() {},
  id: "".concat(Date.now())
};
var _default = ReactStarsRating;
exports.default = _default;