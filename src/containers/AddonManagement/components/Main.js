import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import PopupCreateAddon from "./PopupCreateAddon";
import AddonList from "./AddonList";
import { Button, Input, Dialog } from "../../../components/common"
import Loading from "../../../components/common/Loading";
import * as CONSTS from "./../constants"

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopupCreateAddon: false,
      addonList: [],
      nameSearch: null,
      nameSearchTemp: "",
      page: 1,
      total: 0,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.addonList !== prevState.addonList || nextProps.page !== prevState.page) {
      return {
        addonList: nextProps.addonList,
        page: nextProps.page,
        total: nextProps.total
      }
    }
    return null;
  }

  loadMore = (data) => {
    let { nameSearch } = this.state;
    const name_search = nameSearch;
    const { page } = this.state;
    if (page <= this.props.limitPage) {
      const dataGetAddons = {
        page: page + 1,
        limit: CONSTS.LIMIT,
        name_search
      }
      this.props.actions.getAddonList({
       data: dataGetAddons
      })
    }
    this.setState({
      page: page + 1
    })
  }

  onSearch = async () => {
    await this.setState({
      nameSearch: this.state.nameSearchTemp
    })
    let { nameSearch } = this.state;
    let dataGetAddons = {
      page:  CONSTS.PAGE,
      limit: CONSTS.LIMIT,
      name_search: nameSearch
    }
    this.props.actions.getAddonList({
      data: dataGetAddons
    })
  }

  render() {
    const {
      showPopupCreateAddon,
      addonList,
      total,
      nameSearch
    } = this.state;
    const { ...rest } = this.props;
    const { t } = this.props;

    return (
      <>
        <div className="addon-managament">
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
                  {t("addonManagement.title")}
                </h3>
              </div>
              <div className="header__search flex-view middle">
                <Input
                  className="input-search-name"
                  placeholder={t("addonManagement.searchName")}
                  onChange={e => {
                    this.setState({
                      nameSearchTemp: e.target.value
                    });
                  }}
                />

                <div className="btn-search-item e-flex content-start item-end">
                  <Button
                    onClick={() => {
                      this.onSearch();
                    }} disable={true}>
                    {t("addonManagement.search")}{" "}
                    <FontAwesomeIcon
                      icon={faSearch}
                    />
                  </Button>
                </div>

                {total > 0 ?
                  <div className="total-addon">
                    <span>{t("addonManagement.totalAddon")}: <span className="value-total-food">
                      {total}</span>
                    </span>
                  </div> : ""}
              </div>
              <div className="tbl-addon-list">
                <AddonList
                  addonList={addonList}
                  loadMore={this.loadMore}
                  nameSearch={nameSearch}
                  {...rest}
                />
              </div>
              <aside className="bottom-actions flex-view middle e-m-top-30" style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={() =>
                    this.setState({ showPopupCreateAddon: true })
                  }
                >
                  {t("addonManagement.moreAddon")}
                </Button>
              </aside>
            </div>
          </div>

        </div>
        <Dialog
          show={showPopupCreateAddon}
          close={() => this.setState({ showPopupCreateAddon: false })}
          innerClass="popup-create-addon-managament"
        >
          <PopupCreateAddon
            nameSearch={nameSearch}
            hide={() => this.setState({ showPopupCreateAddon: false })}
            {...rest}
          />
        </Dialog>
      </>
    );
  }
}
