import React from "react";
import { imgFood } from "../../../../../consts/settings/dish/dish";
import formats from '../../../../../utils/formats';
import { ImageLoading } from '../../../../../components/common';

export default class Food extends React.Component {
  render() {
    //su dung trong man hinh popupSelectedFoodList
    const { food } = this.props;
    return (
      <li className="food-item food-see-more">
        <div className="img-food">
          {/* <img src={food.image === "" ? { imgFood } : food.image} alt="" /> */}
          <ImageLoading src={food.image === "" ? imgFood : food.image} />
        </div>
        <div className="content-food">
          <h3 className="name-food">{food.item_name}</h3>
          <span className="price" style={{ "color": "red" }}>{formats.moneyFormat(food.sale_price)}đ</span>
        </div>
      </li>
    )
  }
}