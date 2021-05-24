import React from "react"
import { Button, Paginate } from "../../../components/common";
import FoodItem from "./FoodItem";
import { LIMIT_ITEM } from "../../../consts/settings/promotion"
export default class ListFood extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listFoodChecked: [],
      itemDetails: this.props.listFoodCheckedOpen
    }
  }

  componentDidMount() {
    const { itemDetails, listFoodChecked } = this.state
    for (let i in itemDetails) {
      listFoodChecked.push({
        item_id: itemDetails[i].item_id,
        item_name: itemDetails[i].item_name,
      })
    }
    this.setState({
      listFoodChecked
    })
  }

  handleChecked = (food, checked) => {
    let { listFoodChecked } = this.state
    if (checked) {
      listFoodChecked.push({ item_id: food.id, item_name: food.name })
    }
    else {
      listFoodChecked = listFoodChecked.filter(item => item.item_id !== food.id)
    }
    this.setState({
      listFoodChecked
    })
  }
  addFoodAfterChecked = () => {
    const { listFoodChecked } = this.state
    this.props.addFoodChecked(listFoodChecked)
    this.props.hidePopupListFood()
  }
  changeToId = (list) => {
    let selected = []
    for (let i in list) {
      selected[i] = list[i].item_id
    }
    return selected
  }
  onChangePage = (data) => {
    this.props.actions.getListItem({ limit: LIMIT_ITEM, page: data.selected + 1 });
  }
  render() {
    const { listFoodChecked } = this.state
    const { t, listFood, pageCountItem } = this.props
    const {...rest} = this.props;
    return (
      <div className="component-list-combo">
        <h3 className="title-list-combo">{t("promotions.titleListFood")}</h3>
        <div className="list-combo e-flex">
          {listFood.map((food, index) => {
            let checked = this.changeToId(listFoodChecked).includes(food.id);
            return (
              <FoodItem
                key={index}
                checked={checked}
                food={food}
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
              pageCount={pageCountItem}
              onChange={this.onChangePage}
            />
          </div>
          <div className="btn-add-combo e-flex content-end">
            <Button type="s5" onClick={this.addFoodAfterChecked}>{t("promotions.add")}</Button>
          </div>
        </div>
      </div>
    )
  }
}