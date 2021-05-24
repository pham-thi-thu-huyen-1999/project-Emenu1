import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhoneAlt,
  faClock,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import FoodListPartnerNoCombo from "./FoodListPartnerNoCombo";
import Food from "../Food";
import { Link } from 'react-scroll';

export default class CompDetailResNoCombo extends Component {
  constructor(props) {
    super(props);
    this.tabRef = React.createRef()
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
    const { ...rest } = this.props;
    const { t } = this.props;
    // console.log(this.tabRef.current.getBoundingClientRect());
    return (
      <>
        <div className="food-res__header sticky" >
          <div className="search-food" onClick={() => this.props.onShowPopupSearch(true)}>
            <FontAwesomeIcon icon={faSearch} />
          </div>
          {listItemsNoCombo && listItemsNoCombo.length > 0 ?
            <div className="category">
              {listItemsNoCombo.map((catItem, index) => (
                index === 0 ?
                  <div ref={this.tabRef} key={index}>
                    <Link activeClass="active"
                      onSetActive={this.handleSetActive}
                      onSetInactive={this.handleSetInactive}
                      to={'conten-' + index} spy={true}
                      offset={50}
                      smooth={true} key={index}
                      containerId="detail-root"
                    >{catItem.category_item_name}</Link>
                  </div>
                  : <div ref={this.tabRef} key={index}>
                    <Link
                      containerId="detail-root"
                      to={'conten-' + index}
                      spy={true} smooth={true}
                      key={index}>{catItem.category_item_name}
                    </Link></div>
              ))}</div>
            : null
          }
        </div>
        <FoodListPartnerNoCombo {...rest} />
      </>
    );
  }
}