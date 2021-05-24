import React from "react";
import PropTypes from "prop-types";
import ButtonBase from "./ButtonBase"
export default class ButtonSquare extends ButtonBase {

  /**
   * Render component
   */
  render() {
    const { type, square, style, className, disabled } = this.props;
    const { classAnimation } = this.state;
    return (
      <div
        className={` ${disabled ? "disable" : ""} ${type || ""} ${square ? "square-btn" : "s-btn"
          } ${className || ""} ${classAnimation}`}
        onClick={this.handleEvent}
        style={{ overflow: "unset", ...style }}
        ref={ref => this.elementRef = ref}
      >
        {this.props.children}
      </div>
    );
  }

  static propTypes = {
    onClick: PropTypes.func,
    type: PropTypes.string,
    square: PropTypes.bool
  };
}