import React from "react";
import { CheckBox, ImageLoading } from "../../../components/common/index";
import formats from '../../../utils/formats';
import ButtonBase from '../../../components/common/ButtonBase';

class ButtonCheck extends ButtonBase {
  render() {
    const { className, children } = this.props;
    const { classAnimation } = this.state;
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

export default class FoodItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.checked,
    };
  }
  onHandleFoodCheck = (checked, id, name) => {
    this.setState({
      checked: !checked,
    });
    this.props.onHandleFoodCheck(id, !checked, name);
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
    const { food, lng, partnerSetting } = this.props;
    return (
      <ButtonCheck
        className="food-item"
        onClick={(event) => {
          event.preventDefault();
          this.onHandleFoodCheck(checked, food.id, food.name);
        }}
      >
        <div className="check-food">
          <CheckBox
            type="s6"
            checked={checked}
            onChange={() => { }}
          />
        </div>

        <div className="img-food">
          <ImageLoading src={food.image} alt="img food" />
        </div>
        <div className="content-food">
          <h3 className="name-food">{food.name}</h3>
          <span className="price" style={{ "color": "red" }}>
            {formats.moneyFormat(food.sale_price)}{lng === "vi" ? partnerSetting.currency.name_vn :
              lng === "en" ? partnerSetting.currency.name_en :
                partnerSetting.currency.name_jp}
          </span>
        </div>
      </ButtonCheck>
    )
  }
}