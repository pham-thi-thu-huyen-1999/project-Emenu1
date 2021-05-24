import React, { Component } from "react";
import PropTypes from "prop-types";

class SelectBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      selected: props.selected,
      disabled: props.disabled
    };
  }
  /**
   * handler click outsite
   */
  clickOutSite = () => {
    if (this.state.show) {
      this.setState({ show: false })
    }
  }
  /**
   * Emit event on change
   */
  onChange(selected, item) {
    this.setState({ selected });
    this.props.onChange(selected, item);
  }
  /**
   * Update state on prop change value
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.selected !== this.props.selected) {
      this.setState({ selected: nextProps.selected });
    }
  }
  /**
   * Lifecycle init component
   */
  componentDidMount() {
    window.addEventListener('click', this.clickOutSite)
  }
  /**
   * Lifecycle destroy component
   */
  componentWillUnmount() {
    window.removeEventListener('click', this.clickOutSite)
  }
  /**
   * Show dropdown
   */
  showDropdown = event => {
    const { disabled } = this.state
    if (!disabled) {
      this.setState({
        show: !this.state.show
      });
      event.stopPropagation();
    }

  }
  // Render
  render() {
    const { map, blank, dataSource, item, className, value_copy } = this.props;
    let selected = dataSource.find(item => {
      return item[map.key] === this.state.selected;
    });

    if (!selected) {
      selected = {};
      selected[map.text] = blank ? blank : "　";
    }

    if(value_copy)
    {
      selected = {};
      selected[map.text] = value_copy ? value_copy : blank;
      console.log("value_copy", value_copy)
    }

    return (
      <div className={className ? `val-wrap ${className}` : "val-wrap"}
        style={this.props.style}>
        <aside className={`select-box ${this.state.show ? "show" : ""} `}>
          <div
            className="curr-val"
            onClick={event => this.showDropdown(event)}
          >
            <div className="lt">
              <span className="txt" style={{ color: "#857b80" }}>{selected[map.text]}</span> {/* su dung ma mau hex giong placeholder */}
            </div>
            <div className="rt">{this.props.children}</div>
            <ul className="opts tbl-status list">
              {dataSource.map((item, index) => (
                <li
                  className={`it${selected[map.key] === item[map.key] ? ' selected' : ''}`}
                  key={index}
                  onClick={e => this.onChange(item[map.key], item)}
                >
                  <span className="txt">{item[map.text]}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    );
  }
}

SelectBox.propTypes = {
  onChange: PropTypes.func.isRequired,
  dataSource: PropTypes.array.isRequired
};
SelectBox.defaultProps = {
  map: {
    key: "key",
    text: "text"
  },
  disabled: false
};

export default SelectBox;
