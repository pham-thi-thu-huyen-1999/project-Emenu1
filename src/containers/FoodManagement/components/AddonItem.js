import React from "react";
import { CheckBox, ImageLoading } from "../../../components/common/index";
import formats from '../../../utils/formats';
import ButtonBase from '../../../components/common/ButtonBase';

class ButtonCheck extends ButtonBase {
  render() {
    const { className, children } = this.props;
    return (
      <li
        className={`${className}`}
        onClick={this.handleEvent}
        ref={ref => this.elementRef = ref}
      >
        {children}
      </li>
    )
  }
}

export default class AddonItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.checked,
    };
  }

  onHandleAddonCheck = (checked, id, name) => {
    this.setState({
      checked: !checked,
    });
    this.props.onHandleAddonCheck(id, !checked, name);
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.checked !== prevState.checked) {
      return {
        checked: nextProps.checked
      }
    }
    return null
  }

  render() {
    const { checked } = this.state;
    const { addon } = this.props;
    return (
      <ButtonCheck
        className="addon-item"
        onClick={(event) => {
          event.preventDefault();
          this.onHandleAddonCheck(checked, addon.id, addon.name);
        }}
      >
        <div className="check-addon">
          <CheckBox
            type="s6"
            checked={checked}
            onChange={() => { }}
          />
        </div>

        <div className="img-addon">
          <ImageLoading src={addon.image} alt="img addon" />
        </div>
        <div className="content-addon">
          <h3 className="name-addon">{addon.name}</h3>
          <span className="price" style={{ "color": "red" }}>{formats.moneyFormat(addon.price)}đ</span>
        </div>
      </ButtonCheck>
    )
  }
}