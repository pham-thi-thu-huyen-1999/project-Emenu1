import React from "react";
import Loading from "../../../components/common/Loading";
import HeaderRestaurant from "./HeaderRestaurant";
import FooterRestaurant from "./FooterRestaurant";
import SideBarMobile from "./SideBarMobile";
import FoodList from "./FoodList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhoneAlt,
  faClock,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import FoodListPartnerNoCombo from "./compPartnerIsCombo/FoodListPartnerNoCombo";
import AboutRestaurant from "./AboutRestaurant";
// import TabFoodRestaurant from "./TabFoodRestaurant"
import Food from "./Food"
import { Link } from 'react-scroll'
import { LOGIN } from "../../Login/constants";
import PopupFoodSearch from './PopupFoodSearch';
import _ from "lodash";
import CompDetailResIsCombo from "./compPartnerIsCombo/CompDetailResIsCombo";
import CompDetailResNoCombo from "./compPartnerIsCombo/CompDetailResNoCombo";


class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: null,
      // showSideBar: false,
      //infoPartner: this.props.infoPartner ? this.props.infoPartner : null,
      // itemSearch: [],
      // categoryNameT: this.props.categoryItemList.length > 0 ? this.props.categoryItemList[0].name : "",
      // comboIdT: this.props.comboItemList.length > 0
      //   ? this.props.comboItemList[0].id : "",
      // comboNameT: this.props.comboItemList.length > 0 ? this.props.comboItemList[0].name : "",
      // countClickOnSearch: false,
      CateItemList: this.props.itemLists,
      itemLists: this.props.itemLists,
      listSearch: [],
      getPositionTab: [],
      infoPartnerSetting: this.props.infoPartnerSetting
    };
  }

  // onShowSideBar = () => {
  //   this.setState({
  //     showSideBar: true,
  //   });
  // };

  // onHiddenSideBar = () => {
  //   this.setState({
  //     showSideBar: false,
  //   });
  // };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(prevState.itemLists) !== JSON.stringify(nextProps.itemLists)) {
      return {
        CateItemList: nextProps.itemLists,
        itemLists: nextProps.itemLists,
        infoPartnerSetting: nextProps.infoPartnerSetting
      }
    }
    return null;
  }

  // onSearch = (categoryName, comboName, comboId) => {
  //   const { categoryNameT, comboNameT, comboIdT } = this.state;
  //   if (categoryName === "" && comboName !== "") {
  //     this.setState({
  //       comboNameT: comboName,
  //       comboIdT: comboId,
  //       countClickOnSearch: true,
  //     })
  //   }
  //   if (categoryName !== "" && comboName === "") {
  //     this.setState({
  //       categoryNameT: categoryName,
  //       countClickOnSearch: true,
  //     })
  //   }

  //   this.props.actions.getComboById({
  //     combo_item_id: comboId === ""
  //       ? comboIdT : comboId, categoryName: categoryName === ""
  //         ? categoryNameT : categoryName
  //   });
  // }

  // onSearchItem = (categoryName) => {
  //   this.props.actions.getOrderItem({ categoryName });
  //   this.setState({
  //     categoryNameT: categoryName
  //   })
  // }







  onShowPopupSearch = value => {
    this.onPushItemCategory(this.state.CateItemList)
    this.setState({ isVisible: value })
  }

  onPushItemCategory = data => {
    let newList = [];
    data.map((list) => (
      list.items.map((item, index) => (
        newList = newList.concat(item)
      ))
    ))
    return this.setState({ listSearch: newList })
  }

  render() {
    const { ...rest } = this.props;
    const { t, isLoading, infoPartnerSetting } = this.props;
    const { CateItemList, listSearch } = this.state;
    return (

      <div id="detail-root">
        <div id="detail-restaurant">
          <Loading show={isLoading} />
          {this.props.infoPartner !== null ?
            <AboutRestaurant partner={this.props.infoPartner} t={t} {...rest}></AboutRestaurant> : null}
          {/* <HeaderRestaurant
          onShowSideBar={this.onShowSideBar}
          onHiddenSideBar={this.onHiddenSideBar}
          infoPartner={infoPartner}
          onSearch={this.onSearch}
          categoryName={categoryNameT}
          showSideBar={showSideBar}
          t={t}
          {...rest}
        /> */}
          <aside className="food-res">
            {infoPartnerSetting &&
              infoPartnerSetting.partner_type !== 2 ?
              <CompDetailResNoCombo {...rest} onShowPopupSearch={value => this.onShowPopupSearch(value)} t={t}/> :
              <CompDetailResIsCombo {...rest} onShowPopupSearch={value => this.onShowPopupSearch(value)} t={t}/>
            }
          </aside>
          <FooterRestaurant t={t} {...rest} />
          {this.state.isVisible &&
            <PopupFoodSearch
              isVisible={this.state.isVisible}
              onHidden={() => { this.setState({ isVisible: false }) }}
              t={t} dataSearch={listSearch} />}
        </div>
      </div>
    );
  }
}
export default Main;
