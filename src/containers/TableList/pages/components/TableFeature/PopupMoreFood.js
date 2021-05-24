import React from "react";
import Button from "../../../../../components/common/Button";
import Food from "./Food";
import Paginate from "../../../../../components/common/Paginate";
import { LIMIT_ITEM } from "../../../../../consts/settings/dish/dish";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { withNamespaces } from "react-i18next";
import * as actions from "../../../actions";
import { TableListReducerName } from "../../../reducers";

class PopupMoreFood extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 0,
    }
  }
  render() {
    const { t, itemDishdetail } = this.props;
    var array_item = [];
    for (let i = 0; i < itemDishdetail.items.length; i++) {
        array_item.push(itemDishdetail.items[i]);
    }
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
                  array_item.map((food, index) => (
                    <Food
                      key={index}
                      food={food}
                    />
                  ))
                }
              </ul>
            </div>
          </div>
          <div className="pagination-btn e-flex content-end">
            <div className="btn-cancel e-flex content-end">
              <Button type="s3" style={{ marginRight: "5px" }} onClick={() => this.props.hide()}>{t("dishManagaments.close")}</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state[TableListReducerName],
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    tableActions: bindActionCreators({ ...actions }, dispatch),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(withNamespaces()(PopupMoreFood));