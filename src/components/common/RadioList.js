import React, { Component } from "react";
import InputType from "./InputType"

class RadioList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.selected
    };
  }
  /**
   * Update state when change prop
   * @param {*} nextProps
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.selected !== this.props.selected) {
      this.setState({ selected: nextProps.selected });
    }
  }

  onChange = (selected, item) => {
    this.setState({ selected });
    this.props.onChange(selected, item);
  };

  render() {
    const { name, dataSource, map, disabled, className } = this.props;
    const { selected } = this.state;
    return (
      <div className="radio-list flex-box">
        {dataSource.map((item, index) => (
          <div key={index} className={`radio-item${item.disabled || disabled ? ' disabled' : ''}`}>
            <label className="flex-box align-center">
              <InputType
                type="radio"
                id={`radio-list-${item.text}`}
                name={name}
                disabled={item.disabled ? item.disabled : disabled}
                onChange={e => this.onChange(item[map.key], item)}
                checked={item[this.props.map.key] === selected}
              />
              <span
                style={{ whiteSpace: "nowrap", cursor: "pointer" }}
                className="txt blue"
              >{item[this.props.map.text]}
              </span>
            </label>
          </div>
        ))}
      </div>
    );
  }
}
RadioList.defaultProps = {
  map: {
    key: "key",
    text: "text"
  },
  dataSource: [],
  onChange: () => { }
};

export default RadioList;
