import React, { Component } from "react";
import { Link } from 'react-scroll';
import Food from "../Food";

export default class FoodListPartnerIsCombo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemLists: props.itemLists,
      listItemsNoCombo: props.itemLists
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
    const { listItemsIsCombo , t} = this.props;
    return (
      <>
        { listItemsIsCombo.map((cateName, index) => (
          <div className="content-food" key={index} id={'conten-' + index}>
            <h3>{cateName.name}</h3>
            {cateName.items.length > 0 ?
             cateName.items.map((catogory, index) => (
              <Food listFood={catogory} key={index} t={t} />
             )):<div className="noti-no-data">
             {t("detailRestaurant.no_data_dish")}</div>
          }
          </div>
        ))}
      </>
    )
  }
}