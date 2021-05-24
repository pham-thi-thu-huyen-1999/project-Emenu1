import React from "react";
import { imgFood } from "../../../consts/settings/dish/dish";
import formats from '../../../utils/formats';

export default class Food extends React.Component {
  render() {
    const { food, lng, partnerSetting } = this.props;
    return (
      <li className="food-item food-see-more">
        <div className="img-food">
          <img src={food.image === "" ? { imgFood } : food.image} alt="" />
        </div>
        <div className="content-food">
          <h3 className="name-food">{food.name}</h3>
          <span className="price" style={{ "color": "red" }}>
            {formats.moneyFormat(food.sale_price)}
            {lng === "vi" ? partnerSetting.currency.name_vn :
              lng === "en" ? partnerSetting.currency.name_en :
                partnerSetting.currency.name_jp}</span>
        </div>
      </li>
    )
  }
}