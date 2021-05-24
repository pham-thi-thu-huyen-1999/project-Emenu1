import React from "react";
import { TagInput, Dialog, NumberRange } from "../../../../components/common";
import PopupListCombo from "../PopupListCombo"

export class ComboDiscount extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: [],
      showPopupListCombo: false,
      listComboChecked: [],
      discount: 0
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
    this.setState({
      listComboChecked
    })
    this.props.changeComboDetails(listComboChecked)
  }
  onDeleteCombo = (data) => {
    let { listComboChecked } = this.state
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
    const { ...rest } = this.props
    const { showPopupListCombo, listComboChecked, discount } = this.state
    const { t, errors } = this.props
    return (
      <div className="content-field-form">
        <div className="list-food">
          <span className="title-select">{t("promotions.selectComboDiscount")}</span>
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
          {errors.comboDiscount ?
            <div className="validation e-flex content-center">
              {errors.comboDiscount}
            </div>
            : ""
          }
        </div>
        <div className="discount">
          <span className="title-select" style={{ color: "red" }}>{t("promotions.discount")}</span>
          <div className="e-m-right-10 input-value e-flex">
            <NumberRange
              min={0}
              max={100}
              defaultValue={discount}
              onChange={this.changeDiscount}
            />
            <span className="unit e-flex content-center item-center" style={{ fontSize: "20px" }}>%</span>
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
      </div >
    )
  }
}