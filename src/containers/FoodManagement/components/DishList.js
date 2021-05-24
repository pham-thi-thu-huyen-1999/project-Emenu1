import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTimesCircle,
  faSyncAlt
} from "@fortawesome/free-solid-svg-icons";
import PopupEditDish from "./PopupEditDish";
import PopupDetailDish from "./PopupDetailDish";
import TableData from '../../../components/common/TableData';
import "./popupAddDish.scss"
import { Button, Dialog } from '../../../components/common';
import Swal from "./../../../utils/sweetalert2";
import formats from "./../../../utils/formats";

export default class DishList extends Component {
  state = {
    showPopupEditDish: false,
    showPopupDetailDish: false,
    dishChoice: null,
  };

  showPopupDetailDish = name => {
    this.setState({
      showPopupDetailDish: !this.state.showPopupDetailDish,
      dishChoice: name
    });
  };
  showPopupEditDish = (name, index) => {
    this.setState({
      showPopupEditDish: !this.state.showPopupEditDish,
      dishChoice: { index, dishInfo: name }
    });
  };

  onClickDelete = (name, index) => {
    this.props.actions.deleteItem({
      food_id: index,
      callback_success: this.showOk,
      callback_fail: this.showErr
    });
  };
  showAlert = (name, index) => {
    const { t } = this.props;
    Swal.fire({
      title: t("dishManagament.swalTitle"),
      text: t("dishManagament.swalDeleteDish"),
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: t("dishManagament.swalAgree"),
      cancelButtonText: t("dishManagament.swalCancel"),
    }).then((result) => {
      if (result.value) {
        this.onClickDelete(name, index);
      }
    })
  }

  showOk = () => {
    const t = this.props.t
    Swal.fire({
      icon: 'success',
      text: t("dishManagament.swalDeleteSuccess"),
      title: t("dishManagament.swalTitle")
    })
  }

  showErr = () => {
    const t = this.props.t
    Swal.fire({
      icon: 'error',
      title: t("dishManagament.swalTitle"),
      text: t("dishManagament.swalDeleteFail")
    })
  }

  render() {
    const { listFood, onDelete, listSet,
      onEdit, t, infoVatSetting, lng, partnerSetting } = this.props;
    const { ...rest } = this.props;

    const TABLE_SETTING = {
      heads: [
        {
          width: "5%",
          text: t("dishManagament.no"),
        },
        {
          width: "26%",
          text: t("dishManagament.dishName"),
        },
        {
          width: "15%",
          text: t("dishManagament.code"),
        },
        {
          width: "15%",
          text: t("dishManagament.price"),
        },
        {
          width: "15%",
          text: t("dishManagament.unit"),
        },
        {
          width: "12%",
          text: t("dishManagament.tax"),
        },
        {
          width: "12%",
          text: t("dishManagament.status"),
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
          width: "26%",
        },
        {
          key: "sku",
          width: "15%",
        },
        {
          key: "sale_price",
          width: "15%",
          render: (item) => {
            return <span>{formats.moneyFormat(item.sale_price)}
              <span className="unit-price">
                {partnerSetting && partnerSetting.currency ? lng === "vi" ? partnerSetting.currency.name_vn :
                  lng === "en" ? partnerSetting.currency.name_en :
                    partnerSetting.currency.name_jp : "đ"}
              </span>
            </span>
          }
        },
        {
          key: "unit_item.name",
          width: "15%",
          render: (foodItem, index) => {
            return foodItem.unit_item.name;
          },
        },
        {
          key: "is_vat",
          width: "12%",
          render: (foodItem, index) => {
            return <div key={index}>
              {infoVatSetting.is_vat ?
                foodItem.is_vat ? `${infoVatSetting.vat}%`
                  : t("dishManagament.no_")
                : t("dishManagament.no_")}
            </div>
          },
        },
        {
          key: "status",
          className: "12%",
          render: (foodItem, index) => {
            return <div className="status" key={index}>{foodItem.status ? t("dishManagament.still") : t("dishManagament.over")}</div>
          },
        },
        {
          key: "acts",
          className: "",
          actions: [(foodItem, index) => (
            <>
              <Button /* className="s-btn" */
                className="height-btn-table e-m-right-5"
                onClick={this.showPopupDetailDish.bind(
                  this,
                  foodItem
                )}
              >
                <FontAwesomeIcon icon={faSyncAlt} />{" "}
                {t("dishManagament.detail")}
              </Button>
              <Button
                className="height-btn-table e-m-right-5"
                type="s1"
                onClick={this.showPopupEditDish.bind(
                  this,
                  foodItem,
                  index
                )}
              >
                <FontAwesomeIcon icon={faPencilAlt} />{" "}
                {t("dishManagament.edit")}
              </Button>
              <Button
                className="height-btn-table e-m-right-5"
                type="s2"
                onClick={this.showAlert.bind(
                  this,
                  foodItem,
                  foodItem.id,
                )}
              >
                <FontAwesomeIcon icon={faTimesCircle} />{" "}
                {t("dishManagament.delete")}
              </Button>
            </>
          )],
        },
      ],
    };

    const settings = {
      infinite: false,
      slidesToShow: 4,
      slidesToScroll: 4,
      vertical: true,
      draggable: false,
      arrows: false,
      afterChange: current => this.setState({ indexSlide: current })
    };
    const {
      dishChoice,
      showPopupEditDish,
      showPopupDetailDish
    } = this.state;

    return (
      <>
        <TableData
          option={TABLE_SETTING}
          dataSources={listFood}
          statusSlickIndex={true}
          className="foodManagement"
          onMore={this.props.loadMore}
          textNotiNoData={t("promotions.textNotiNoData")}
        >
        </TableData>
        <Dialog
          show={showPopupEditDish}
          close={() => this.setState({ showPopupEditDish: false })}
          innerClass="popup-add-food-managament"
        >
          <PopupEditDish
            dishInfo={dishChoice}
            hide={this.showPopupEditDish}
            listSet={listSet}
            onEdit={onEdit}
            {...rest}
          />
        </Dialog>
        <Dialog
          show={showPopupDetailDish}
          close={() => this.setState({ showPopupDetailDish: false })}
          innerClass="popup-detail-item"
          title={`${t("dishManagament.popupDetail")}`}
        >
          <PopupDetailDish
            dishInfo={dishChoice}
            hide={this.showPopupDetailDish}
            {...rest}
          />
        </Dialog>
      </>
    );
  }
}
