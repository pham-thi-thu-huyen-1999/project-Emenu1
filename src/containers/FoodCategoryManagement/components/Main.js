import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlusCircle, faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import PopupAddDishCategory from "./PopoupAddDishCategory";
import DishCategoryList from "./DishCategoryList";
import { Input, Button } from "../../../components/common";
import Loading from "../../../components/common/Loading";
import "./dishcategory.scss";
export default class Main extends Component {
  state = {
    showPopupAddDish: false,
    showPopupOption: false,
    searching: "",
    isSearhing: false,
    filter: [], // categoryItemList after sort
    categoryItemList: [],
  };
  onSearch = () => {
    const searching = this.state.searching;
    if (searching === '' || searching === null) {
      const filter = this.props.categoryItemList;
      this.setState({
        filter,
        isSearhing: true,
      });
    } else {
      const filter = this.props.categoryItemList.filter(category => category.name.toLowerCase().includes(searching.toLowerCase()));
      this.setState({
        filter,
        isSearhing: true,
      });
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      JSON.stringify(nextProps.categoryItemList) !==
      JSON.stringify(prevState.categoryItemList)
    ) {
      if (prevState.isSearhing) {
        const searching = prevState.searching;
        let filter = [];
        if (searching === "" || searching === null) {
          filter = nextProps.categoryItemList;
        } else {
          filter = nextProps.categoryItemList.filter((category) =>
            category.name.toLowerCase().includes(searching.toLowerCase())
          );
        }
        return {
          categoryItemList: nextProps.categoryItemList,
          filter,
          isSearching: true,
        }
      }
    }
    return null;
  }

  render() {
    const {
      showPopupAddDish,
      filter,
      isSearhing,
    } = this.state;
    const { ...rest } = this.props;
    const { t } = this.props;
    const categoryItemList = isSearhing ? filter : this.props.categoryItemList;
    return (
      <main id="site-main" style={{ height: "100%", marginTop: "10px", display: "flex", flexDirection: "column" }}>
        <div id="primary" className="no-footer p-management clear" style={{ paddingBottom: "20px" }}>
          <section id="main-cont" className="full clear" style={{ height: "100%" }}>
            <Loading show={this.props.isLoading} />
            <aside id="manage-dishes-list" style={{ height: "calc(100vh - 100px)" }}>
              <div className="popup-box inner-box" style={{ height: "calc(100vh - 95px)" }}>
                <div className="btnback-title e-flex content-center item-center">
                  <div className="btn-back">
                    <Button className="s3"
                      onClick={() => { this.props.history.push("/menu") }}>
                      <FontAwesomeIcon icon={faLongArrowAltLeft} />
                      <span className="e-m-left-5">{t("textCommon.back")}</span>
                    </Button>
                  </div>
                  <h3 className="main-lbl text-center">
                    {t("categoryDish.title")}
                  </h3>
                </div>
                <aside className="top-acts flex-view middle" style={{ marginBottom: 20 }}>
                  <div className="flex-view input-btn-search">
                    <Input
                      placeholder={t("dishManagament.searchfood")}
                      onChange={e => {
                        this.setState({ searching: e.target.value });
                      }}
                    />
                    <Button onClick={this.onSearch} >
                      {t("dishManagament.search")}{" "}
                      <FontAwesomeIcon
                        icon={faSearch}
                        style={{
                          fontSize: 20,
                          verticalAlign: "middle",
                        }}
                      />
                    </Button>
                  </div>
                  <div className="flex-view" style={{ marginTop: 5 }}>
                    <Button
                      onClick={() =>
                        this.setState({ showPopupAddDish: true })
                      }>
                      <FontAwesomeIcon
                        icon={faPlusCircle}
                        style={{
                          fontSize: 20,
                          verticalAlign: "middle"
                        }}
                      />&nbsp;&nbsp;&nbsp;
                        {t("categoryDish.moreCategoryDish")}{" "}

                    </Button>
                  </div>
                </aside>
                <div style={{ height: "100%" }}>
                  <DishCategoryList
                    listCategoryItem={categoryItemList}
                    listSet={categoryItemList}
                    {...rest}
                  />
                  {/* <aside className="bottom-actions flex-view middle">
                    <div className="alert"></div>
                    <div className="grp-btns acts flex-view middle">
                      <div className="act back-btn">
                        <img src="/images/back-btn.png" alt="" />
                      </div>
                    </div>
                  </aside> */}
                </div>
              </div>
            </aside>
          </section>
        </div>
        {showPopupAddDish ? (
          <PopupAddDishCategory
            hide={() => this.setState({ showPopupAddDish: false })}
            show={this.state.showPopupAddDish}
            onAddDishOk={food => {
              this.onAddDishOk(food);
            }}
            listSet={categoryItemList}
            {...rest}
          />
        ) : null}
      </main>
    );
  }
}
