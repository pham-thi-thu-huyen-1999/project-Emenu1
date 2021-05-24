import React from "react";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ImageLoading } from "../../../../../components/common";
import { imgCombo } from "../../../../../consts/settings/dish/dish";
import formats from '../../../../../utils/formats';
import image_price from '../img/price_frame_hot.png';
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { withNamespaces } from "react-i18next";
import * as actions from "../../../actions";
import { TableListReducerName } from "../../../reducers";
import "./../../../scss/orderStyleSheet.scss";
import Swal from "../../../../../utils/sweetalert2";
import { updateOrderComboItem } from "../../../../../api/order";
import { get } from "../../../../../services/localStorage";
import SignUpCombo from "./SignUpCombo.js";
class DishItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showEditFood: false,
      showEditDish: false,
      showPopupSignUpCombo: false,
      qtyCombo: 0
    }
  }

  showMoreFood = (dishItem) => {
    this.props.showPopupMoreFood(dishItem);
  }

  showConfirm = (dishItem) => {
    this.props.showConfirmCombo(dishItem);
  }

  loadDataAgain = async() => {
    const { dishItemFull, orderItemById } = this.props;
    const { qtyCombo } = this.state;
    const data = {
      qty: qtyCombo,
      note: "",
      combo_item_id: dishItemFull.id
    };
    //load lai data order
    await updateOrderComboItem({ order_id: orderItemById.id, order_combo_item_id: orderItemById.order_combo_items[0].id, data });
    await this.props.tableActions.getOrderItemById({ id: get("check-table") === true ? this.props.orderId : (get("order-id") ? get("order-id") : this.props.orderId) });
    await this.props.tableActions.getComboItemListOnly();
    await this.props.setComboItemAll(this.props.comboItemAll, this.props.orderItemById);
  }

  showAfterCombo = () => {
    const { dishItemFull, orderItemById, t } = this.props;
    Swal.fire({
      icon: 'info',
      text: t("takeaway.changeCombo"),
      title: t("takeaway.noti"),
      showCancelButton: true,
      confirmButtonText: t("takeaway.yes"),
      cancelButtonText: t("takeaway.cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          this.setState({
            showPopupSignUpCombo: true
          })
          this.setState({
            errors: {},
          });
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: t("takeaway.noti"),
            text: t("dishManagament.swalUpdateFail") + " " + error,
          });
        }
      }
    });
  }

  _renderPrice = (comboItem, promotions) => {
    const { lng, partnerSetting } = this.props;
    let unit_price = "";
    if (partnerSetting) {
      if (lng === "vi") {
        unit_price = partnerSetting.currency.name_vn;
      } else if (lng === "en") {
        unit_price = partnerSetting.currency.name_en;
      } else {
        unit_price = partnerSetting.currency.name_jp;
      }
    }
    if (promotions.length > 0) {
      const promotion = promotions.find(promotion => promotion.id === comboItem.id)
      if (promotion) {
        return (
          <div className="detail-right-price e-flex item-center">
            <div className="price-food">
              <div className="price-frame-hot" style={{ backgroundImage: `url("${image_price}")`}}>
                <span className="price-old">{formats.moneyFormat(promotion && promotion.sale_price ? promotion.sale_price : 200000)}{unit_price}</span>
                <span className="price-new">{formats.moneyFormat(promotion && promotion.sale_price_discount ? promotion.sale_price_discount : 100000)}{unit_price}</span>
              </div>
            </div>
          </div>
        )
      }
      else {
        return <div className="detail-right-price e-flex item-center">
          <div className="price-food">
            <div className="price-frame-hot" style={{ backgroundImage: `url("${image_price}")` }}>
              <span className="price">{formats.moneyFormat(comboItem.price)}{unit_price}</span>
            </div>
          </div>
        </div>
      }
    }
    else {
      return <div className="detail-right-price e-flex item-center">
        <div className="price-food">
          <div className="price-frame-hot" style={{ backgroundImage: `url("${image_price}")` }}>
            <span className="price">{formats.moneyFormat(comboItem.price)}{unit_price}</span>
          </div>
        </div>
      </div>
    }
  }
  onSaveAmountCombo = (qty) => {
    this.setState({
      qtyCombo: qty
    })
  }


  render() {
    const { lng, dishItemFull, moveToFoodList, showConfirmCombo, lockUp, t, comboPromotion, quantity_combo, is_quantity_combo } = this.props;
    let dem = 0;

    return (
      <li
        className={`food-item flex e-flex-column e-flex height-300`} /* ${lockUp ? "lock-up" : ""} */
      >
        <div className="e-row flex detail-combo">
          <div className="item e-col-6">
            <h4>{t("dishManagaments.include")} {dishItemFull && dishItemFull.items ? dishItemFull.items.length : 0} {t("dishManagaments.food")}: </h4>
            <ul>
              {
                dishItemFull.items.map((food, index) => {
                  dem++; // dem so luong food in items
                  if (dem <= 6) {
                    return (
                      <li key={index}>{food.name}</li>
                    )
                  } else {
                    return;
                  }

                })
              }
            </ul>
            {
              (dishItemFull && dishItemFull.items ? dishItemFull.items.length : 0) > 7 ? (
                <div className="btn-see-more">
                  <Button
                    onClick={() => this.showMoreFood(this.props.dishItemFull)}>
                    <span className="e-m-right-5">
                      <FontAwesomeIcon icon={faChevronDown} />
                    </span>
                    <span>{t("dishManagaments.seeMore")}</span>
                  </Button>
                </div>
              ) : ""
            }
          </div>
          <div className="e-col-6 flex detail-right e-flex item-center content-center">
            {dishItemFull.image ?
                <>
                  <ImageLoading innerClass="img-food" src={dishItemFull.image} />
                  {
                    (dishItemFull.price > 0 && dishItemFull.is_price === true) ? this._renderPrice(dishItemFull, comboPromotion) : null
                  }
                </>
              :
              <>
                <ImageLoading src={imgCombo} />
                {
                  (dishItemFull.price > 0 && dishItemFull.is_price === true) ? this._renderPrice(dishItemFull, comboPromotion) : null
                }
              </>
            }
          </div>
          <div className="quantity-combo">
            {is_quantity_combo ? quantity_combo : null}
          </div>
        </div>
        <div className="status-food">
          {this.props.nameCombo}
        </div>
        <div
          onClick={lockUp ? () => {this.showAfterCombo()} : (dishItemFull.is_price === false ? moveToFoodList : () => { this.showConfirm(dishItemFull) })}
          className="onclick-combo"
        >
        </div>
        {this.state.showPopupSignUpCombo && <SignUpCombo
            show={this.state.showPopupSignUpCombo}
            close={() => this.setState({ showPopupSignUpCombo: false })}
            t={t}
            isCheckSignUpCombo={true}
            onSaveAmountCombo={this.onSaveAmountCombo}
            loadDataAgain={this.loadDataAgain}
            quantityCombo={quantity_combo}
          />}
      </li>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state[TableListReducerName],
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    tableActions: bindActionCreators({ ...actions }, dispatch),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(withNamespaces()(DishItem));