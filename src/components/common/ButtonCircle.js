import React from "react";
import PropTypes from "prop-types";
import ButtonBase from "./ButtonBase";

export default class ButtonCircle extends ButtonBase {
  static propTypes = {
    onClick: PropTypes.func,
    type: PropTypes.string,
    main: PropTypes.bool,
    big: PropTypes.bool,
  };

  render() {
    const { type, main, big, style, className, disabled } = this.props;
    const { classAnimation } = this.state;
    return (
      <div
        className={`button-circle ${disabled ? "disable" : ""} ${type || ""} ${main ? "main-btn" : "s-btn e-border-gray"
          } ${big ? "big" : ""} ${className || ""} ${classAnimation}`}
        onClick={this.handleEvent}
        ref={ref => this.elementRef = ref}
        style={{ overflow: "ellipsis", ...style }}
      >
        {this.props.children}
      </div>
    );
  }
}
