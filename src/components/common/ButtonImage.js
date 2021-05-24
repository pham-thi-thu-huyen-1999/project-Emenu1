import React from "react";
import PropTypes from "prop-types";
import ButtonBase from './ButtonBase';

export default class Button extends ButtonBase {

  /**
   * Render component
   */
  render() {
    const {className, style} = this.props;
    const { classAnimation } = this.state;

    const classCss = className || '';
    return (
      <div
        className={`${classCss} ${classAnimation}`}
        onClick={this.handleEvent}
        style={style}
        ref={ref => this.elementRef = ref}
      >
        {this.props.children}
      </div>
    );
  }

  static propTypes = {
    onClick: PropTypes.func
  };
}