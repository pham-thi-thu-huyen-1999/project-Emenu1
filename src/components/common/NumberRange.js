import React, { Component } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import ButtonBase from "./ButtonBase";

class ButtonCircle extends ButtonBase {

  render() {
    const { className, style } = this.props;
    const { classAnimation } = this.state;

    const classCss = className || "";
    return (
      <span
        className={`${classCss} ${classAnimation}`}
        style={style}
        onClick={this.handleEvent}
        ref={ref => this.elementRef = ref}
      >
        {this.props.children}
      </span>
    )
  }
}

export default class NumberRange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultValue: props.defaultValue || 1,
      min: props.min || 0,
      max: props.max,
    };
  }

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    max: PropTypes.number,
    defaultValue: PropTypes.number,
    min: PropTypes.number,
    height: PropTypes.number,
    autoFocus: PropTypes.bool,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.defaultValue !== prevState.defaultValue) {
      return {
        defaultValue: nextProps.defaultValue
      }
    }
    return null
  }

  onMinus = () => {
    const { defaultValue, min } = this.state;

    if (defaultValue - 1 >= min) {
      this.setState({ defaultValue: defaultValue - 1 });
      this.props.onChange(defaultValue - 1);
    }
  };

  onPlus = () => {
    const { defaultValue, max } = this.state;
    if (defaultValue < max) {
      this.setState({ defaultValue: defaultValue + 1 });
      this.props.onChange(defaultValue + 1);
    }
  };

  onChange = (e) => {
    const { max, min } = this.state;
    if (min < e && e < max) {
      this.setState({ defaultValue: parseInt(e) });
      this.props.onChange(parseInt(e));
    }
  };

  render() {
    const { defaultValue } = this.state;
    return (
      <aside className="select-qty">
        <ButtonCircle
          className="act sub"
          style={{ background: "#ED630B", fontSize: "10px" }}
          onClick={this.onMinus}
        >
          <FontAwesomeIcon icon={faMinus} />
        </ButtonCircle>
        <span className="num">
          <input
            style={{ height: this.props.height || 30 }}
            type="number"
            name="dishes-qty[]"
            autoFocus={this.props.autoFocus || false}
            className="f-control num-val"
            value={defaultValue}
            onChange={(e) => this.onChange(e.target.value)}
          />
        </span>
        <ButtonCircle
          className="act add"
          style={{ background: "#ED630B" }}
          onClick={this.onPlus}
        >
          <FontAwesomeIcon icon={faPlus} />
        </ButtonCircle>
      </aside>
    );
  }
}
