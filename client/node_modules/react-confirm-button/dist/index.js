'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ConfirmButton = function (_React$Component) {
  (0, _inherits3.default)(ConfirmButton, _React$Component);

  function ConfirmButton(props) {
    (0, _classCallCheck3.default)(this, ConfirmButton);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ConfirmButton.__proto__ || (0, _getPrototypeOf2.default)(ConfirmButton)).call(this, props));

    _this.state = {
      is: 'active'
    };
    _this.onClickToggleState = _this.handleClick.bind(_this);
    _this.onClick = props.onClick ? props.onClick.bind(_this) : function () {};
    if (props.onConfirm) {
      _this.onConfirm = props.onConfirm.bind(_this);
    } else if (props.confirming && props.confirming.onClick) {
      _this.onConfirm = props.confirming.onClick.bind(_this);
    } else {
      _this.onConfirm = function () {};
    }
    // while confirming, when confirmed & disabling
    _this.onDisable = props.onDisable ? props.onDisable.bind(_this) : function () {};
    return _this;
  }

  (0, _createClass3.default)(ConfirmButton, [{
    key: 'handleClick',
    value: function handleClick() {
      var disableAfterConfirmed = this.props.disableAfterConfirmed;

      if (this.isConfirming() && disableAfterConfirmed) {
        // have confirmed and are now disabled
        this.onConfirm();
        this.onDisable();
        this.setState({ is: 'disabled' });
        return;
      }
      if (this.isConfirming()) {
        // we are clicking into the active state (from confirming)
        //   loop around to the beginning...
        this.onConfirm();
        this.setState({ is: 'active' });
        return;
      }
      // we are clicking into the confirming state (from active)
      this.onClick();
      this.setState({ is: 'confirming' });
    }
  }, {
    key: 'isDisabled',
    value: function isDisabled() {
      return this.state.is === 'disabled';
    }
  }, {
    key: 'isConfirming',
    value: function isConfirming() {
      return this.state.is === 'confirming';
    }
  }, {
    key: 'isActive',
    value: function isActive() {
      return !this.isConfirming() && !this.isDisabled();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          disableAfterConfirmed = _props.disableAfterConfirmed,
          children = _props.children,
          buttonProps = _props.buttonProps,
          confirming = _props.confirming,
          disabled = _props.disabled,
          asLink = _props.asLink;
      var _props2 = this.props,
          text = _props2.text,
          style = _props2.style,
          _props2$className = _props2.className,
          className = _props2$className === undefined ? 'btn btn-danger' : _props2$className;


      var isDisabled = this.isDisabled();
      var isConfirming = this.isConfirming();
      var isActive = this.isActive();

      if (isDisabled) {
        text = disabled && disabled.text || 'Loading...';
        className = disabled && disabled.className || 'btn btn-secondary';
        style = disabled && disabled.style || {};
      }
      if (isConfirming) {
        text = confirming && confirming.text || 'Confirm?';
        className = confirming && confirming.className || 'btn btn-warning';
        style = confirming && confirming.style || {};
      }

      if (asLink) {
        return _react2.default.createElement(
          'a',
          (0, _extends3.default)({
            className: (0, _classnames2.default)('confirm-button', className),
            style: style,
            onClick: this.onClickToggleState,
            disabled: isDisabled
          }, buttonProps),
          children,
          children ? ' ' : '',
          text
        );
      }

      return _react2.default.createElement(
        'button',
        (0, _extends3.default)({
          className: (0, _classnames2.default)('confirm-button', className),
          style: style,
          onClick: this.onClickToggleState,
          disabled: isDisabled
        }, buttonProps),
        children,
        children ? ' ' : '',
        text
      );
    }
  }]);
  return ConfirmButton;
}(_react2.default.Component);

exports.default = ConfirmButton;

ConfirmButton.propTypes = {
  // if true, we will disable the button after confirming & disabled
  // if false || empty, we will loop around and allow click & confirm again
  disableAfterConfirmed: _propTypes2.default.bool,
  // user passed in function - on confirmation
  onConfirm: _propTypes2.default.func,
  // user passed in function - on disable, after onConfirm
  onDisable: _propTypes2.default.func,
  // user passed in function - on click, before confirmation
  onClick: _propTypes2.default.func,
  // displayed normally, before confirming, while active
  text: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
  className: _propTypes2.default.string,
  style: _propTypes2.default.object,
  // displayed only while confirming
  confirming: _propTypes2.default.shape({
    text: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
    className: _propTypes2.default.string,
    style: _propTypes2.default.object,
    // alias for onConfirm (convenience)
    onClick: _propTypes2.default.func
  }),
  // displayed only after confirmed (clicked twice, disabled)
  disabled: _propTypes2.default.shape({
    text: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
    className: _propTypes2.default.string,
    style: _propTypes2.default.object
  }),
  // children always displayed (optional)
  children: _propTypes2.default.node,
  // custom props to pass into button
  buttonProps: _propTypes2.default.object,
  // as link <a> instead of button
  asLink: _propTypes2.default.bool
};
ConfirmButton.defaultProps = {
  buttonProps: {
    role: 'button'
  }
};