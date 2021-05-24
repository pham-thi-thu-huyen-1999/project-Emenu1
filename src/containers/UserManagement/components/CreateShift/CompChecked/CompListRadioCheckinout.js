import React from "react";
import PropTypes from "prop-types";
class CompListRadioCheckinout extends React.Component {
  static propTypes = {
    onChange: PropTypes.func
  };
  constructor(props) {
    super(props)
    this.state = {
      selected: props.selected
    }
  }
  onChange = (selected, item) => {
    this.setState({
      selected
    })
    this.props.onChange(selected, item)
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.selected !== this.props.selected) {
      this.setState({ selected: nextProps.selected });
    }
  }
  render() {
    const { item, index, listDataCheckInit } = this.props;
    const { selected } = this.state;
    return (
      <div className="item-chkbox">
        <label className="nice-check">
          <input
            type="radio"
            name="site_name"
            id="male"
            className={"input-checkbox"}
            disabled={listDataCheckInit.includes(item.id)}
            onChange={() => this.onChange(index, item)}
            checked={selected === index}
          />
          {/* //disable-default */}
          <span
            className={listDataCheckInit.includes(item.id)
              ? "pl disable-default" :
              (selected === index ? "pl selected" : "pl")
            }
          ></span>
        </label>
        <label>{item.name}</label>
      </div>
    )
  }
}

export default CompListRadioCheckinout