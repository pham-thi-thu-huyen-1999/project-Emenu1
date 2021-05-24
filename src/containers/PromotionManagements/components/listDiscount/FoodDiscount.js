import React from "react";
import { TagInput, Dialog, NumberRange } from "../../../../components/common";
import PopupListFood from "../PopupListFood"
export class FoodDiscount extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showPopupListFood: false,
      foodDetails: [],
      discount: 0
    }
  }
  handleSelected = (list) => {
    let selected = []
    for (let i in list) {
      selected[i] = list[i].item_id
    }
    return selected
  }
  addFoodChecked = (foodChecked) => {
    this.setState({
      foodDetails: foodChecked
    })
    this.props.changeListFood(foodChecked)
  }
  onDeleteItem = (data) => {
    const { foodDetails } = this.state
    let newList = []
    newList = foodDetails.filter(item => item.item_id !== data.item_id)
    this.setState({ foodDetails: newList })
    this.props.changeListFood(newList)
  }
  changeDiscount = discount => {
    this.setState({ discount })
    this.props.changeDiscount(discount)
  }
  render() {
    const { showPopupListFood, foodDetails, discount } = this.state
    const { ...rest } = this.props
    const { t, errors } = this.props
    return (
      <div className="content-field-form">
        <div className="list-food">
          <span>{t("promotions.selectFoodDiscount")}</span>
          <div className="from-fist-selected">
            <TagInput
              onAction={() => this.setState({ showPopupListFood: true })}
              className="list-food-selected"
              dataSource={foodDetails}
              onChange={this.onDeleteItem}
              iconColor='#f27922'
              map={{
                key: "item_id",
                text: "item_name"
              }}
              selected={this.handleSelected(foodDetails)}
            />
          </div>
          {errors.foodDiscount ?
            <div className="validation e-flex content-center">
              {errors.foodDiscount}
            </div>
            : ""
          }
        </div>
        <div className="discount">
          <span style={{ color: "red" }}>{t("promotions.discount")}</span>
          <div className="e-m-right-10 input-value e-flex">
            <NumberRange
              min={0}
              max={100}
              defaultValue={discount}
              onChange={this.changeDiscount}
            />
            <span className="unit e-flex content-center item-center">%</span>
          </div>
        </div>
        <Dialog
          show={showPopupListFood}
          close={() => this.setState({ showPopupListFood: false })}
          innerClass="popup-add-promotion"
        >
          <PopupListFood
            addFoodChecked={this.addFoodChecked}
            listFoodCheckedOpen={foodDetails}
            hidePopupListFood={() => this.setState({ showPopupListFood: false })}
            {...rest}
          />
        </Dialog>
      </div>
    )
  }
}