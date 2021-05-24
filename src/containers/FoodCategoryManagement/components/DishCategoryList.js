import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTimesCircle,
  faSyncAlt
} from "@fortawesome/free-solid-svg-icons";
import PopupEditDishCategory from "./PopupEditDishCategory";
import PopupDetailDishCategory from "./PopupDetailDishCategory";
import "./dishcategory.scss";
import Button from '../../../components/common/Button';
import TableData from "../../../components/common/TableData";
import Swal from "./../../../utils/sweetalert2";
export default class DishCategoryList extends Component {
  state = {
    showPopupEditDishCategory: false,
    showPopupDetailDishCategory: false,
    dishCategoryChoice: null,
  };

  showPopupDetailDishCategory = name => {
    this.setState({
      showPopupDetailDishCategory: !this.state.showPopupDetailDishCategory,
      dishCategoryChoice: name
    });
  };
  showPopupEditDishCategory = (name, index) => {
    this.setState({
      showPopupEditDishCategory: !this.state.showPopupEditDishCategory,
      dishCategoryChoice: { index, dishCategory: name }
    });
  };
  onClickDelete = (name, index) => {
    this.props.actions.deleteCategoryItem({
      category_id: index,
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
    const {
      dishCategoryChoice,
      showPopupEditDishCategory,
      showPopupDetailDishCategory,
    } = this.state;
    const { listCategoryItem, t } = this.props;
    const { ...rest } = this.props;
    const TABLE_SETTING = {
      heads: [
        {
          width: "10%",
          text: t("categoryDish.no"),
        },
        {
          width: "30%",
          text: t("categoryDish.categoryName"),
        },
        {
          width: "60%",
          text: t("categoryDish.description"),
        },
      ],
      columns: [
        {
          key: "id",
          width: "10%",
          render: (item, index) => {
            return index + 1;
          },
        },
        {
          key: "name",
          width: "30%",
        },
        {
          key: "description",
          width: "60%",
        },
        {
          key: "acts",
          width: "",
          actions: [(item, index) => (
            <>
              <Button
                className="height-btn-table e-m-right-5"
                onClick={(e) => this.showPopupDetailDishCategory(item)}
              >
                <FontAwesomeIcon icon={faSyncAlt} className="e-m-right-5"/>{t("categoryDish.detail")}
              </Button>
              <Button
                className="height-btn-table e-m-right-5"
                type="s1"
                onClick={(e) => this.showPopupEditDishCategory(item, item.index)}
              >
                <FontAwesomeIcon icon={faPencilAlt} /> {t("categoryDish.edit")}
              </Button>
              <Button
                className="height-btn-table e-m-right-5"
                type="s2"
                onClick={(e) => this.showAlert(item, item.id)}
              >
                <FontAwesomeIcon icon={faTimesCircle} /> {t("categoryDish.delete")}
              </Button>
            </>
          )],
        },
      ],
    };
    return (
      <aside
        className="set-scrolling-tbl grey70"
        style={{ height: 'calc(100% - 137px)' }}
      >
        <TableData
          option={TABLE_SETTING}
          dataSources={listCategoryItem}
          className="dishcategory"
          textNotiNoData={t("bookingTables.notiNodata")}
        ></TableData>
        {showPopupEditDishCategory ? (
          <PopupEditDishCategory
            dishCategoryInfo={dishCategoryChoice}
            show={this.state.showPopupEditDishCategory}
            hide={this.showPopupEditDishCategory}
            {...rest}
          />
        ) : null}
        {showPopupDetailDishCategory ? (
          <PopupDetailDishCategory
            dishCategoryInfo={dishCategoryChoice}
            show={this.state.showPopupDetailDishCategory}
            hide={this.showPopupDetailDishCategory}
            {...rest}
          />
        ) : null}
      </aside>
    );
  }
}
