import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { withNamespaces } from "react-i18next";
import Slider from "react-slick";
import Loading from "../../../../../components/common/Loading";
import { withRouter } from "react-router-dom";
import * as actions from "../../../actions";
import { TableListReducerName } from "../../../reducers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../../../../../components/common";
import { faArrowLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import image from "../img/phan-trang.png";
import { get, remove, save } from "../../../../../services/localStorage";
import CategoryItem from "./CategoryItem";
import './../../../scss/FoodList.scss';
import { partner_id } from "../../../../../consts/constants";
import Swal from "../../../../../utils/sweetalert2";
import SidebarRight from './SidebarRight';
import notFound from './../img/no-data.png';
import * as Promotion from './../../../../../api/promotion';
import FoodListOrderModal from "./FoodListOrderModal";
import api from "./../../../../../services/api";
class FoodList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: -1, //Lay index khi chon category
      slickIndex: 0,
      slickIndex1: 0,
      slickIndex2: 0,
      qtyItem: 10,
      page: 1,
      selected: 0,
      totalQtySelected: 0,
      selectedDishes: [],
      showPopupSelectedFoodList: false,
      categoryName: "",
      comboId: this.props.comboItemList.length > 0 ? this.props.comboItemList[0].id : "", //Lay id tu danh sach combo False
      comboItemList: this.props.comboItemList.length > 0 ? this.props.comboItemList : [], //dung de so sanh lay id combo moi nhat
      partnerSetting: this.props.partnerSetting ? this.props.partnerSetting : {},
      orderItemById: this.props.orderItemById ? this.props.orderItemById : {},
      checkAfterChooseCombo: false,//Check da chon combo khac
      orderId: this.props.orderId ? this.props.orderId : "",
      isClick: false,
      fixedMain: false,
      textSearch: null,
      dataFilter: [],
      isChange: false,
      isSearch: false,
      itemPromotion: [],
      comboPromotion: [],
      isOrderPopup: false,
      showPrice: null,
    };

  }

  static getDerivedStateFromProps(nextProps, prevState) {

    if (nextProps.comboItemList !== prevState.comboItemList
      || nextProps.orderItemById !== prevState.orderItemById
      || nextProps.orderId !== prevState.orderId
      || nextProps.isPrice !== prevState.showPrice
      || nextProps.partnerSetting !== prevState.partnerSetting
    ) {
      return {
        comboId: nextProps.comboItemList.length > 0 ? nextProps.comboItemList[0].id : "",
        comboItemList: nextProps.comboItemList.length > 0 ? nextProps.comboItemList : [],
        partnerSetting: nextProps.partnerSetting,
        orderItemById: nextProps.orderItemById,
        orderId: nextProps.orderId,
        showPrice:nextProps.isPrice
      };
    }
    return null;
  }

  //Func Lay param tu link
  getDataFromParam = (url, name, type) => {

    let result = type === 'array' ? [] : '';
    const query = (url || window.location.href).split("?");
    const params = (query[1] || '').split("&");
    params.forEach((item) => {
      const key = item.split("=")[0];
      const value = item.split("=")[1];
      if (key === name && type === 'array') {
        result = [...result, decodeURIComponent(value)];
      } else if (key === name) {
        result = decodeURIComponent(value);
      }
    });
    return result;
  }

  componentDidMount = async () => {
    // if (this.props.partnerSetting.partner_type === 2)
    // {
      if ((get("check-table") === false || get("check-sign-up") === false) && (!get("order-id") || get("order-id") === "" || get("order-id") === undefined) && !this.state.orderId) {
        //Chuyen ve trang chu khi bi mat du lieu, khong co orderId
        remove("check-table");
        remove("check-sign-up");
        this.props.history.push("/");
      } else {
        if (get("check-sign-up") === true) {
          save("check-sign-up", false);
        }
      }
    /* } */
    window.addEventListener("resize", this.handleResize);
    this.getPromotionItem(); // get promotion item
    //load lai data khi load trang
    let id_combo = this.getDataFromParam(null, "combo-id");
    let name_combo = this.getDataFromParam(null, "combo-name");
    let detail_combo = { id: id_combo, name: name_combo, is_price: true };
    if (id_combo !== "" && name_combo !== "" && get("vi-tri-combo") === undefined) {
      //khi combo co gia
      await this.props.tableActions.getPartnerSetting({ categoryName: "", comboName: "", comboDetail: detail_combo, check: true });
    } else {
      if (get("vi-tri-combo")) {
        this.setState({
          checkAfterChooseCombo: false //set lai gia tri khi load lai trang
        });
        //khi combo ko co gia
        await this.props.tableActions.getPartnerSetting({ categoryName: "", comboName: "", comboDetail: detail_combo, check: false });
      } else {
        //khi nha hang ko co combo
        await this.props.tableActions.getPartnerSetting({ categoryName: "", comboName: "" });
      }
    }
    this.props.tableActions.getCategoryItemList();
    //get info order
    if (get("is-list") === true) {
      await this.props.tableActions.getOrderItemById({ id: get("check-table") === true ? this.state.orderId : (get("order-id") ? get("order-id") : this.state.orderId) });
    }


  }

  next = () => {
    this.slider.slickNext();
  };

  previous = () => {
    this.slider.slickPrev();
  };

  next1 = () => {
    const { page } = this.state;
    this.slider1.slickNext();
    this.setState({
      page: page + 1,
    })
  }

  previous1 = () => {
    const { page } = this.state;
    this.slider1.slickPrev();
    this.setState({
      page: page - 1,
    })
  };

  next2 = () => {
    this.slider2.slickNext();

  };

  previous2 = () => {
    this.slider2.slickPrev();
  };

  //khi nha hang khong co combo
  moveToFoodList = () => {
    this.props.history.push("/");
  }

  BackToComboList = async () => {
    const {comboItemAll} = this.props;
    remove("is-price"); //xoa bien kiem tra co chon vao suat co gia hay khong
    remove("is-list"); //xoa bien kiem tra co chon vao nut danh sach chon mon hay khong
    remove("vi-tri-combo");
    if ((this.props.comboItemAll && this.props.comboItemAll.length <= 0) || (comboItemAll.length === 1 && comboItemAll[0].is_price === false)) {
      this.props.history.push("/");
    } else {
      this.props.history.push("/order-comboList");
    }
  }

  onAddNote = (i, note) => {
    const { selectedDishes } = this.state;
    selectedDishes[i].note = note;
    this.setState({ selectedDishes });
  };


  selectedComboItem = (comboIdChoose, index) => {
    const { categoryName } = this.state;

    this.props.tableActions.getComboById({ combo_item_id: comboIdChoose, categoryName });

    this.setState({
      checkAfterChooseCombo: true,
      comboId: comboIdChoose,
      selected: index,
      page: 1,
    })

  }

  selectedCategoryItem = (categoryName, index) => {
    const { comboId } = this.state;

    if (/* this.state.partnerSetting.partner_type === 2 */this.props.comboItemAll && this.props.comboItemAll.length <= 0) {
      this.props.tableActions.getComboById({ combo_item_id: comboId, categoryName });
    } else {
      this.props.tableActions.getOrderItem({ categoryName });
    }
    this.setState({
      categoryName,
      selectedCategory: index,
      page: 1,
    })
  }

  onPlus = (i) => {
    const { selectedDishes, totalQtySelected } = this.state;
    selectedDishes[i].qty++;
    this.setState({ selectedDishes, totalQtySelected: totalQtySelected + 1 });
  };

  onMinus = (i) => {
    const { selectedDishes, totalQtySelected } = this.state;
    if (selectedDishes[i].qty <= 1) {
      return;
    }
    selectedDishes[i].qty--;
    this.setState({ selectedDishes, totalQtySelected: totalQtySelected - 1 });
  };

  onChangeQuantity = (i, quantity, isChange) => {

    const { selectedDishes, totalQtySelected } = this.state;
    let oldQty = selectedDishes[i].qty;
    selectedDishes[i].qty = quantity;
    if (isChange) {
      this.setState({ selectedDishes })
      return
    }
    this.setState({ selectedDishes, totalQtySelected: totalQtySelected - oldQty + quantity });
  }

  onDelete = (i) => {
    const { selectedDishes, totalQtySelected } = this.state;
    let selectedDishTemp = selectedDishes;
    this.setState({ totalQtySelected: totalQtySelected - selectedDishTemp[i].qty })
    selectedDishTemp.splice(i, 1);
    this.setState({ selectedDishes: selectedDishTemp });

  };

  choose = (item, isIncrease) => {
    let { totalQtySelected, selectedDishes } = this.state;
    let flag = false;
    for (let index = 0; index < selectedDishes.length; index++) {
      if (item.name === selectedDishes[index].name) {
        selectedDishes.splice(index, 1, item);
        flag = true;
      }
    }
    if (flag === false) {
      selectedDishes.push(item);
    }
    this.setState({
      totalQtySelected: isIncrease ? totalQtySelected + 1
        : totalQtySelected - 1,
      selectedDishes
    })
  }

  onCheckedTakeaway = (isChecked, i) => {
    const { selectedDishes } = this.state;
    selectedDishes[i].is_takeaway = isChecked;
    this.setState({ selectedDishes });
  }

  showOk = () => {
    const { t } = this.props;
    Swal.fire({
      icon: 'success',
      text: t("takeaway.swalSaveOrderSuccess"),
      title: t("takeaway.noti")
    })
  }

  showErr = () => {
    const { t } = this.props;
    Swal.fire({
      icon: 'error',
      title: t("takeaway.noti"),
      text: t("takeaway.swalSaveOrderFail")
    })
  }

  onOrder = async() => {
    const { selectedDishes, comboId, orderItemById } = this.state;
    const {t} = this.props;
    const notificationData = {
      "title": t("detailRestaurant.order"),
      "content": `${t('orderFood.table')} ${get("table-number")} ${t("takeaway.justOrder")}`,
      "action": "staff_order_item",
      "type_notification": "1",
      "link": "",
      "body_data": {
        table_id: get("table-id") ? get("table-id") : "",
        order_id: get("check-table") === true ? this.state.orderId : (get("order-id") ? get("order-id") : this.state.orderId),
        action: "staff_order_item"
      },
      "order_items": [
      ],
      "partner_id": "",
      "table_id": get("table-id") ? get("table-id") : "",
      "area_id": get("area-id") ? get("area-id") : "",
      "topic": get("area-id") ? `area_${get("area-id")}` : "",
      "list_user_push_noti": [],
      "is_push_noti": "1"
    }
    const order_items = selectedDishes.map((dishes) => {
      return {
        item_id: dishes.id,
        item_name: dishes.name,
        // combo_item_id: "",
        // combo_item_name: "",
        qty: dishes.qty,
        price: dishes.price,
        /* position: 1, */
        unit_id: dishes.unit_id,
        unit_name: dishes.unit_name,
        note: dishes.note ? dishes.note : "",
        item_group_type: 0,
        is_bar: true,
        is_takeaway: dishes.is_takeaway ? dishes.is_takeaway : false,
        order_addon_items: []
      };
    });
    save("quantity-combo-temp", get("quantity-combo"));
    if (get("check-table") === true) { //tao order call api create order.
      if (get("quantity-combo") > 0) //TH: chua co order va goi suat co gia.
      {
        const data = {
          order_combo_items: [
            {
              combo_item_id: comboId,
              qty: get("quantity-combo") ? get("quantity-combo") : get("quantity-combo-temp"),
              //note: note,
              order_items: order_items
            }
          ],
          order_items: []
        };
        await this.props.tableActions.postOrderItemById({ id: this.state.orderId ? this.state.orderId : "", data, call_back_success: this.showOk, call_back_fail: this.showErr, notificationData});
        //load lai data order
        await this.props.tableActions.getOrderItemById({ id: this.state.orderId ? this.state.orderId : "" });
        //save("check-table", false);
        remove("quantity-combo");
        remove("ordered-no-price");
      } else {
        //TH: Chua co order va goi suat khong co gia.
        const data = {
          order: {
            customer_name: "",
            customer_tel: "",
            partner_id: partner_id,
            guest_number: 0,
            note: "",
            user_order_id: "",
            table_id: get("table-id")
          },
          order_items: order_items,
        };
        await this.props.tableActions.createOrder({ data, call_back_success: this.showOk, call_back_fail: this.showErr, notificationData });
        //load lai data order
        await this.props.tableActions.getOrderItemById({ id: get("check-table") === true ? this.state.orderId : (get("order-id") ? get("order-id") : this.state.orderId) });
        //save("order-id", get("check-table") === true ? this.state.orderId : (get("order-id") ? get("order-id") : this.state.orderId));
        //save("ordered-no-price", true);
      }
      save("check-table", false); //ban da goi order
    } else { //tao order call api create order by order id.
      //TH: da co order.
      let data;
      if ((this.state.comboItemList.length > 0 ? this.state.comboItemList[0].is_price : null) === true) {
        //TH: da co order va goi tiep suat an co gia.
        data = order_items;
        //TH: khi user chon vao nut danh sach chon mon
        await this.props.tableActions.postOrderItemComboById({ order_id: get("check-table") === true ? this.state.orderId : (get("order-id") ? get("order-id") : this.state.orderId), order_combo_item_id: orderItemById.order_combo_items[0].id, data, call_back_success: this.showOk, call_back_fail: this.showErr, notificationData });
        //load lai data order
        await this.props.tableActions.getOrderItemById({ id: get("check-table") === true ? this.state.orderId : (get("order-id") ? get("order-id") : this.state.orderId) });

      } else {
        //TH: da co order va goi tiep suat an khong co gia.
        data = {
          order_combo_items: [],
          order_items: order_items
        };
        //Order them suat an va mon an vao phieu order: co gia va khong co gia
        await this.props.tableActions.postOrderItemById({ id: get("check-table") === true ? this.state.orderId : (get("order-id") ? get("order-id") : this.state.orderId), data, call_back_success: this.showOk, call_back_fail: this.showErr, notificationData });
        //load lai data order
        await this.props.tableActions.getOrderItemById({ id: get("check-table") === true ? this.state.orderId : (get("order-id") ? get("order-id") : this.state.orderId) });
        //order them mon cho suat an co gia duoc dang ky truoc do roi
        //save("is-list", true); ???
      }
      remove("quantity-combo");
      remove("is-price");
    }

    //ban da co order
    //remove("check-table");
    //save("check-table", false);
    save("check-sign-up-combo", false);
    await this.setState({
      showPopupSelectedList: false,
      selectedDishes: [], //Khoi tao lai mang cac mon an da goi
      totalQtySelected: 0
    });
    await this.props.tableActions.getOrderItemById({ id: get("check-table") === true ? this.state.orderId : (get("order-id") ? get("order-id") : this.state.orderId) });
    await this.onShowOrder();

  };
  componentWillUnmount() {
    // important
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize = event => {
    const { target } = event;
    let width = target.innerWidth;
    if (width < 800) return this.setState({ fixedMain: true })
    if (width > 800) return this.setState({ fixedMain: false })
  };

  onShowHide = () => {
    const { fixedMain } = this.state
    this.setState({ fixedMain: !fixedMain })
  }
  //Reset page when order thanh cong
  changePage = () => {
    this.setState({
      pageOrder: 1
    })
  }

  onSetClick = () => {
    this.setState({ isClick: false })
  }

  onVisibleClick = () => {
    this.setState({ isClick: true })
  }

  onSearchFood = () => {
    const { orderItem, comboItemDetailOfItem, comboItemAll } = this.props
    const { textSearch, partnerSetting } = this.state;
    let newArray = []
    if (/* partnerSetting.partner_type === 2 */comboItemAll.length > 0) {
      if (textSearch !== null && textSearch !== "" && comboItemDetailOfItem.length > 0) {
        newArray = comboItemDetailOfItem.filter(function (item) {
          const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
          const textData = textSearch.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        this.setState({ dataFilter: newArray, isSearch: true })
      }

    } else if (/* partnerSetting.partner_type === 1 */comboItemAll.length <= 0) {
      if (textSearch !== null && textSearch !== "" && orderItem.length > 0) {
        newArray = orderItem.filter(function (item) {
          const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
          const textData = textSearch.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        this.setState({ dataFilter: newArray, isSearch: true })
      }

    }


  }

  onChangTextSearch = e => {
    const { textSearch, isChange } = this.state
    if (!isChange) {
      this.setState({ isChange: true, isSearch: false })
    }
    if (e.target.value.length === 0) {
      this.setState({ dataFilter: [], isSearch: false, textSearch: null })
    }
    this.setState({ textSearch: e.target.value })
  }

  getPromotionItem = async () => {
    try {
      const resItem = await Promotion.getPromotionItem()
      if (resItem.data && resItem.data.data.length>0) {
         this.setState({itemPromotion:resItem.data.data})
      }
    } catch (err) {
      console.log(err)
    }
  }

  onShowOrder = () => {
    this.setState({ isOrderPopup: true })
  }

  render() {
    const {
      selectedCategory,
      qtyItem,
      page,
      slickIndex,
      slickIndex1,
      slickIndex2,
      selected,
      selectedDishes,
      showPopupSelectedFoodList,
      totalQtySelected,
      comboItemList,
      partnerSetting,
      checkAfterChooseCombo,
      isClick,
      fixedMain,
      textSearch,
      isSearch,
      dataFilter,

    } = this.state;

    const {
      t,
      categoryItemList,
      comboItemListItem,
      comboItemDetailOfItem,
      orderItem,comboItemAll,
      ...rest } = this.props;

    const settingsForCombo = {
      infinite: false,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 5,
      afterChange: current => {this.setState({ slickIndex: current })},
      arrows: false
    };

    const settingsForCategory = {
      infinite: false,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 5,
      afterChange: current2 => { this.setState({ slickIndex2: current2 })},
      arrows: false
    };

    let isHasPrice = this.getDataFromParam(null, "is-has-price");

    return (
      <main id="site-main" style={{ paddingTop: 0, paddingBottom: 0 }} className="custom-main">
        <section id="main-cont">
          <Loading show={this.props.isLoading} />
          <div className="hori-header">
            <div className="e-container">
              <div className="top-header">
                <div className="btn-back" onClick={this.BackToComboList}><FontAwesomeIcon style={{ fontSize: "24px" }} icon={faArrowLeft} /></div>
                <div className="text-header">
                  {t("takeaway.foodList")}
                </div>
                <div className="tbl-name">{t('orderFood.table')} {get("table-number")}</div>
              </div>
            </div>

          </div>
          <div className="body-food">
            <div className="e-container e-flex custom-container">
              <div className="table-list">
                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  {
                    comboItemAll && comboItemAll.length <= 0 ? null : <div className="content-center e-m-bottom-10" style={{ marginBottom: comboItemAll && comboItemAll.length <= 0 ? "0px" : "10px", height: "55px" }}> {/* Chỉnh row suất ăn */}
                      <aside className="combo-menu">
                        <div className="slick-initialized slick-slider" >
                          {comboItemAll && comboItemAll.length <= 0 ? null : (
                            comboItemList.length <= 5 ? null :
                            <button
                              className={`slick-arrow arrow-left slick-prev ${slickIndex !== 0 ? null : "slick-disabled"
                                }`}
                              aria-disabled="true"
                              style={{ display: "block", left: "-15px", top: "-4px" }}
                              onClick={this.previous}
                            ></button>
                          )}
                          <div className="slick-list draggable combo-table-list list-slider-track-1">
                            <div className="slick-track custom-btn">
                              <Slider ref={c => (this.slider = c)} {...settingsForCombo}>
                                {comboItemList.map((item, index) =>
                                  <Button key={index} className={`${(get("vi-tri-combo") && checkAfterChooseCombo === false ? get("vi-tri-combo") === item.id : selected === index) ? "orange-TableListScreen-combo" : "blue-TableListScreen-combo"}`}
                                    onClick={() => { this.selectedComboItem(item.id, index) }}
                                    /* disabled={get("vi-tri-combo") ? (get("vi-tri-combo") === item.id && checkAfterChooseCombo === false ? true : false) : (selected === index ? true : false)} */
                                  >
                                    {item.name}
                                  </Button>
                                )}
                              </Slider>
                            </div>
                          </div>
                          {comboItemAll && comboItemAll.length <= 0 ? null : (
                            comboItemList.length <= 5 ? null :
                            <button
                              className={`slick-arrow arrow-right slick-next ${slickIndex + 5 >= comboItemList.length
                                || comboItemList.length === 5
                                ? "slick-disabled"
                                : null
                                }`}
                              style={{ display: "block", top: "-4px" }}
                              onClick={this.next}
                            ></button>
                          )}
                        </div>
                      </aside>

                    </div>
                  }

                  <div className="e-m-bottom-15 e-m-top-10">
                    <aside className={`category-menu ${comboItemAll && comboItemAll.length <= 0 ? "category-menu-custom" : ""}`}>
                      <div className="slick-initialized slick-slider" >
                        {categoryItemList.length <= 5 ? null : (
                          <button
                            className={`slick-arrow arrow-left slick-prev ${slickIndex2 !== 0 ? null : "slick-disabled"
                              }`}
                            aria-disabled="true"
                            style={{ display: "block", left: "-15px", top: '-5px' }}
                            onClick={this.previous2}
                          ></button>
                        )}
                        <div className="slick-list draggable" style={{ height: "100%" }}>
                          <div className="slick-track custom-btn">
                            <Slider ref={c => (this.slider2 = c)} {...settingsForCategory}>
                              {/* <div className="flex-category"> */}
                              {categoryItemList.length > 0
                                ?
                                <Button className={`${selectedCategory === -1 ? "orange-category-TakeAwayScreen-table-list" : "gray-TakeAwayScreen"}`}
                                  onClick={() => { this.selectedCategoryItem("", -1) }} //button category all
                                >
                                  {t("takeaway.all")}
                                </Button>
                                : null}
                              {categoryItemList.map((item, index) =>
                                <Button key={index} className={`${selectedCategory === index ? "orange-category-TakeAwayScreen-table-list" : "gray-TakeAwayScreen"}`}
                                  onClick={() => { this.selectedCategoryItem(item.name, index) }}
                                >
                                  {item.name}
                                </Button>

                              )}
                              {/* </div> */}
                            </Slider>
                          </div>
                        </div>
                        {categoryItemList.length <= 5 ? null : (
                          <button
                            className={`slick-arrow arrow-right slick-next ${slickIndex2 === Math.floor(categoryItemList.length / 5) * 5
                              ? "slick-disabled"
                              : null
                              }`}
                            style={{ display: "block", top: '-5px' }}
                            onClick={this.next2}
                          ></button>
                        )}
                      </div>
                    </aside>
                  </div>
                  <aside className={`grid-food ${comboItemAll && comboItemAll.lenght <= 0 ? "grid-food-custom" : ""}`} >
                    <div className="search">
                      <input className="emenu-input " placeholder={t('detailRestaurant.placeholder')} onChange={e => this.onChangTextSearch(e)} />
                      <Button onClick={() => this.onSearchFood()}><FontAwesomeIcon icon={faSearch} /> {t("dishManagament.search")}</Button>
                    </div>
                    <div className="e-row custom-row">
                      {comboItemAll && comboItemAll.length <= 0
                        ?
                        orderItem.length === 0 ?
                          <div className="empty-data">
                            <img src={notFound} />
                            <p>{t("orderFood.noData")}</p>
                          </div>
                          : dataFilter.length === 0 && !isSearch || textSearch === null ?
                            orderItem.map((item, index) =>
                              <CategoryItem choose={(qty, item) => this.choose(qty, item)}
                                key={index}
                                selectedDishes={selectedDishes}
                                item={item} t={t}
                                isClickOrder={isClick}
                                onSetClick={() => this.onSetClick()}
                                dataPromotion={this.state.itemPromotion}
                                partnerSetting={partnerSetting}
                                isHasPrice={isHasPrice}
                                {...rest}
                              /> )
                            : textSearch !== "" && dataFilter.length > 0 && isSearch ?
                              dataFilter.map((item3, index3) =>
                                <CategoryItem choose={(qty, item3) => this.choose(qty, item3)}
                                  key={index3}
                                  selectedDishes={selectedDishes}
                                  item={item3} t={t}
                                  isClickOrder={isClick}
                                  onSetClick={() => this.onSetClick()}
                                  dataPromotion={this.state.itemPromotion}
                                  partnerSetting={partnerSetting}
                                  isHasPrice={isHasPrice}
                                  {...rest}
                                />) : <div className="empty-data">
                                <img src={notFound} />
                                <p>{t("detailRestaurant.notFound")}</p>
                              </div>
                        : comboItemDetailOfItem.length === 0 ?
                          <div className="empty-data">
                            <img src={notFound} />
                            <p>{t("orderFood.noData")}</p>
                          </div>
                          :
                          dataFilter.length === 0 && !isSearch || textSearch === null ?
                            comboItemDetailOfItem.map((item1, index1) =>
                              <CategoryItem choose={(qty, item1) => this.choose(qty, item1)}
                                key={index1} selectedDishes={selectedDishes} item={item1}
                                t={t}
                                isClickOrder={isClick}
                                onSetClick={() => this.onSetClick()}
                                dataPromotion={this.state.itemPromotion}
                                isPrice={this.state.showPrice}
                                partnerSetting={partnerSetting}
                                isHasPrice={isHasPrice}
                                {...rest}
                              />)
                            : textSearch !== "" && dataFilter.length > 0 && isSearch ?
                              dataFilter.map((item2, index2) =>
                                <CategoryItem choose={(qty, item2) => this.choose(qty, item2)}
                                  key={index2} selectedDishes={selectedDishes}
                                  item={item2} t={t}
                                  isClickOrder={isClick}
                                  onSetClick={() => this.onSetClick()}
                                  dataPromotion={this.state.itemPromotion}
                                  isPrice={this.state.showPrice}
                                  partnerSetting={partnerSetting}
                                  isHasPrice={isHasPrice}
                                  {...rest}
                                />)
                              : <div className="empty-data">
                                <img src={notFound} />
                                <p>{t("detailRestaurant.notFound")}</p>
                              </div>
                      }
                    </div>
                  </aside>
                </div>
              </div>
              <div className={`sidebar-right ${fixedMain ? "fixed-sidebar" : ""}`}>
                <SidebarRight t={t}
                  totalFood={totalQtySelected}
                  dishList={selectedDishes}
                  onPlus={this.onPlus}
                  onMinus={this.onMinus}
                  onChangeQuantity={this.onChangeQuantity}
                  onDelete={this.onDelete}
                  onAddNote={this.onAddNote}
                  onCheckedTakeaway={this.onCheckedTakeaway}
                  changePage={this.changePage}
                  onOrder={this.onOrder}
                  order_id={this.state.orderId}
                  isClick={isClick}
                  onVisibleClick={() => this.onVisibleClick()}
                  backToPage={this.BackToComboList}
                  onShowOrder={() => this.onShowOrder()}
                  partnerSetting={partnerSetting}
                  {...rest}
                />
              </div>
              <div className="sidebar-mobile">
                <div id="btn-sidebar" onClick={() => this.onShowHide()}>
                  <div className="close" style={{ display: `${!fixedMain ? "none" : "flex"}` }}>&#10005;</div>
                  <div className="open" style={{ display: `${!fixedMain ? "flex" : "none"}` }}>&#9776;</div>
                </div>
                {!fixedMain && <div style={{
                  position: "relative",
                  top: 40,
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  background: "#93cc39",
                  color: "#fff",
                  fontSize: "24px",
                  textAlign: "center",
                  zIndex: 13,
                }}>{totalQtySelected}</div>}
              </div>
            </div>
          </div>
        </section>
        <div className={`overlayer ${fixedMain ? 'open' : ''}`} onClick={() => this.onShowHide()}></div>
        {this.state.isOrderPopup && (get("order-id") || this.state.orderId !== "" || get("check-sign-up-combo") === true) && <FoodListOrderModal
              close={() => { this.setState({ isOrderPopup: false }) }}
              t={t}
              tblNum={get("table-number")}
              orderIdFoodList={get("check-table") === true ? this.state.orderId : (get("order-id") ? get("order-id") : this.state.orderId)}
              partnerSetting={partnerSetting}
              orderItemById={this.state.orderItemById}
            />}
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
)(withNamespaces()(FoodList));
