import React from "react";
import { faPencilAlt, faChevronDown, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../../components/common/Button";
import { imgCombo } from "../../../consts/settings/dish/dish";
import { LIMIT_ITEM } from "../../../consts/settings/dish/dish";
import formats from '../../../utils/formats';
import Swal from '../../../../src/utils/sweetalert2';

export default class DishItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showEditFood: false,
      showEditDish: false
    }
  }

  onEditDish = (dishItem) => {
    this.props.actions.getComboById({ combo_item_id: dishItem.id, data: dishItem })
    this.props.onEditDish(dishItem);
  }
  showMoreFood = (dishItem) => {
    this.props.actions.getItemComboList({ combo_item_id: dishItem.id, page: 1, limit: LIMIT_ITEM, total_item: dishItem.total_item })
    this.props.showPopupMoreFood(dishItem)
  }
  showSuccess = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'success',
      title: `${t("dishManagaments.deleteComboSuccess")}!`,
      showConfirmButton: true,
    })
  }
  showErr = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'error',
      title: `${t("dishManagaments.error")}!`,
      text: `${t("dishManagaments.requCheckAgain")}!`
    })
  }
  deleteCombo = item => {
    const { t, page } = this.props;
    Swal.fire({
      title: `${t("dishManagaments.sure")}`,
      text: `${t("dishManagaments.popupDelete")}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `${t("dishManagament.swalAgree")}`,
      cancelButtonText: `${t("dishManagaments.cancel")}`,
    }).then(async (result) => {
      if (result.value) {
        this.props.actions.deleteCombo({
          combo_item_id: item.id,
          page,
          callSuccess: this.showSuccess,
          callFail: this.showErr
        })
      }
    })
  }
  render() {
    const { dishItem, t, lng, partnerSetting } = this.props;
    return (
      <li className="food-item flex e-flex-column e-flex"
        style={
          dishItem.status === 1 ? { backgroundColor: "rgb(255, 255, 255)" } : { backgroundColor: "#e1dddd" }
        }
      >
        <div className="btn-delete-combo"
          onClick={() => this.deleteCombo(dishItem)}>
          <FontAwesomeIcon icon={faTimesCircle} />
        </div>
        <div className="title-dish">
          <h3 className="name-food e-m-0">{dishItem.name}</h3>
          <Button className="btn-edit" onClick={() => this.onEditDish(dishItem)}>
            <FontAwesomeIcon icon={faPencilAlt} />
          </Button>
        </div>
        <div className="e-row flex detail-combo">
          <div className="item e-col-6">
            <h4>{t("dishManagaments.include")} {dishItem.total_item < 0 ? 0 : this.props.dishItem.total_item} {t("dishManagaments.food")}: </h4>
            <ul>
              {
                dishItem.items.length > 0 ?
                  dishItem.items.slice(0, 4).map((food, index) => {
                    return (
                      <li key={index}>{food.name}</li>
                    )
                  }) : ''
              }
            </ul>
            {
              dishItem.items.length > 4 ? (
                <div className="btn-see-more">
                  <Button
                    onClick={() => this.showMoreFood(dishItem)}>
                    <span className="e-m-right-5">
                      <FontAwesomeIcon icon={faChevronDown} />
                    </span>
                    <span>{t("dishManagaments.seeMore")}</span>
                  </Button>
                </div>
              ) : ""
            }
          </div>
          <div className="e-col-6 flex detail-right e-flex item-end content-center">
            {dishItem.image ?
              <div className="image-food">
                <img src={dishItem.image} alt="" />
              </div> :
              <div className="image-food">
                <img src={imgCombo} alt="" />
              </div>
            }
            <div className="detail-right-price e-flex item-center">
              {
                dishItem.is_price ?
                  <div className="price-food">
                    <span className="price">{formats.moneyFormat(dishItem.price)}
                      {lng === "vi" ? partnerSetting.currency.name_vn :
                        lng === "en" ? partnerSetting.currency.name_en :
                          partnerSetting.currency.name_jp}</span>
                  </div> : ""
              }
            </div>
          </div>
        </div>
        {
          dishItem.status === 1 ? (
            <div style={{ "background": "rgb(241, 122, 57)" }} className="status-food">
              {t("dishManagaments.status")}:
              <span> {t("dishManagaments.isStatus")}</span>
            </div>
          ) : (
              <div style={{ "background": "#908d8d" }} className="status-food">
                {t("dishManagaments.status")}:
                <span> {t("dishManagaments.noStatus")}</span>
              </div>
            )
        }
      </li>
    )
  }
}