import _objectSpread from "/Users/fedoryakubovich/Documents/projects/react-awesome-stars-rating/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectSpread";
import _classCallCheck from "/Users/fedoryakubovich/Documents/projects/react-awesome-stars-rating/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/fedoryakubovich/Documents/projects/react-awesome-stars-rating/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/fedoryakubovich/Documents/projects/react-awesome-stars-rating/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/fedoryakubovich/Documents/projects/react-awesome-stars-rating/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "/Users/fedoryakubovich/Documents/projects/react-awesome-stars-rating/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "/Users/fedoryakubovich/Documents/projects/react-awesome-stars-rating/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/inherits";
import React, { PureComponent } from 'react';
import Star from './star';
import styles from './styles';

var ReactStarsRating =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(ReactStarsRating, _PureComponent);

  function ReactStarsRating(props) {
    var _this;

    _classCallCheck(this, ReactStarsRating);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ReactStarsRating).call(this, props));
    _this.state = {
      value: props.value,
      isSubmitted: false
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
      this.setState({
        isSubmitted: true
      });
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
          starGap = _this$props4.starGap;
      var value = this.state.value;
      var starsList = [];
      var props = {
        primaryColor: primaryColor,
        secondaryColor: secondaryColor
      };

      if (isEdit) {
        props = _objectSpread({}, props, {
          onMouseMove: this.onMouseMove,
          onMouseLeave: this.onMouseLeave,
          onChange: this.onChange
        });
      }

      for (var i = 1; i <= count; i++) {
        var style = i !== count ? {
          paddingRight: starGap
        } : null;
        starsList.push(React.createElement("span", {
          key: "react-stars-rating-char".concat(i),
          className: "star star-".concat(i),
          style: style
        }, React.createElement(Star, Object.assign({
          index: i,
          value: value,
          size: size,
          isHalf: isHalf
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
          isArrowSubmit = _this$props5.isArrowSubmit;
      var stars = this.renderStars();
      var props = {
        tabIndex: -1
      };
      var isSubmitted = this.state.isSubmitted;

      if ((isEdit || isArrowSubmit) && !isSubmitted) {
        props = {
          onKeyDown: this.onKeyDown,
          onBlur: this.onBlur,
          tabIndex: 0
        };
      }

      return React.createElement("span", Object.assign({
        id: "react-awesome-stars-rating",
        role: "button",
        className: className
      }, props, {
        style: isEdit ? styles.activeContainer : styles.inActiveContainer
      }), stars);
    }
  }]);

  return ReactStarsRating;
}(PureComponent);

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
  onChange: function onChange() {}
};
export default ReactStarsRating;