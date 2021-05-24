import React, { Component } from "react";

//import "../../../../TakeAwayScreen/components/Category.scss"
import "./../../../scss/CategoryItem.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTimesCircle, faCheck } from "@fortawesome/free-solid-svg-icons";
import noImage from '../img/image-notfound.jpg';
import PopupQuantity from "./PopupQuantity";
import { Dialog, CleaveInput, Button } from "../../../../../components/common";
export default class CategoryItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClick: false,
      idClick: "",
      showQuantity: false,
      valuePrice: 0,
      valueNumberOld: 0,
      itemPromotion: [],
      showPopupPriceWithQty: false,
      valueNumber: 0,
      valueNumberTemp: 0,
      showErr: false
    };
  }

  onCancelOrder = () => {
    const data = { order_id: this.props.billInfo.id, reason: "" };
    this.props.actions.deleteOrder({ data });
  };

  componentDidUpdate() {
    const { isHasPrice } = this.props;
    //isHasPrice : true khi chon vao suat co gia
    //chay lai choose nhung khong chay vao TH return
    if (this.state.valueNumberOld !== this.state.valueNumber && isHasPrice) {
      this.choose();
      this.setState({ valueNumberOld: this.state.valueNumber, showQuantity: false })
    } else if ((this.state.valueNumberOld !== this.state.valueNumber) && !isHasPrice) {
      this.choose();
      this.setState({ valueNumberOld: this.state.valueNumber, showPopupPriceWithQty: false })
    }
  }

  choose = () => {
    const { item, selectedDishes, isHasPrice } = this.props;
    const { valueNumber, valueNumberOld, valuePrice } = this.state;
    /* let str = item.unit_item.name.replace(/ +/g, ""); */
    let qty = 0;
    qty = valueNumber !== 0 ? valueNumber : null;
    if (valueNumber === valueNumberOld && item.unit_item.qty_type === 1 && item.is_open_price === true && !isHasPrice) {
      this.setState({ showPopupPriceWithQty: true });
      return;
    }
    // qty_type: 0 la chi nhap so luong chan , 1 co the nhap so le
    if (valueNumber === valueNumberOld && item.unit_item.qty_type === 1) {
      this.setState({ showQuantity: true });
      return;
    }

    if (item.unit_item.qty_type === 0) {
      if (selectedDishes.length === 0) {
        qty = 1;
      }
      else {
        selectedDishes.map((dish) =>
          dish.id === (item.item_id ? item.item_id : item.id) ? qty = dish.qty : null)
        qty += 1;
      }
    }

    if (!item.in_stock) return;

    console.log("value item", item, !isHasPrice && item.qty_type === 1 && item.is_open_price === true)
    if (!isHasPrice && item.unit_item.qty_type === 1 && item.is_open_price === true) {
      console.log("value price", valuePrice)
      this.props.choose({
        id: (item.item_id ? item.item_id : item.id),
        name: (item.name ? item.name : item.item_name),
        qty,
        price: valuePrice,
        total: qty * item.sale_price,
        unit_name: item.unit_item.name,
        unit_id: item.unit_id,
        qty_type: item.unit_item.qty_type,
        is_open_price: item.is_open_price
      }, true);
    } else {
      this.props.choose({
        id: (item.item_id ? item.item_id : item.id),
        name: (item.name ? item.name : item.item_name),
        qty,
        price: item.sale_price,
        total: qty * item.sale_price,
        unit_name: item.unit_item.name,
        unit_id: item.unit_id,
        qty_type: item.unit_item.qty_type,
        is_open_price: item.is_open_price
      }, true);
    }
  }

  reduce = () => {
    const { item, selectedDishes } = this.props;
    let qty = 0;
    if (selectedDishes.length === 0) {
      qty = 1;
    }
    else {
      selectedDishes.map((dish) =>
        dish.id === (item.item_id ? item.item_id : item.id) ? qty = dish.qty : null
      )
      if (qty > 0) {
        qty--
      }
    }
    if (qty > 0) {
      this.props.choose({
        id: (item.item_id ? item.item_id : item.id),
        name: item.item_name ? item.item_name : item.name,
        qty, price: item.sale_price,
        total: qty * item.sale_price,
        unit_name: item.item_unit_name,
        unit_id: item.item_unit_id,
        qty_type: item.unit_item.qty_type
      }, false);
    }

  }
  mapQty = (item_id) => {
    const { selectedDishes } = this.props;
    let isShow = false;
    selectedDishes.map((dish) => {
      if (item_id === dish.id) {
        isShow = true
      }
    })
    return isShow
  }

  onVisiblePopupQuantity = () => {
    this.setState({ showQuantity: false })
  }

  addNumber = value => {
    if (value > 0) {
      this.setState({ valueNumber: value })
    }
  }

  _renderPromotion = (item, promotions) => {
    const promotion = promotions.find(promotion => promotion.id === item.id)
    if (promotion) {
      return (
        <div className="discount-label-table-list red">
          <span className="discount">
            {promotion.discount_item_value}%
          </span>
        </div>
      )
    }
  }

  _renderPrice = (item, promotions) => {
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
      const promotion = promotions.find(promotion => promotion.id === item.id)
      if (promotion) {
        return (
          <div className="promotion-price">
            <div className="price-old">{promotion.sale_price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{unit_price}</div>
            <div className="price-text">{promotion.sale_price_discount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{unit_price}</div>
          </div>
        )
      } else {
        return <div className="price-text">{item.sale_price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{unit_price}</div>
      }
    } else {
      return <div className="price-text">{item.sale_price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{unit_price}</div>
    }
  }

  onClickOkPriceWithQty = () => {
    const { valueNumberTemp } = this.state;
    if (valueNumberTemp === "" || valueNumberTemp === 0) {
      this.setState({
        showErr: true
      })
    } else {
      this.setState({
        showErr: false,
        showPopupPriceWithQty: false
      })
      this.addNumber(valueNumberTemp);
    }
  }


  render() {
    const { item, selectedDishes, t, dataPromotion, isPrice, lng, partnerSetting } = this.props;
    const {
      showPopupPriceWithQty,
      valueNumber,
      valueNumberTemp,
      valuePrice,
      showErr } = this.state;
    const COLORS = {
      primary: '#2699FB',
      gray: '#C8C7C7',
      red: '#FF1010',
      yellow: '#F5E50A',
      green: '#10775E',
    };
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
    return (<>
      <div className="news-table-list">
        {isPrice === undefined || !isPrice && this._renderPromotion(item, dataPromotion)}
        <div className="span-count-choose-item-table-list e-m-top-40">
          {selectedDishes ?
            (selectedDishes.map((dish) =>
              dish.id === (item.item_id ? item.item_id : item.id) ? dish.qty : null))
            : null}
        </div>
        <div className="article-table-list">
          <div className="thumb-food">
            <img src={item.image ? item.image
              : (item.image_link ? item.image_link : noImage)} />
          </div>
          <div className="content-food">
            <div className="text-item-per-table-list">
              {item.name ? item.name : item.item_name}</div>

            {isPrice !== undefined && isPrice ?
              <div className="price-text">0{unit_price}</div> : this._renderPrice(item, dataPromotion)
            }
          </div>
        </div>
        <div
          onClick={this.choose}
          className="onclick-combo"
        >
        </div>
        {
          item.in_stock ? null : <div className="over-stock-item-table-list">
            <span>{t('orderFood.outOfStock')}</span>
          </div>
        }
      </div>
      <Dialog
        show={showPopupPriceWithQty}
        close={() => this.setState({ showPopupPriceWithQty: false })}
        title="NHẬP GIÁ VÀ SỐ LƯỢNG"
        innerClass="popup-price-with-qty"
      >
        <div className="content e-m-top-10">
          <div className="content-row">
            <span className="flex-30-price">Nhập giá</span>
            <div className="content-price">
              <CleaveInput setValue={value => this.setState({ valuePrice: value })} value={valuePrice ? valuePrice : "0"}
                options={{
                  numeral: true,
                }}
              />
              {' '}
              <span className="content-unit" style={{ color: COLORS.primary }}>
                /{unit_price}
              </span>
              {/* {(valuePrice === "") && <div className="show-err">Giá không được bỏ trống</div>} */}
            </div>
          </div>
          <div className="content-row">
            <span className="flex-30-qty">Nhập số lượng</span>
            <div className="content-qty">
              <CleaveInput setValue={value => this.setState({ valueNumberTemp: value })} value={valueNumberTemp ? valueNumberTemp : "0"}
                options={{
                  numeral: true,
                }}
              />
              {' '}
              <span className="content-unit" style={{ color: COLORS.primary }}>
                /{item.unit_item ? item.unit_item.name : item.unit_name ? item.unit_name : '(X)'}
              </span>
              {(showErr === true) && <div className="show-err">{t('orderFood.showErr')}</div>}
              {/* {(showErr === true) && <div className="show-err">{t('orderFood.showErr')}</div>} */}
            </div>
          </div>
          <aside className="acts text-right" style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
            <Button
              className="emenu-button s-btn"
              type="s3"
              onClick={() => { this.setState({ showPopupPriceWithQty: false }) }}
            >
              <FontAwesomeIcon icon={faTimesCircle} />{" "}
              {t("orderFood.cancel")}
            </Button>
            <Button
              onClick={() => { this.onClickOkPriceWithQty() }}
              className="e-m-left-10"
              disable={showErr === true ? true : false}
            >
              <FontAwesomeIcon icon={faCheck} />{" "}
              {t("foodProcessing.confirmButton")}
            </Button>
          </aside>
        </div>
      </Dialog>
      {this.state.showQuantity && <PopupQuantity isShow={this.state.showQuantity}
        t={t} item={item}
        onClose={() => this.onVisiblePopupQuantity()}
        number={this.state.valueNumber}
        addNumber={value => this.addNumber(value)}
      />}</>
    );
  }
}
