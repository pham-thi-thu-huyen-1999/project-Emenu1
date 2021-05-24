import React, { Component } from "react";

import Food from "../Food";

export default class FoodListPartnerNoCombo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemLists: this.props.itemLists,
      listItemsNoCombo: this.props.itemLists
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(prevState.itemLists) !== JSON.stringify(nextProps.itemLists)) {
      return {
        listItemsNoCombo: nextProps.itemLists,
        itemLists: nextProps.itemLists,
        infoPartnerSetting: nextProps.infoPartnerSetting
      }
    }
    return null;
  }

  render() {
    const { listItemsNoCombo } = this.state;
    const { t } = this.props
    return (
      <>
        {
          listItemsNoCombo && listItemsNoCombo.length > 0 ?
            listItemsNoCombo.map((cateName, index) => (
              <div className="content-food" key={index} id={'conten-' + index}>
                <h3>{cateName.category_item_name}</h3>
                {cateName.items.length > 0 ?
                  cateName.items.map((item, index) => (
                    <Food listFood={item} key={index} t={t} />
                  )) : <div className="noti-no-data">
                    {t("detailRestaurant.no_data_dish")}</div>
                }
              </div>
            )) : null
        }
      </>
    )
  }
}