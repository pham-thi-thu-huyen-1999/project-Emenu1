import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTimesCircle,
  faSyncAlt
} from "@fortawesome/free-solid-svg-icons";
import PopupEditAddon from "./PopupEditAddon";
import PopupDetailAddon from "./PopupDetailAddon";
import TableData from '../../../components/common/TableData';
import { Button, Dialog } from '../../../components/common';
import Swal from "../../../utils/sweetalert2";
import formats from "../../../utils/formats";
import * as CONSTS from "./../constants";

export default class AddonList extends Component {
  state = {
    showPopupEditAddon: false,
    showPopupDetailAddon: false,
    selectedAddon: null,
  };

  showPopupDetailAddon = selectedAddon => {
    this.setState({
      showPopupDetailAddon: !this.state.showPopupDetailAddon,
      selectedAddon: selectedAddon
    });
  };

  showPopupEditAddon = (selectedAddon) => {
    this.setState({
      showPopupEditAddon: !this.state.showPopupEditAddon,
      selectedAddon: selectedAddon
    });
  };

  deleteAddon = (addonId) => {
    const { nameSearch } = this.props;
    let dataGetAddons = {
      page: CONSTS.PAGE,
      limit: CONSTS.LIMIT,
      name_search: nameSearch
    }
    this.props.actions.deleteAddon({
      addon_item_id: addonId,
      dataGetAddons,
      callback_success: this.showOk,
      callback_fail: this.showErr
    });
  };

  showAlert = (addonId) => {
    const { t } = this.props;
    Swal.fire({
      title: t("addonManagement.swalTitleDelete"),
      text: t("addonManagement.swalMessageDelete"),
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: t("addonManagement.swalAgree"),
      cancelButtonText: t("addonManagement.swalCancel"),
    }).then((result) => {
      if (result.value) {
        this.deleteAddon(addonId);
      }
    })
  }

  showOk = () => {
    const t = this.props.t
    Swal.fire({
      icon: 'success',
      title: t("addonManagement.swalTitleDelete"),
      text: t("addonManagement.swalMessageDeleteSuccess")
    })
  }

  showErr = () => {
    const t = this.props.t
    Swal.fire({
      icon: 'error',
      title: t("addonManagement.swalTitleDelete"),
      text: t("addonManagement.swalMessageDeleteFail")
    })
  }

  render() {
    const { addonList, t, infoVatSetting} = this.props;
    const { ...rest } = this.props;

    const TABLE_SETTING = {
      heads: [
        {
          width: "5%",
          text: t("addonManagement.no"),
        },
        {
          width: "20%",
          text: t("addonManagement.name"),
        },
        {
          width: "15%",
          text: t("addonManagement.price"),
        },
        {
          width: "20%",
          text: t("addonManagement.description"),
        },
        {
          width: "10%",
          text: t("addonManagement.tax"),
        },
        {
          width: "10%",
          text: t("addonManagement.position"),
        },
        {
          width: "20%",
          text: t("addonManagement.status"),
        },
      ],
      columns: [
        {
          key: "id",
          width: "5%",
          render: (item, index) => {
            return index + 1;
          },
        },
        {
          key: "name",
          width: "20%",
        },
        {
          key: "price",
          width: "15%",
          render: (item, index) => {
            return <span key={index}>{formats.moneyFormat(item.price)} <span className="unit-price">đ</span></span>
          }
        },
        {
          key: "descr",
          width: "20%",
          render: (addonItem) => {
            return addonItem.descr;
          },
        },
        {
          key: "is_vat",
          width: "10%",
          render: (addonItem, index) => {
            return <div key={index}>
              {infoVatSetting.is_vat ?
                addonItem.is_vat ? `${infoVatSetting.vat}%`
                  : t("addonManagement.no_")
                : t("addonManagement.no_")}
            </div>
          },
        },
        {
          key: "position",
          width: "10%",
        },
        {
          key: "status",
          width: "20%",
          render: (addonItem, index) => {
            return <div className="status" key={index}>{addonItem.status ? t("addonManagement.statusOn") : t("addonManagement.statusOff")}</div>
          },
        },
        {
          key: "acts",
          className: "",
          actions: [(addonItem, index) => (
            <>
              <Button /* className="s-btn" */
                className="height-btn-table e-m-right-5"
                onClick={() => this.showPopupDetailAddon(
                  addonItem
                )}
              >
                <FontAwesomeIcon icon={faSyncAlt} />{" "}
                {t("addonManagement.detail")}
              </Button>
              <Button
                className="height-btn-table e-m-right-5"
                type="s1"
                onClick={() => this.showPopupEditAddon(
                  addonItem)
                }
              >
                <FontAwesomeIcon icon={faPencilAlt} />{" "}
                {t("addonManagement.edit")}
              </Button>
              <Button
                className="height-btn-table e-m-right-5"
                type="s2"
                onClick={() => this.showAlert(
                  addonItem.id,
                )}
              >
                <FontAwesomeIcon icon={faTimesCircle} />{" "}
                {t("addonManagement.delete")}
              </Button>
            </>
          )],
        },
      ],
    };

   
    const {
      selectedAddon,
      showPopupEditAddon,
      showPopupDetailAddon
    } = this.state;

    return (
      <>
        <TableData
          option={TABLE_SETTING}
          dataSources={addonList}
          statusSlickIndex={true}
          className="table-addon-management"
          onMore={this.props.loadMore}
          textNotiNoData={t("promotions.textNotiNoData")}
        >
        </TableData>
        <Dialog
          show={showPopupEditAddon}
          close={() => this.setState({ showPopupEditAddon: false })}
          innerClass="popup-create-addon-managament"
        >
          <PopupEditAddon
            selectedAddon={selectedAddon}
            hide={this.showPopupEditAddon}
            infoVatSetting={infoVatSetting}
            {...rest}
          />
        </Dialog>
        <Dialog
          show={showPopupDetailAddon}
          close={() => this.setState({ showPopupDetailAddon: false })}
          innerClass="popup-detail-item"
          title={`${t("addonManagement.titleDetail")}`}
        >
          <PopupDetailAddon
            selectedAddon={selectedAddon}
            hide={this.showPopupDetailAddon}
            {...rest}
          />
        </Dialog>
      </>
    );
  }
}
