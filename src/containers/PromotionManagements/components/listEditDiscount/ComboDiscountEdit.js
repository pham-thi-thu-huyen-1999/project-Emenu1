import React from "react";
import { Input, Button, TagInput, Dialog, NumberRange } from "../../../../components/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import PopupListCombo from "../PopupListCombo"

export class ComboDiscountEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: [],
      showPopupListCombo: false,
      listComboChecked: this.props.promoComboItemDiscountDetail,
      discount: props.promotionDetail.discount_item_value
    }
  }
  handleSelected = (list) => {
    let selected = []
    for (let i in list) {
      selected[i] = list[i].combo_item_id
    }
    return selected
  }
  addComboChecked = (listComboChecked) => {
    let comboDetails = []
    listComboChecked.map(combo => {
      comboDetails.push({ combo_item_id: combo.combo_item_id })
    })
    this.setState({
      listComboChecked
    })
    this.props.changeComboDetails(comboDetails)
  }
  onDeleteCombo = (data) => {
    const { listComboChecked } = this.state
    let newList = []
    newList = listComboChecked.filter(item => item.combo_item_id !== data.combo_item_id)
    this.setState({ listComboChecked: newList })
    this.props.changeComboDetails(newList)
  }
  changeDiscount = discount => {
    this.setState({ discount })
    this.props.changeDiscount(discount)
  }
  render() {
    const { showPopupListCombo, listComboChecked, discount } = this.state
    const { ...rest } = this.props
    const { t } = this.props
    return (
      <div className="content-field-form">
        <div className="list-food">
          <span>{t("promotions.selectComboDiscount")}</span>
          <div className="from-fist-selected">
            <TagInput
              onAction={() => this.setState({ showPopupListCombo: true })}
              className="list-food-selected"
              dataSource={listComboChecked}
              iconColor='#f27922'
              map={{
                key: "combo_item_id",
                text: "combo_item_name"
              }}
              selected={this.handleSelected(listComboChecked)}
              onChange={this.onDeleteCombo}
            />
          </div>
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
          show={showPopupListCombo}
          close={() => this.setState({ showPopupListCombo: false })}
          innerClass="popup-add-promotion"
        >
          <PopupListCombo
            addComboChecked={this.addComboChecked}
            listComboCheckedOpen={listComboChecked}
            hidePopupListCombo={() => this.setState({ showPopupListCombo: false })}
            {...rest}
          />
        </Dialog>
      </div>
    )
  }
}