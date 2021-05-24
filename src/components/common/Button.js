import React from "react";
import PropTypes from "prop-types";
import ButtonBase from './ButtonBase';

export default class Button extends ButtonBase {

  /**
   * Render component
   */
  render() {
    const { type, main, big, style, className, disabled } = this.props;
    const { classAnimation } = this.state;

    const classMain = main ? 'emenu-button main-btn' : 'emenu-button s-btn e-border-gray';
    const classDisabled = disabled ? 'disable' : '';
    const classType = type || '';
    const classPig = big ? 'big' : '';
    const classCss = className || '';
    return (
      <div
        className={`${classDisabled} ${classType} ${classMain} ${classPig} ${classCss} ${classAnimation}`}
        onClick={this.handleEvent}
        style={style}
        ref={ref => this.elementRef = ref}
      >
        {this.props.children}
      </div>
    );
  }

  static propTypes = {
    onClick: PropTypes.func,
    type: PropTypes.string,
    main: PropTypes.bool,
    big: PropTypes.bool,
    audio: PropTypes.bool
  };
}