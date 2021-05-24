import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faAngleDown, faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import PopupAddDish from "./PopoupAddDish";
import DistList from "./DishList";
import Option from "./Option";
import { Button, Paginate, Input, Dialog } from "../../../components/common"
import SelectBox from "../../../components/common/SelectBox"
import Loading from "../../../components/common/Loading";
import { LIMIT_ITEM_FOOD_MANAGEMENT } from "../../../consts/settings/dish/dish"

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopupAddSet: false,
      showPopupDeleteSet: false,
      showPopupAddDish: false,
      showPopupOption: false,
      showPopupDeleteOption: false,
      showPopupEditOption: false,
      iOption: null,
      slickIndex: 0,
      selected: null,
      itemList: [],
      searchNameItem: null,
      searchCategoryItem: null,
      resultAfterSearch: null,
      searching: null,
      searchCategoryId: '',
      currentPage: 1,
      pageCount: 1,
      page: 1,
      checkSearch: false,
      checkOnchange: true,
      totalBySearch: this.props.totalBySearch
    };
  }
  next = () => {
    this.slider.slickNext();
  };
  previous = () => {
    this.slider.slickPrev();
  };
  onEdit = setEdit => {
    let { set } = this.state;
    if (setEdit.type === setEdit.oldType) {
      const index = setEdit.index;
      delete setEdit.index;
      let id;
      set.forEach((item, index) => {
        if (item.setName === setEdit.type) {
          id = index;
        }
      });
      set[id].setFood.splice(index, 1, setEdit);
      this.setState({ set });
    } else {
      const index = setEdit.index;
      delete setEdit.index;
      let idsetOld;
      set.forEach((item, index) => {
        if (item.setName === setEdit.oldType) {
          idsetOld = index;
        }
      });
      set[idsetOld].setFood.splice(index, 1);
      let idsetNew;
      set.forEach((item, index) => {
        if (item.setName === setEdit.type) {
          idsetNew = index;
        }
      });
      set[idsetNew].setFood.splice(
        set[idsetNew].setFood.length + 1,
        1,
        setEdit
      );
      this.setState({ set });
    }
  };

  searchingKindId = kindId => {
    this.setState({
      selected: kindId,
      checkSearch: false,
      checkOnchange: false
    })
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.itemList !== prevState.itemList) {
      return {
        itemList: nextProps.itemList,
        totalBySearch: nextProps.totalBySearch
      }
    }
    return null;
  }

  loadMore = (data) => {
    var { searchNameItem, searchCategoryItem, selected } = this.state;
    var category_id = searchCategoryItem === "all" ? "" : searchCategoryItem;
    var name_search = searchNameItem;
    var group_type = selected === 0 ? "" : selected;
    const { page } = this.state;
    if (page <= this.props.limitPage) {
      this.props.actions.getItemListBySearchAdvanced({
        page: page + 1,
        limit: LIMIT_ITEM_FOOD_MANAGEMENT, category_id, name_search, group_type
      })
    }
    this.setState({
      page: page + 1
    })
  }

  onSearch = (name_search, category_id, group_type) => {

    if ((name_search === "" && category_id === "all" && group_type === 0) || (name_search === null && category_id === null && group_type === null) || (name_search === "" && category_id === null && group_type === null) || (name_search === null && category_id === null && group_type === 0) || (name_search === null && category_id === "all" && group_type === null) || (name_search === "" && category_id === "all" && group_type === null) || (name_search === "" && category_id === null && group_type === 0) || (name_search === null && category_id === "all" && group_type === 0)) {
      this.props.actions.getItemListBySearchAdvanced({ page: 1, limit: LIMIT_ITEM_FOOD_MANAGEMENT });
    }
    else if ((name_search === null || name_search === "") && (group_type === null || group_type === 0)) {
      this.props.actions.getItemListBySearchAdvanced({ category_id, page: 1, limit: LIMIT_ITEM_FOOD_MANAGEMENT });
    } else if ((category_id === null || category_id === "all") && (group_type === null || group_type === 0)) {
      this.props.actions.getItemListBySearchAdvanced({ name_search, page: 1, limit: LIMIT_ITEM_FOOD_MANAGEMENT });
    } else if ((name_search === null || name_search === "") && (category_id === null || category_id === "all")) {
      this.props.actions.getItemListBySearchAdvanced({ group_type, page: 1, limit: LIMIT_ITEM_FOOD_MANAGEMENT });
    } else if (category_id === null || category_id === "all") {
      this.props.actions.getItemListBySearchAdvanced({ name_search, group_type, page: 1, limit: LIMIT_ITEM_FOOD_MANAGEMENT });

    } else if (group_type === null || group_type === 0) {
      this.props.actions.getItemListBySearchAdvanced({ name_search, category_id, page: 1, limit: LIMIT_ITEM_FOOD_MANAGEMENT });

    } else if (name_search === null || name_search === "") {
      this.props.actions.getItemListBySearchAdvanced({ category_id, group_type, page: 1, limit: LIMIT_ITEM_FOOD_MANAGEMENT });

    } else if ((name_search !== "" && category_id !== "all" && group_type !== 0) || (name_search !== null && category_id !== null && group_type !== null) || (name_search !== "" && category_id !== null && group_type !== null) || (name_search !== null && category_id !== null && group_type !== 0) || (name_search !== null && category_id !== "all" && group_type !== null) || (name_search !== "" && category_id !== "all" && group_type !== null) || (name_search !== "" && category_id !== null && group_type !== 0) || (name_search !== null && category_id !== "all" && group_type !== 0)) {
      this.props.actions.getItemListBySearchAdvanced({ name_search, category_id, group_type, page: 1, limit: LIMIT_ITEM_FOOD_MANAGEMENT });
    }
    else {
      return "";
    }

    this.setState({ checkSearch: true, checkOnchange: false, page: 1 });
  }

  render() {
    const {
      showPopupAddDish,
      selected,
      infoFood,
      page,
      itemList,
      totalBySearch
    } = this.state;
    const { ...rest } = this.props;
    const { t, categoryItem } = this.props;
    var temp = {};
    var listCategory = [{
      key: "all",
      text: t("dishManagament.all")
    }];

    for (var i = 0; i < categoryItem.length; i++) {
      temp = {
        key: categoryItem[i].id,
        text: categoryItem[i].name
      }
      listCategory.push(temp);
    }

    return (
      <>
        <div className="item-managament">
          <Loading show={this.props.isLoading} />
          <div className="content-manage-item">
            <div className="popup-box inner-box">
              <div className="btnback-title e-flex content-center item-center">
                <div className="btn-back">
                  <Button className="s3"
                    onClick={() => { this.props.history.push("/menu") }}>
                    <FontAwesomeIcon icon={faLongArrowAltLeft} />
                    <span className="e-m-left-5">{t("textCommon.back")}</span>
                  </Button>
                </div>
                <h3 className="main-lbl text-center">
                  {t("dishManagament.title")}
                </h3>
              </div>
              <div className="fieldsearch-btnsearch flex-view middle">
                <Input
                  className="input-search-name"
                  placeholder={t("dishManagament.searchfood")}
                  onChange={e => {
                    this.setState({ searchNameItem: e.target.value, checkSearch: true, checkOnchange: false });
                  }}
                />
                <SelectBox
                  className="search-catogory"
                  onChange={e => this.setState({
                    searchCategoryItem: e,
                    checkSearch: true,
                    checkOnchange: false
                  })}
                  value={this.state.searchCategoryItem}
                  dataSource={listCategory}
                  blank={t("dishManagament.searchByCategory")}
                >
                  <div className="icon-angle-dow">
                    <FontAwesomeIcon
                      icon={faAngleDown}
                    /></div>
                </SelectBox>
                {(this.state.searchCategoryItem === null
                  && this.state.searchNameItem === null
                  && this.state.selected === null)
                  ? <div className="btn-search-item e-flex content-start item-end">
                    <Button
                      onClick={() => { }} disable={true}>
                      {t("dishManagament.search")}{" "}
                      <FontAwesomeIcon
                        icon={faSearch}
                      />
                    </Button>
                  </div>
                  : <div className="btn-search-item e-flex content-start item-end">
                    <Button
                      onClick={() => {
                        this.setState({ page: 0 });
                        this.onSearch(this.state.searchNameItem,
                          this.state.searchCategoryItem,
                          this.state.selected)
                      }}>
                      {t("dishManagament.search")}{" "}
                      <FontAwesomeIcon
                        icon={faSearch}
                      />
                    </Button>
                  </div>
                }
                {totalBySearch > 0 ?
                  <div className="total-food">
                    <span>{t("dishManagament.totalFood")}: <span className="value-total-food">
                      {totalBySearch}</span>
                    </span>
                  </div> : ""}
              </div>
              <Option
                onShowPopupOption={() =>
                  this.setState({
                    showPopupOption: true
                  })
                }
                search={this.searchingKindId}
                {...rest}
              />
              <div className="tbl-dishes-list">
                <DistList
                  listFood={itemList}
                  onDelete={this.onDelete}
                  onEdit={this.onEdit}
                  listSet={itemList}
                  selected={selected}
                  infoFood={infoFood}
                  loadMore={this.loadMore}
                  {...rest}
                />
              </div>
              <aside className="bottom-actions flex-view middle e-m-top-10" style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={() =>
                    this.setState({ showPopupAddDish: true })
                  }
                >
                  {t("dishManagament.moreDish")}
                </Button>
              </aside>
            </div>
          </div>

        </div>
        <Dialog
          show={showPopupAddDish}
          close={() => this.setState({ showPopupAddDish: false })}
          innerClass="popup-add-food-managament"
        >
          <PopupAddDish
            hide={() => this.setState({ showPopupAddDish: false })}
            {...rest}
          />
        </Dialog>
      </>
    );
  }
}
