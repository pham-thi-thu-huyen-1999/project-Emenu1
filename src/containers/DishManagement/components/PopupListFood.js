import React from "react";
import Button from "../../../components/common/Button";
import Food from "./Food";
import Paginate from "../../../components/common/Paginate";
import { LIMIT_ITEM } from "../../../consts/settings/dish/dish";
export default class PopupListFood extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 0
    }
  }

  onPageFoodChange = data => {
    this.setState({ page: data.selected + 1 })
    this.props.actions.getItemComboList({ combo_item_id: this.props.comboItemId, page: data.selected + 1, limit: LIMIT_ITEM, total_item: this.props.total_item })
  }
  render() {
    const { t, countPageAddon, foods } = this.props;
    const { ...rest } = this.props
    return (
      <div className="popup-list-food-seemore">
        <div className="e-flex content-center">
          <p className="title-dish-count">{t("dishManagaments.textDetailListFood")} {this.props.itemDishdetail.name}</p>
        </div>
        <div className="e-dialog-content">
          <div className="e-dialog-body">
            <div className="list-food-content list-food-seemore">
              <ul className="list-food" style={{ "padding": "0 40px" }}>
                {
                  foods.map((food, index) => (
                    <Food
                      key={index}
                      food={food}
                      {...rest}
                    />
                  ))
                }
              </ul>
            </div>
          </div>
          <div className="pagination-btn e-flex content-end">
            <div className="e-flex flex align-center">
              {
                countPageAddon > 1 ? (
                  <Paginate
                    pageCount={countPageAddon}
                    onChange={this.onPageFoodChange}
                    forcePage={this.state.page}
                  />
                ) : ""
              }
            </div>
            <div className="btn-cancel e-flex content-end">
              <Button type="s3" style={{ marginRight: "5px" }} onClick={() => this.props.hide()}>{t("dishManagaments.close")}</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}