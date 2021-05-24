import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { withNamespaces } from "react-i18next";
import Slider from "react-slick";
import "./../../../scss/orderStyleSheet.scss";
import Loading from "../../../../../components/common/Loading";
import { withRouter } from "react-router-dom";
import * as actions from "../../../actions";
import { TableListReducerName } from "../../../reducers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog } from "../../../../../components/common";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import DishItem from "./DishItem";
import PopupMoreFood from "./PopupMoreFood";
import { get, remove, save } from "../../../../../services/localStorage";
import { faPlusCircle, faListAlt } from "@fortawesome/free-solid-svg-icons";
import SignUpCombo from "./SignUpCombo.js";
import _ from "lodash";
import './../../../scss/ComboList.scss';
import * as Promotion from './../../../../../api/promotion';
import { isMobile } from 'mobile-device-detect';
import { updateOrderComboItem } from "../../../../../api/order";
class ComboList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopupMoreFood: false,
      showPopupSignUpComboChoose: false,
      comboItemId: "",
      itemDishdetail: {},
      showPopupSignUpCombo: false,
      amountCombo: 0, //So luong suat dang ky cua combo
      orderItemById: this.props.orderItemById ? this.props.orderItemById : {},
      comboItemAll: this.props.comboItemAll ? this.props.comboItemAll : [],
      orderId: this.props.orderId ? this.props.orderId : "",
      comboPromotion: [],
      slickIndex: 0,
      /* qtyCombo: 0 */
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.orderItemById !== prevState.orderItemById
      || nextProps.comboItemAll !== prevState.comboItemAll
      || nextProps.orderId !== prevState.orderId
    ) {
      return {
        orderItemById: nextProps.orderItemById,
        comboItemAll: nextProps.comboItemAll,
        orderId: nextProps.orderId,
      };
    }
    return null;
  }

  componentDidMount = () => {
    this.props.tableActions.getPartnerSetting({ categoryName: "", comboName: "" });
    //get("check-sign-up-combo") kiem tra khi vao foodList roi ra comboList luc dang ky suat co gia ma chua goi mon
    if (get("check-sign-up-combo") === false && (!get("order-id") || get("order-id") === "" || get("order-id") === undefined) && !this.state.orderId) {
      //Chuyen ve trang chu khi bi mat du lieu, khong co orderId
      remove("check-table");
      remove("check-sign-up");
      remove("check-sign-up-combo");
      this.props.history.push("/");
    }
    if (get("check-table") !== true) {
      this.props.tableActions.getOrderItemById({ id: get("order-id") ? get("order-id") : this.state.orderId });
    }
  }

  moveToFoodList = (item, index) => {
    save("vi-tri-combo", item.id);//id cua combo ko co gia dang duoc chon
    this.props.history.push(`/order-food-list?combo-id=${item.id}&combo-name=${item.name}`);
  }

  setComboItemAll = (comboItemAll, orderItemById) => {
    this.setState({
      comboItemAll,
      orderItemById
    })
  }

  BackToHome = () => {
    remove("table-number");
    remove("table-id");
    remove("check-table"); //true chua vao ban
    remove("quantity-combo");
    remove("order-id");
    remove("is-list");
    remove("check-sign-up-combo");
    remove("ordered-no-price");
    this.props.tableActions.setOrderId();
    this.props.history.push("/");
  }

  showConfirmCombo = (dishItem) => {
    if (get("check-table") !== true && this.state.orderItemById && this.state.orderItemById.order_combo_items && this.state.orderItemById.order_combo_items.length > 0) {
      this.setState({
        showPopupSignUpComboChoose: true,
        comboItemId: dishItem.id,
        itemDishdetail: dishItem //dishItem choosed
      })
      save("ordered-no-price", true);
    } else {
      this.setState({
        showPopupSignUpCombo: true,
        comboItemId: dishItem.id,
        itemDishdetail: dishItem //dishItem choosed
      })
    }

  }

  onSaveAmountCombo = (amount) => {
    this.setState({
      amountCombo: amount
    })
    save("quantity-combo", amount); //so luong suat dang ky
  }

  /**
   * Func Danh Sach Chon Mon
   */
  OrderFood = async () => {
    save("is-price", true); //de hien thi duy nhat mot combo trong danh sach chon mon
    save("is-list", true); //phan biet vao khi an vao nut danh sach chon mon
    //Goi danh sach chon mon cho ban co order
    await this.props.tableActions.getComboItemList({ categoryName: "", comboName: "", comboDetail: this.state.itemDishdetail, check: true });
    await this.props.history.push(`/order-food-list?combo-id=${this.state.itemDishdetail.id}&combo-name=${this.state.itemDishdetail.name}&is-has-price=true`);
  }

  /** get promotion combo */
  getPromotionCombo = async () => {
    try {
      const resComboItem = await Promotion.getPromotionItem()
      if (resComboItem.data && resComboItem.data.data.length > 0) {
        this.setState({ comboPromotion: resComboItem.data.data })
      }
    } catch (err) {
      console.log(err)
    }
  }

  next = () => {
    this.slider.slickNext();
  };

  previous = () => {
    this.slider.slickPrev();
  };

  loadDataAgain = async () => {
    const { qtyCombo, orderItemById, itemDishdetail } = this.state;
    if (orderItemById)
    {
      const data = {
        qty: qtyCombo,
        note: "",
        combo_item_id: itemDishdetail.id
      };
      //load lai data order
      await updateOrderComboItem({ order_id: orderItemById.id, order_combo_item_id: orderItemById.order_combo_items[0].id, data });
      await this.props.tableActions.getOrderItemById({ id: get("check-table") === true ? this.state.orderId : (get("order-id") ? get("order-id") : this.state.orderId) });
      await this.props.tableActions.getComboItemListOnly();
      await this.setComboItemAll(this.state.comboItemAll, this.state.orderItemById);
    }
  }

  onSaveAmountComboTemp = (qty) => {
    this.setState({
      qtyCombo: qty
    })
  }


  render() {
    const {
      slickIndex,
      showPopupMoreFood,
      showPopupSignUpComboChoose,
      comboItemAll,
      comboPromotion
    } = this.state;
    const { t, comboList, ...rest } = this.props;

    const settings = {
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesPerRow: 2,
      slidesToScroll: 4,
      afterChange: current => {this.setState({ slickIndex: current });},
      arrows: false,
      /* responsive: [
        {
          breakpoint: 1409,
          settings: {
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesPerRow: 3,
            slidesToScroll: 4,
            afterChange: current => this.setState({ slickIndex: current }),
            arrows: false,
          },
        },
      ] */
    };

    //so luong combo cua suat co gia da dang ky
    let quantity_combo = 0;
    if (!_.isEmpty(this.state.orderItemById))
    {
      if (this.state.orderItemById && this.state.orderItemById.order_combo_items && this.state.orderItemById.order_combo_items.length > 0)
      {
        this.state.orderItemById.order_combo_items.map((item) => {
          quantity_combo += item.qty;
        })
      }
    }

    return (
      <main id="site-main" className="custom-main" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <section id="main-cont">
          <Loading show={this.props.isLoading} />
          <div className="order-combo-table-list">
            <div className="hori-header">
              <div className="e-container">
                <div className="top-header">
                  <div className="btn-back" onClick={this.BackToHome}><FontAwesomeIcon style={{ fontSize: "24px" }} icon={faArrowLeft} /></div>
                  <div className="text-header">
                    {t("promotions.titleListCombo")}
                  </div>
                  <div className="tbl-name">{t('table')} {get("table-number")}</div>
                </div>
              </div>
            </div>
            <div className="body-food e-m-top-10">
              <div className="e-container e-row">
                  <aside className="top-acts flex-view middle" style={{ width: "100%"}}>
                    <div className="sets-slider slick-initialized slick-slider" style={{ width: "100%" }}>
                    {(comboItemAll && comboItemAll.length < 8) || isMobile === true ? null : (
                        <button
                          className={`slick-arrow arrow-left slick-prev ${slickIndex !== 0 ? null : "slick-disabled"
                            }`}
                          aria-disabled="true"
                          style={{ display: "block", top: `calc(50% - 1.875em)` }}
                          onClick={this.previous}
                        ></button>
                      )}
                      <div className="slick-list draggable" style={{ width: "100%" }}>

                      <div className="slick-track e-m-bottom-5" style={{ width: "100%" }}>
                          <Slider ref={c => (this.slider = c)} {...settings} style={{ width: "100%" }}>
                            {/* <div className="e-row order-width-important custom-card"> */}
                              {/* khi ban vao roi */}
                              {get("check-table") === true ?
                                //khi ban chua vao xuat ra het cac combo
                                comboItemAll && comboItemAll.map((dishItem, index) => (
                                  <div key={index} className="e-p-10 custom-card">
                                    <DishItem
                                      setComboItemAll={this.setComboItemAll}
                                      moveToFoodList={() => { this.moveToFoodList(dishItem, index) }}
                                      showConfirmCombo={this.showConfirmCombo}
                                      dishItem={dishItem.items}
                                      nameCombo={dishItem.name}
                                      dishItemFull={dishItem}
                                      showPopupMoreFood={(dishItem) => this.setState({
                                        showPopupMoreFood: true,
                                        comboItemId: dishItem.id,
                                        itemDishdetail: dishItem
                                      })}
                                      t={t}
                                      {...rest}
                                      comboPromotion={comboPromotion}
                                    />
                                  </div>))
                                //khi thong tin order khac rong thi moi kiem tra combo de chan ko cho click vao cac combo da dang ky suat
                            : (!_.isEmpty(this.state.orderItemById) && this.state.orderItemById && this.state.orderItemById.order_combo_items ? ((this.state.orderItemById.order_combo_items.length > 0 ? (comboItemAll && comboItemAll.map((dishItem, index) => (
                                  this.state.orderItemById.order_combo_items[0].combo_item_id !== dishItem.id /* && dishItem.is_price === true */
                                    ?
                                    // TH: khong khoa ca combo khong co gia
                                    (dishItem.is_price === true ? <div key={index} className="e-p-10 custom-card"> {/* custom-block */}
                                      <DishItem
                                        setComboItemAll={this.setComboItemAll}
                                        moveToFoodList={() => { this.moveToFoodList(dishItem, index) }}
                                        showConfirmCombo={this.showConfirmCombo}
                                        dishItem={dishItem.items} //combo_item_details -> items
                                        nameCombo={dishItem.name}
                                        dishItemFull={dishItem}
                                        showPopupMoreFood={(dishItem) => this.setState({
                                          showPopupMoreFood: true,
                                          comboItemId: dishItem.id,
                                          itemDishdetail: dishItem
                                        })}
                                        t={t}
                                        lockUp={true} //khoa cac combo khong co dang ky combo
                                        quantity_combo={/* this.state.orderItemById.order_combo_items[0].combo_item_id === dishItem.id ? */ quantity_combo /* : null */}
                                        is_quantity_combo={false}
                                        {...rest}
                                        comboPromotion={comboPromotion}
                                      />
                                    </div>:
                                      <div key={index} className="e-p-10 custom-card"> {/* custom-block */}
                                        <DishItem
                                          setComboItemAll={this.setComboItemAll}
                                          moveToFoodList={() => { this.moveToFoodList(dishItem, index) }}
                                          showConfirmCombo={this.showConfirmCombo}
                                          dishItem={dishItem.items} //combo_item_details -> items
                                          nameCombo={dishItem.name}
                                          dishItemFull={dishItem}
                                          showPopupMoreFood={(dishItem) => this.setState({
                                            showPopupMoreFood: true,
                                            comboItemId: dishItem.id,
                                            itemDishdetail: dishItem
                                          })}
                                          t={t}
                                          lockUp={false} //khoa cac combo khong co dang ky combo
                                          quantity_combo={/* this.state.orderItemById.order_combo_items[0].combo_item_id === dishItem.id ? */ quantity_combo /* : null */}
                                          is_quantity_combo={false}
                                          {...rest}
                                          comboPromotion={comboPromotion}
                                        />
                                      </div>
                                    )
                                    :
                                    <div key={index} className="e-p-10 custom-card" >
                                      <DishItem
                                        setComboItemAll={this.setComboItemAll}
                                        moveToFoodList={() => { this.moveToFoodList(dishItem, index) }}
                                        showConfirmCombo={this.showConfirmCombo}
                                        dishItem={dishItem.items} //combo_item_details -> items
                                        nameCombo={dishItem.name}
                                        dishItemFull={dishItem}
                                        showPopupMoreFood={(dishItem) => this.setState({
                                          showPopupMoreFood: true,
                                          comboItemId: dishItem.id,
                                          itemDishdetail: dishItem
                                        })}
                                        lockUp={false}
                                        quantity_combo={/* this.state.orderItemById.order_combo_items[0].combo_item_id === dishItem.id ?  */quantity_combo /* : null */}
                                        is_quantity_combo={true}
                                        t={t}
                                        {...rest}
                                        comboPromotion={comboPromotion}
                                      />
                                    </div>

                                ))) :
                                  comboItemAll.map((dishItem, index) => (
                                    <div key={index} className="e-p-10 custom-card">
                                      <DishItem
                                        setComboItemAll={this.setComboItemAll}
                                        moveToFoodList={() => { this.moveToFoodList(dishItem, index) }}
                                        showConfirmCombo={this.showConfirmCombo}
                                        dishItem={dishItem.items}
                                        nameCombo={dishItem.name}
                                        dishItemFull={dishItem}
                                        showPopupMoreFood={(dishItem) => this.setState({
                                          showPopupMoreFood: true,
                                          comboItemId: dishItem.id,
                                          itemDishdetail: dishItem
                                        })}
                                        t={t}
                                        {...rest}
                                        comboPromotion={comboPromotion}
                                      />
                                    </div>))
                                )) :
                                  //khi ban chua co order
                                  comboItemAll.map((dishItem, index) => (
                                    <div key={index} className="e-p-10 custom-card">
                                      <DishItem
                                        setComboItemAll={this.setComboItemAll}
                                        moveToFoodList={() => { this.moveToFoodList(dishItem, index) }}
                                        showConfirmCombo={this.showConfirmCombo}
                                        dishItem={dishItem.items}
                                        nameCombo={dishItem.name}
                                        dishItemFull={dishItem}
                                        showPopupMoreFood={(dishItem) => this.setState({
                                          showPopupMoreFood: true,
                                          comboItemId: dishItem.id,
                                          itemDishdetail: dishItem
                                        })}
                                        t={t}
                                        {...rest}
                                        comboPromotion={comboPromotion}
                                      />
                                    </div>))
                                )}
                            {/* </div> */}
                          </Slider>

                        </div>
                      </div>

                    {(comboItemAll && comboItemAll.length < 8) || isMobile === true ? null : (
                        <button
                          className={`slick-arrow arrow-right slick-next
                            ${(comboItemAll && comboItemAll.length <= slickIndex*4) || comboItemAll.length <= 8
                              ? "slick-disabled" : null
                            }`}
                          style={{ display: "block", top: `calc(50% - 1.875em)` }}
                          onClick={this.next}
                        ></button>
                      )}
                    </div>


                  </aside>
                </div>
              </div>
            </div>

          {this.state.showPopupSignUpCombo && (this.state.showPopupSignUpComboChoose ?
          <SignUpCombo
            show={this.state.showPopupSignUpCombo}
            close={() => this.setState({ showPopupSignUpCombo: false, showPopupSignUpComboChoose: false })}
            t={t}
            isCheckSignUpCombo={true}
            onSaveAmountCombo={this.onSaveAmountComboTemp}
            //onSaveAmountCombo={this.onSaveAmountCombo}
            loadDataAgain={this.loadDataAgain}
            quantityCombo={quantity_combo}
            {...rest}
          /> : <SignUpCombo
              show={this.state.showPopupSignUpCombo}
              close={() => this.setState({ showPopupSignUpCombo: false, showPopupSignUpComboChoose: false })}
              t={t}
              detailCombo={this.state.itemDishdetail}
              onSaveAmountCombo={this.onSaveAmountCombo}
              {...rest}
            /> )}
          <Dialog
            show={showPopupMoreFood}
            close={() => this.setState({ showPopupMoreFood: false })}
            title={t("dishManagaments.listFood")}
          >
            <PopupMoreFood
              foods={this.props.itemComboList}
              comboItemId={this.state.comboItemId}
              itemDishdetail={this.state.itemDishdetail}
              hide={() => this.setState({ showPopupMoreFood: false })}
              t={t}
            />
          </Dialog>
          <Dialog
            show={showPopupSignUpComboChoose}
            close={() => this.setState({ showPopupSignUpComboChoose: false })}
            title={this.state.itemDishdetail.name}
            innerClass="popup-sign-up-combo-choose"
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Button type="s3" className="sign-up-combo" onClick={() => this.setState({ showPopupSignUpCombo: true })}>
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  style={{
                    fontSize: 30,
                    verticalAlign: "middle",
                    marginRight: "10px",
                  }}
                />ĐĂNG KÝ SỐ SUẤT</Button>
              {get("check-table") !== true && this.state.orderItemById && this.state.orderItemById.order_combo_items && this.state.orderItemById.order_combo_items.length > 0 ?
                <Button type="s3" className="show-item-combo" onClick={this.OrderFood}>
                  <FontAwesomeIcon
                    icon={faListAlt}
                    style={{
                      fontSize: 30,
                      verticalAlign: "middle",
                      marginRight: "10px",
                    }}
                  />
                DANH SÁCH CHỌN MÓN</Button> : null}
            </div>
          </Dialog>
        </section>
      </main>
    );
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
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(withNamespaces()(ComboList));
