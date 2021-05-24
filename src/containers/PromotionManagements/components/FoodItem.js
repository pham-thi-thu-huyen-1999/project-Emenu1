import React from "react";
import { CheckBox } from "../../../components/common";
export default class FoodItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: props.checked
    }
  }
  onChange = (food) => {
    const { checked } = this.state
    this.setState({
      checked: !checked
    })
    this.props.handleChecked(food, !checked)
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.checked !== prevState.checked) {
      return {
        checked: nextProps.checked
      }
    }
    return null
  }
  render() {
    const { checked } = this.state
    const { food, partnerSetting, lng } = this.props;
    return (
      <div className="combo-item">
        <div className="content-name-combo content-item">
          <span className="name-combo">{food.name}</span>
        </div>
        <div className="content-image-combo content-item">
          <img src={food.image}
            style={{ width: "150px", height: "150px" }} alt="" />
        </div>
        <div className="content-price-combo content-item">
          <div className="price-combo e-flex content-center item-center">
            <span style={{ color: "red" }}>{food.sale_price}
            {lng === "vi" ? partnerSetting.currency.name_vn :
              lng === "en" ? partnerSetting.currency.name_en :
                partnerSetting.currency.name_jp}</span>
          </div>
        </div>
        <div className="check-combo">
          <CheckBox
            checked={checked}
            onChange={() => this.onChange(food)}
          />
        </div>
      </div>
    )
  }
}