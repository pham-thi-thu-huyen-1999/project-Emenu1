import React from "react";
import { Button, Paginate } from "../../../components/common";
import ComboItem from "./ComboItem";
import { LIMIT_COMBO } from "../../../consts/settings/promotion"

export default class ListCombo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listComboChecked: [],
      comboItemDetails: this.props.listComboCheckedOpen
    }
  }
  componentDidMount() {
    const { comboItemDetails, listComboChecked } = this.state
    for (let i in comboItemDetails) {
      listComboChecked.push({
        combo_item_id: comboItemDetails[i].combo_item_id,
        combo_item_name: comboItemDetails[i].combo_item_name,
      })
    }
    this.setState({
      listComboChecked
    })
  }
  handleChecked = (combo, checked) => {
    let { listComboChecked } = this.state
    if (checked) {
      listComboChecked.push({ combo_item_id: combo.id, combo_item_name: combo.name })
    } else {
      listComboChecked = listComboChecked.filter(item => item.combo_item_id !== combo.id)
    }
    this.setState({
      listComboChecked
    })
  }
  addComboChecked = () => {
    const { listComboChecked } = this.state
    this.props.addComboChecked(listComboChecked)
    this.props.hidePopupListCombo()
  }
  /**
   * return list id combo checked
   * @param {*} list
   */
  changeToId = (list) => {
    let selected = []
    for (let i in list) {
      selected[i] = list[i].combo_item_id
    }
    return selected
  }
  onChangePage = (data) => {
    this.props.actions.getListComboItem({ limit: LIMIT_COMBO, page: data.selected + 1 });
  }
  render() {
    const { t, listCombo, pageCountCombo } = this.props
    const { listComboChecked } = this.state;
    const {...rest} = this.props;
    return (
      <div className="component-list-combo">
        <h3 className="title-list-combo">{t("promotions.titleListCombo")}</h3>
        <div className="list-combo e-flex">
          {
            listCombo.map((combo, index) => {
              let checked = this.changeToId(listComboChecked).includes(combo.id);
              return (
                <ComboItem
                  key={index}
                  checked={checked}
                  combo={combo}
                  handleChecked={this.handleChecked}
                  {...rest}
                />
              )
            })
          }
        </div>
        <div className=" e-m-right-20 e-flex">
          <div className="paginate e-flex content-start item-center flex">
            <Paginate
              forcePage={1}
              pageCount={pageCountCombo}
              onChange={this.onChangePage}
            />
          </div>
          <div className="btn-add-combo e-flex content-end">
            <Button type="s5" onClick={this.addComboChecked}>{t("promotions.add")}</Button>
          </div>
        </div>
      </div>
    )
  }
}