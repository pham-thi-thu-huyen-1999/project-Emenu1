import React, { Component } from "react";
import moment from "moment";
import { HEIGHT_FOOD_DEFAULT } from "./../constants"
export default class FoodColumn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: HEIGHT_FOOD_DEFAULT,
    }
  }

  componentDidMount() {
    const height = this.getHeight();
    this.setState({
      height
    })
  }

  /**
   * Caculate height of food item
   */
  getHeight = () => {
    // Get parent element of food item
    const parent = document.querySelector('.tab-panel-food-list .food-list-slick');
    let result = this.state.height;
    if (parent) {
      // Get height of parent
      const parentHeight = parent.clientHeight;
      // Get food item height
      const foodItemHeight = parentHeight / 5;
      result = foodItemHeight > HEIGHT_FOOD_DEFAULT ? foodItemHeight : result;
    }
    return result;
  }

  render() {
    const { orderFoodItem, showPopupDishDetail, t } = this.props;
    const height = this.getHeight();
    if (orderFoodItem !== null) {
      return (
        <div className="it flex-view middle"
          style={{
            height
          }}
          onClick={() => showPopupDishDetail(orderFoodItem)}
        >
          <span className="numerical">{this.props.no < 10 ? '0' + this.props.no : this.props.no}</span>
          <span className="food-image" style={{
            backgroundImage: `url(${orderFoodItem.image}),url(${require("../../../images/logo-omenu.png")})`
          }}>
          </span>
          <span className="name">
            <span className="txt">{orderFoodItem.item_name}</span>
            {orderFoodItem.note && orderFoodItem.note.trim() !== "" ?
              (<><span className="pl">{orderFoodItem.note}</span> <span className="note">{orderFoodItem.note}</span></>) : null
            }
          </span>
          <span className="quantity">
            <span className="number">{orderFoodItem.qty}</span>
            {orderFoodItem.unit_item && orderFoodItem.unit_item.name}
          </span>
          
          <span className="sub-info">
            <div className="">
              {orderFoodItem.order && orderFoodItem.order.table && orderFoodItem.order.table.table_type && orderFoodItem.order.table.table_type.name_vn === "Vip" ? <img className="type" src="/images/tbl-type.png" alt="" /> : null}
            </div>
            <div className="table_name">
            {orderFoodItem.order && orderFoodItem.order.table && orderFoodItem.order.table.name ? this.props.t("foodProcessing.table_") + orderFoodItem.order.table.name : t("foodProcessing.Takeaway")}
            </div>
            <div className="time-order">
              {
                moment(orderFoodItem.created_at).fromNow()
              }
            </div>
          </span>
        </div>
      );
    } else {
      return (
        <span></span>
      );
    }
  }
}
