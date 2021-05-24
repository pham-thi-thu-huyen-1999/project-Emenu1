import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { withRouter } from "react-router-dom";
import { withNamespaces } from "react-i18next";
import Slider from "react-slick";
import InfiniteScroll from "react-infinite-scroll-component";
import { name } from "./reducers";
import * as action from "./actions";
import { TableListReducerName } from "../TableList/reducers";
import * as tableListActions from "../TableList/actions";
import "./TakeAwayScreen.scss";
import { Button, Nodata } from "../../components/common";
import {
  TakeawayBill,
  PopupSelectedList,
  PopupPayments,
} from "./components";
import { partner_id } from "../../consts/constants";
import CategoryItem from "./components/CategoryItem";
import image from "./img/phan-trang.png";
import Loading from "../../components/common/Loading";
import { get } from "../../services/localStorage";
import { faPlusCircle, faSearch, faCheck, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "../../components/common";
import SidebarRight from "./components/SidebarRight";
import "./components/FoodList.scss";
import * as Promotion from './../../api/promotion';
import notFound from './img/no-data.png';
import { getAccountInfoStaff } from "../../api/account";
import common from "./../../utils/common";
import Swal from "../../utils/sweetalert2";
var infoToken = common.decodeToken(get('accessToken'));

class TakeAwayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopupSelectedList: false,
      showPopupPayments: false,
      isTakeawayList: true,
      itemList: [],
      tabIndex: 0,
      totalBill: 0,
      surchange: 0,
      voucher_code: "",
      selectedDishes: [],
      valSearch: "",
      slickIndex: 0,
      slickIndex1: 0,
      slickIndex2: 0,
      page: 1,
      selectedCombo: null,
      selectedAll: true,
      selected: 0,
      selectedCategory: -1,
      totalQtySelected: 0,
      listView: [],
      categoryName: "",
      comboName: "",
      comboId: "",
      order_no: "", //order_no here is orderId
      hasMore: props?.orderForm?.length >= props?.orderTotal ? false : true,
      orderForm: props?.orderForm,
      pageOrder: 1,
      billInfo: {},
      qtyItem: 10,
      nameCustomer: "",
      idOrder: "",
      sdtOrder: "",
      isCheckCreate: false,
      isCheckPay: false,
      isCheckDelivery: false,
      isCheckCancel: false,
      isClick: false,
      fixedMain: false,
      itemPromotion: [],
      textSearch: null,
      dataFilter: [],
      isChange: false,
      isSearch: false,
      showPopupSelectedList_confirm_food: false,
      accountInfoStaff: {}
    };
  }

  getPromotionItem = async () => {
    try {
      const resItem = await Promotion.getPromotionItem()
      if (resItem.data && resItem.data.data.length > 0) {
        this.setState({ itemPromotion: resItem.data.data })
      }
    } catch (err) {
      console.log(err)
    }
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

  onSetClick = () => {
    this.setState({ isClick: false })
  }

  onVisibleClick = () => {
    this.setState({ isClick: true })
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

  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps.orderForm) !== JSON.stringify(prevState.orderForm) || nextProps.orderId !== prevState.order_no || prevState.pageOrder === 1) {
      return { hasMore: true, orderForm: nextProps.orderForm, order_no: nextProps.orderId };
    } else return null;
  }

  getOrderForm = () => {
    this.props.actions.getOrderForm({ page: 1, limit: 100});
  }

  componentDidMount = async () => {
    var { categoryName, comboName, orderForm } = this.state;
    await this.props.actions.getPartnerSetting({ categoryName, comboName });
    if (orderForm && orderForm.length === 0) {
      await this.props.actions.getOrderForm({ page: 1, limit: 10 });
    }
    await this.props.actions.getCategoryItemList();
    await this.props.actions.getAccountInfo();
    await this.props.tableListActions.getComboItemListOnly();
    this.getPromotionItem(); // get promotion item
    if (document.querySelector(".emenu-header")) {
      document.querySelector(".emenu-header").style.display = "block";
      document.querySelector(".emenu-header").style.backgroundColor = "#393e46";
      document.querySelector("#root").style.marginTop = "0px";
      Object.assign(document.querySelector(".use-bg").style, {
        backgroundColor: '#fff',
        backgroundImage: 'url(/static/media/bg-emenu.ccc683cd.png)'
      });
    }

    const resInfoAccount = await getAccountInfoStaff({ id: infoToken.sub });
    this.setState({
      accountInfoStaff: resInfoAccount.data.data
    })
    window.addEventListener("resize", this.handleResize);
  }

  hiddenHeaderFoodList = () => {
    if (!this.state.accountInfoStaff?.UserAreas?.[0].id || this.state.accountInfoStaff?.UserAreas?.[0].id === "") {
      Swal.fire({
        title: "Thông báo",
        text: "Nhân viên chưa được phân công khu vực không thể order món!",
        icon: 'info'
      })
    } else {
      document.querySelector(".emenu-header").style.display = "none";
      document.querySelector(".emenu-header").style.backgroundColor = "#f4f5f9";
      document.querySelector("#root").style.backgroundColor = "#f4f5f9";
      document.querySelector("#root").style.marginTop = "-70px";
      Object.assign(document.querySelector(".use-bg").style, {
        backgroundColor: '#f4f5f9',
        backgroundImage: 'none'
      })
      this.setState({ isTakeawayList: false });
    }
  }

  backOrderList = async () => {
    document.querySelector(".emenu-header").style.display = "block";
    document.querySelector(".emenu-header").style.backgroundColor = "#393e46";
    document.querySelector("#root").style.marginTop = "0px";
    Object.assign(document.querySelector(".use-bg").style, {
      backgroundColor: '#fff',
      backgroundImage: 'url(/static/media/bg-emenu.ccc683cd.png)'
    })
    await this.props.actions.getOrderForm({ page: 1, limit: 10 });
    this.setState({
      isTakeawayList: true
    })
  }

  componentWillUnmount() {
    // important
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize = event => {
    const { target } = event;
    let width = target.innerWidth;
    if (width > 1500) {
      this.setState({
        qtyItem: 10
      })
    } else if (width <= 1500 && width > 1252) {
      this.setState({
        qtyItem: 12
      })
    } else if (width <= 1252 && width > 938) {
      this.setState({
        qtyItem: 6
      })
    } else if (width <= 938 && width > 630) {
      this.setState({
        qtyItem: 4
      })
    } else if (width <= 630) {
      this.setState({
        qtyItem: 2
      })
    }
  };

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
    let selectedDishTemp = this.state.selectedDishes;
    this.setState({ totalQtySelected: totalQtySelected - selectedDishTemp[i].qty })
    selectedDishTemp.splice(i, 1);
    this.setState({ selectedDishes: selectedDishTemp });

  };

  onAddNote = (i, note) => {
    const { selectedDishes } = this.state;
    selectedDishes[i].note = note;
    this.setState({ selectedDishes });
  };

  onCheckedTakeaway = (isChecked, i) => {
    const { selectedDishes } = this.state;
    selectedDishes[i].is_takeaway = isChecked;
    this.setState({ selectedDishes });
  }
  noFood = () => {
    return <h2 className="notice-no-dishes">Chưa có món ăn này</h2>
  }
  onOrder = async(customerName, customerPhoneNumber, isChecked) => {
    const { selectedDishes } = this.state;
    const { t } = this.props;
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
      };
    });
    const data = {
      order: {
        customer_name: customerName,
        customer_tel: customerPhoneNumber,
        partner_id: partner_id,
        guest_number: 0,
        note: "",
        user_order_id: ""
      },
      order_items: order_items,
    };

    const notificationData = {
      "title": t("detailRestaurant.order"),
      "content": `Hoá đơn mang về vừa thực hiện gọi món.`,
      "action": "staff_order_item",
      "type_notification": "1",
      "link": "",
      "body_data": {
        table_id: "",
        order_id: "",
        action: "staff_order_item",
        is_takeaway: "true"
      },
      "order_items": [
      ],
      "partner_id": "",
      "table_id": "",
      "area_id": this.state.accountInfoStaff?.UserAreas?.[0].id,
      "topic": `area_${this.state.accountInfoStaff?.UserAreas?.[0].id}`,
      "list_user_push_noti": [],
      "is_push_noti":
        "1"
    }
      if (isChecked === "") {
        //Khong hien thi popup thong bao thanh cong
        await this.props.actions.createOrder({ data, isChecked: true, notificationData });
      } else {
        await this.props.actions.createOrder({ data, notificationData });
      }

    if (isChecked === "") {
      this.setState({
        showPopupSelectedList_confirm_food: true
      })
    }
    else {
      this.backOrderList();
      this.setState({
        isTakeawayList: true,
        selectedDishes: [],
        totalQtySelected: 0
      });
    }
    //this.props.actions.getOrderForm();
  };

  onShowPopupSelectedList_confirm_food = () => {
    this.setState({
      showPopupSelectedList_confirm_food: false,
      selectedDishes: [],
      totalQtySelected: 0
    });
  }


  selectedComboItem = (id, comboName1, index) => {
    const { categoryName } = this.state;

    this.props.actions.getComboById({ combo_item_id: id, categoryName });

    this.setState({
      comboName: comboName1,
      comboId: id,
      selected: index,
      page: 1,
    })


  }

  selectedComboItemAll = (comboName1) => {
    const { categoryName, comboName } = this.state;
    this.props.actions.getComboItemList({ categoryName, comboName });
    this.setState({
      comboName: comboName1,
      selected: -1,
      page: 1,
    })
  }
  /**
   * select category
   * @param {*} categoryName
   * @param {*} index
   */
  selectedCategoryItem = (categoryName, index) => {
    const { comboItemDetail, comboItemAll } = this.props;
    const { comboName, comboId } = this.state;
    if (comboItemAll && comboItemAll.length > 0) {
      //Choose comboItem All
      /* if (comboName === "") {
        console.log("selected category 1 ", comboName, categoryName, comboId)
        this.props.actions.getComboItemList({
          categoryName,
          comboName: this.props.comboItemList[0].name
        });
      } else { */
      this.props.actions.getComboById({ combo_item_id: comboId, categoryName });
      /* } */
    } else {
      this.props.actions.getOrderItem({ categoryName });
    }
    this.setState({
      categoryName,
      selectedCategory: index,
      page: 1,
    })
  }
  /**
   * choose item food
   * @param {*} item
   * @param {*} isIncrease
   */
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

  openPopupSelectedList = () => {
    this.setState({
      showPopupSelectedList: true,
    })
  }

  changePage = () => {
    this.setState({
      pageOrder: 1
    })
  }

  fetchOrders = () => {
    const { pageOrder, orderForm } = this.state;
    console.log("fetch", orderForm.length, this.props.orderTotal, pageOrder)
    if (orderForm.length >= this.props.orderTotal) {
      this.setState({ hasMore: false })
      return;
    }
    this.props.actions.getOrderForm({ page: pageOrder + 1, limit: 10 });
    this.setState({ pageOrder: pageOrder + 1 });

    //this.props.actions.getOrderForm({ page: 1, limit: 100 });
  }

  onSearchFood = () => {
    const { orderItem, comboItemDetailOfItem, comboItemAll } = this.props;
    const { textSearch } = this.state;
    let newArray = []
    if (comboItemAll.length > 0) {
      if (textSearch !== null && textSearch !== "" && comboItemDetailOfItem.length > 0) {
        newArray = comboItemDetailOfItem.filter(function (item) {
          const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
          const textData = textSearch.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        this.setState({ dataFilter: newArray, isSearch: true })
      }

    } else if (comboItemAll.length <= 0) {
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

  onSearchOrder = async () => {
    const {
      nameCustomer,
      idOrder,
      sdtOrder,
      isCheckCreate,
      isCheckPay,
      isCheckDelivery,
      isCheckCancel
    } = this.state;
    let order_status_id = `[`;
    if (isCheckCreate === true) {
      order_status_id += `1`;
    }
    if (isCheckPay && isCheckCreate) {
      order_status_id += `,`;
    }
    if (isCheckPay === true) {
      order_status_id += `2`;
    }
    /*
    if (isCheckDelivery && (isCheckPay || isCheckCreate)) {
      order_status_id += `,`;
    }
    if (isCheckDelivery === true) {
      order_status_id = ``;
    } */
    if ((isCheckCreate || isCheckPay || isCheckDelivery) && isCheckCancel === true)
    {
      order_status_id += `,`;
    }
    if (isCheckCancel === true) {
      order_status_id += `31,32`;
    }
    order_status_id += `]`;
    if (order_status_id === `[]`) {
      order_status_id = `[1,2,31,32]`;
    }
    console.log("order_status_id", order_status_id)
    await this.props.actions.getOrderForm({
      page: 1,
      limit: 100,
      order_no: idOrder,
      customer_name: nameCustomer,
      customer_tel: sdtOrder,
      order_status_id: order_status_id,
      isSearch: true
    });
  }

  render() {
    console.log("order List", this.state.orderForm, this.state.hasMore);
    const {
      isTakeawayList, showPopupSelectedList, showPopupPayments, selectedDishes,
      totalBill, surchange, voucher_code, order_no, selected, selectedAll, listView,
      page, comboName, selectedCategory, slickIndex, slickIndex1,
      totalQtySelected, hasMore, orderForm,
      slickIndex2, qtyItem, nameCustomer, idOrder, sdtOrder, isCheckCreate,
      isCheckPay,
      isCheckDelivery,
      isCheckCancel,
      isClick, fixedMain, dataFilter, isSearch, textSearch
    } = this.state;
    const { t, orderItem, partnerSetting,
      categoryItemList, orderItemById, itemList,
      comboItemDetail, comboItemDetailOfItem,
      comboItemListItem,
      comboItemList, comboItemAll, lng, ...rest } = this.props;
    const settingsForCombo = {
      infinite: false,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 5,
      afterChange: current => this.setState({ slickIndex: current }),
      arrows: false
    };

    const settingsForCategory = {
      infinite: false,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 5,
      afterChange: current2 => this.setState({ slickIndex2: current2 }),
      arrows: false
    };

    const settings = {
      infinite: false,
      speed: 500,
      slidesToShow: 5,
      slidesPerRow: 2,
      // slidesToScroll: 5,
      afterChange: current1 => this.setState({ slickIndex1: current1 }),
      arrows: false,
      responsive: [
        {
          breakpoint: 1500,
          settings: {
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesPerRow: 3,
            slidesToScroll: 4,
            afterChange: current1 => this.setState({ slickIndex1: current1 }),
            arrows: false,
          },
        },
        {
          breakpoint: 1252,
          settings: {
            infinite: false,
            speed: 500,
            slidesToShow: 3,
            slidesPerRow: 2,
            slidesToScroll: 3,
            afterChange: current1 => this.setState({ slickIndex1: current1 }),
            arrows: false,
          },
        },
        {
          breakpoint: 938,
          settings: {
            infinite: false,
            speed: 500,
            slidesToShow: 2,
            slidesPerRow: 2,
            slidesToScroll: 2,
            afterChange: current1 => this.setState({ slickIndex1: current1 }),
            arrows: false,
          },
        },
        {
          breakpoint: 630,
          settings: {
            infinite: false,
            speed: 500,
            slidesToShow: 1,
            slidesPerRow: 2,
            slidesToScroll: 1,
            afterChange: current1 => this.setState({ slickIndex1: current1 }),
            arrows: false,
          },
        },
      ],
    };
    const is_table = get("is_table");
    var countNotCombo = 0;
    for (let i = 0; i < comboItemList.length; i++) {
      if (comboItemList[i].is_price === false) {
        countNotCombo++;
      }
    }

    let unit_price = "";
    if (partnerSetting && partnerSetting.currency) {
      if (lng === "vi") {
        unit_price = partnerSetting.currency.name_vn;
      } else if (lng === "en") {
        unit_price = partnerSetting.currency.name_en;
      } else if (lng === "jp") {
        unit_price = partnerSetting.currency.name_jp;
      }
    } else {
      unit_price = "VNĐ";
    }
    return (
      <div className="screen-take-away custom-main">
        <main id="site-main" style={{ paddingTop: 0, paddingBottom: 0 }} className="custom-main">
          <section
            id="main-cont"
            className="container-takeaway-screen-copy"
            style={{ position: "relative", height: "100%" }}>
            <Loading show={this.props.isLoading} />
            {isTakeawayList ? (
              <>{is_table === true ?
                <div className="title-btn-takeaway-bill e-flex content-center">
                  <h2 className="text-center title-takeaway orange-tit main-tit">
                    {t("takeaway.title")}
                  </h2>
                  <Button
                    className="btn-takeaway"
                    onClick={() => { this.hiddenHeaderFoodList()}}
                  >
                    <FontAwesomeIcon icon={faPlusCircle} /> {t("takeaway.btnTakeaway")}
                  </Button>
                </div> : <div className="title-btn-takeaway-bill e-flex content-center">
                  <h2 className="text-center title-takeaway orange-tit main-tit">
                  {t("takeaway.order")}
                </h2>
                  <Button
                    className="btn-takeaway"
                    onClick={() => { this.hiddenHeaderFoodList()}}
                  >
                    <FontAwesomeIcon icon={faPlusCircle} /> {t("takeaway.btn-order")}
                  </Button>
                </div>}
                {/* search */}
                <div className="input-search">
                  <Input
                    className="e-m-bottom-5"
                    type="text"
                    placeholder="Nhập tên khách hàng..."
                    defaultValue={this.state.nameCustomer}
                    onChange={(e) => this.setState({ nameCustomer: e.target.value ? e.target.value : "" })}
                  />
                  <Input
                    className="e-m-bottom-5 e-m-left-20"
                    type="text"
                    placeholder="Nhập mã hóa đơn..."
                    defaultValue={this.state.idOrder}
                    onChange={(e) => this.setState({ idOrder: e.target.value ? e.target.value : "" })}
                  />
                  <Input
                    className="e-m-bottom-5 e-m-left-20"
                    type="text"
                    placeholder="Nhập số điện thoại..."
                    defaultValue={this.state.sdtOrder}
                    onChange={(e) => this.setState({ sdtOrder: e.target.value ? e.target.value : "" })}
                  />
                </div>

                <div className="status-search">
                  <div className="status-search-list">
                    <div className="status-search-list-ul">
                      <div className={`status-search-list-li ${isCheckCreate === true ? 'status-search-list-checked' : ""}`} onClick={() => this.setState({ isCheckCreate: !isCheckCreate })}>
                        {/* <FontAwesomeIcon className={`${isCheckCreate === true ? 'dislay' : 'hidden'}`} icon={faCheck} /> */} Chưa thanh toán
                    </div>
                      <div className={`status-search-list-li ${isCheckPay === true ? 'status-search-list-checked' : ""}`} onClick={() => this.setState({ isCheckPay: !isCheckPay })}>
                        {/* <FontAwesomeIcon className={`${isCheckPay === true ? 'dislay' : 'hidden'}`} icon={faCheck} /> */} Đã thanh toán
                    </div>
                      <div className={`status-search-list-li ${isCheckDelivery === true ? 'status-search-list-checked' : ""}`} onClick={() => this.setState({ isCheckDelivery: !isCheckDelivery })}>
                        {/* <FontAwesomeIcon className={`${isCheckDelivery === true ? 'dislay' : 'hidden'}`} icon={faCheck} /> */} Đã giao hàng
                    </div>
                      <div className={`status-search-list-li ${isCheckCancel === true ? 'status-search-list-checked' : ""}`} onClick={() => this.setState({ isCheckCancel: !isCheckCancel })}>
                        {/* <FontAwesomeIcon className={`${isCheckCancel === true ? 'dislay' : 'hidden'}`} icon={faCheck} /> */} Đã hủy
                    </div>
                    </div>
                  </div>
                  <div>
                    <Button className="status-search-btn" onClick={this.onSearchOrder}>
                      <FontAwesomeIcon
                        icon={faSearch}
                        style={{
                          fontSize: 14,
                          verticalAlign: "middle",
                        }}
                      />
                      {"  "}Tìm kiếm
                  </Button>
                  </div>
                </div>

                {/* Danh Sach Order */}
                <div id="scrollableDivTakeaway">
                  <InfiniteScroll
                    dataLength={orderForm?.length}
                    next={this.fetchOrders} //this.fetchOrders()
                    hasMore={hasMore}
                    scrollableTarget="scrollableDivTakeaway"
                  ><div className="cs-flex cs-wrap takeaway-bill-list-order e-row">
                      {orderForm?.length > 0 ? orderForm.map((infoOrder, i) => {
                        if (infoOrder.is_takeaway === true) {
                          return <TakeawayBill t={t} key={i}
                            showPopupPayments={(totalBill, order_no, surchange, voucher_code, billInfo) => {
                              this.setState({ showPopupPayments: true, totalBill, order_no, surchange, voucher_code, billInfo });
                            }}
                            close={() => { this.setState({ showPopupSelectedList: false }) }}
                            billInfo={infoOrder}
                            dishList={selectedDishes}
                            changePage={this.changePage}
                            unit_price={unit_price}
                            accountInfoStaff={this.state.accountInfoStaff}
                            getOrderForm={this.getOrderForm}
                            {...rest} />
                        }
                      }
                      ) : <div className="empty-data" style={{ margin: "auto" }}>
                        <img src={notFound} />
                        <p>{t("detailRestaurant.notFound")}</p>
                      </div>}
                    </div>
                  </InfiniteScroll>
                </div>
              </>) : (
              <div className="main-list-takeaway-bill">
                <div className="hori-header">
                  <div className="e-container">
                    <div className="top-header">
                      <div className="btn-back" onClick={this.backOrderList}><FontAwesomeIcon style={{ fontSize: "24px" }} icon={faArrowLeft} /></div>
                      <div className="text-header">
                        {t("takeaway.foodList")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="body-food-takeaway">
                  <div className="e-container e-flex custom-container">
                    <div className="table-list">
                      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                        {
                          comboItemAll && comboItemAll.length <= 0 ? null :
                            <div className="content-center e-m-bottom-10" style={{ marginBottom: comboItemAll && comboItemAll.length <= 0 ? "0px" : "10px", height: "55px" }}> {/* Chỉnh row suất ăn */}
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
                                          <Button key={index} className={`${selected === index
                                            ? "orange-TableListScreen-combo" : "blue-TableListScreen-combo"}`}
                                            onClick={() => this.selectedComboItem(item.id, item.name, index)}
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
                                    <div className="btn-all-catogory">
                                      <Button className={`${selectedCategory === -1
                                        ? "orange-category-TakeAwayScreen-table-list" : "gray-TakeAwayScreen"}`}
                                        onClick={() => { this.selectedCategoryItem("", -1) }}
                                      >
                                        {t("takeaway.all")}
                                      </Button>
                                    </div>
                                    {categoryItemList.map((item, index) =>
                                      <Button key={index} className={`${selectedCategory === index ? "orange-category-TakeAwayScreen-table-list" : "gray-TakeAwayScreen"}`}
                                        onClick={() => { this.selectedCategoryItem(item.name, index) }}
                                      >
                                        {item.name}
                                      </Button>
                                    )}
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
                            {comboItemAll && comboItemAll.length <= 0 ?
                              (orderItem.length === 0 ? (this.noFood())
                                : dataFilter.length === 0 && !isSearch || textSearch === null ? orderItem.map((item1, index1) =>
                                  <CategoryItem choose={(qty, item) =>
                                    this.choose(qty, item)} key={index1}
                                    selectedDishes={selectedDishes} item={item1} t={t} partnerSetting={partnerSetting}
                                    dataPromotion={this.state.itemPromotion} />) :
                                  textSearch !== "" && dataFilter.length > 0 && isSearch ?
                                    dataFilter.map((item1, index1) =>
                                      <CategoryItem choose={(qty, item) =>
                                        this.choose(qty, item)} key={index1}
                                        selectedDishes={selectedDishes} item={item1} t={t} partnerSetting={partnerSetting}
                                        dataPromotion={this.state.itemPromotion} />) : <div className="empty-data">
                                      <img src={notFound} />
                                      <p>{t("detailRestaurant.notFound")}</p>
                                    </div>
                              )
                              :
                              (comboItemDetailOfItem.length === 0 ? (this.noFood()) :
                                dataFilter.length === 0 && !isSearch || textSearch === null ?
                                  comboItemDetailOfItem.map((item1, index1) =>
                                    <CategoryItem choose={(qty, item) =>
                                      this.choose(qty, item)} key={index1}
                                      selectedDishes={selectedDishes} item={item1} t={t} partnerSetting={partnerSetting}
                                      dataPromotion={this.state.itemPromotion} />) :
                                  textSearch !== "" && dataFilter.length > 0 && isSearch ?
                                    dataFilter.map((item1, index1) =>
                                      <CategoryItem choose={(qty, item) =>
                                        this.choose(qty, item)} key={index1}
                                        selectedDishes={selectedDishes} item={item1} t={t} partnerSetting={partnerSetting}
                                        dataPromotion={this.state.itemPromotion} />)
                                    : <div className="empty-data">
                                      <img src={notFound} />
                                      <p>{t("detailRestaurant.notFound")}</p>
                                    </div>)
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
                        openPopupSelectedList={this.openPopupSelectedList}
                        backOrderList={this.backOrderList}
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
                {/* <h2 className="text-center orange-tit main-tit"
                  style={{ height: "50px" }}>
                  {t("takeaway.foodList")}
                </h2>
                { partnerSetting.is_combo === false ? null :
                  <div className="content-center top-acts-1"
                    style={{
                      marginBottom: partnerSetting.is_combo === false ? "0px" : "10px"
                    }}>
                    <div className="top-acts flex-view middle e-flex item-center content-center">
                      <div className="slick-initialized slick-slider">
                        {comboItemList.length < 1 || partnerSetting.is_combo === false ? null : (
                          <button
                            className={`slick-arrow arrow-left slick-prev ${slickIndex !== 0 ? null : "slick-disabled"
                              }`}
                            aria-disabled="true"
                            style={{ display: "block", top: `calc(50% - 1.875em)` }}
                            onClick={this.previous}
                          ></button>
                        )}
                        <div className="slick-list draggable list-slider-track-1">
                          <div className="slick-track-tops-1" >
                            <Slider ref={c => (this.slider = c)} {...settingsForCombo}>
                              {comboItemList.map((item, index) =>
                                <Button key={index} className={`${selected === index
                                  ? "blue-TakeAwayScreen" : "orange-TakeAwayScreen"}`}
                                  onClick={() => this.selectedComboItem(item.id, item.name, index)}
                                  disabled={selected === index ? true : false}
                                >
                                  {item.name}
                                </Button>
                              )}
                            </Slider>
                          </div>
                        </div>
                        {comboItemList.length < 1 || partnerSetting.is_combo === false ? null : (
                          <button
                            className={`slick-arrow arrow-right slick-next
                            ${slickIndex === Math.floor(countNotCombo / 6) * 6
                                ? "slick-disabled" : null
                              }`}
                            style={{ display: "block", top: `calc(50% - 1.875em)` }}
                            onClick={this.next}
                          ></button>
                        )}
                      </div>
                    </div>
                  </div>}
                <div className="top-acts-2 top-acts flex-view middle">
                  <span className="ordered-food e-flex item-center">
                    <Button type="s2"
                      style={{
                        background: "#2699fb",
                        alignItems: "center"
                      }}
                      onClick={this.openPopupSelectedList}
                    >
                      {t("takeaway.orderedFood")}
                    </Button>
                    <span className="total-qty">{totalQtySelected}</span>
                  </span>
                  <div className="list-catogory slick-initialized slick-slider">
                    {categoryItemList.length < 1 ? null : (
                      <button
                        className={`slick-arrow arrow-left slick-prev
                           ${slickIndex2 !== 0 ? null : "slick-disabled"
                          }`}
                        aria-disabled="true"
                        style={{ display: "block", top: `calc(50% - 1.7em)` }}
                        onClick={this.previous2}
                      ></button>
                    )}
                    <div className="lst-catogory draggable">
                      <div className="slick-track content-list-catogory">
                        <Slider ref={c => (this.slider2 = c)} {...settingsForCategory}>
                          <div className="btn-all-catogory">
                            <Button className={`${selectedCategory === -1
                              ? "orange-category-TakeAwayScreen btn-catogory" : "gray-TakeAwayScreen"}`}
                              onClick={() => { this.selectedCategoryItem("", -1) }}
                            >
                              {t("takeaway.all")}
                            </Button>
                          </div>
                          {categoryItemList.map((item, index) =>
                            <Button key={index} className={`${selectedCategory === index ? "orange-category-TakeAwayScreen" : "gray-TakeAwayScreen"}`}
                              onClick={() => { this.selectedCategoryItem(item.name, index) }}
                            >
                              {item.name}
                            </Button>
                          )}
                        </Slider>
                      </div>
                    </div>
                    {categoryItemList.length < 1 ? null : (
                      <button
                        className={`slick-arrow arrow-right slick-next
                          ${slickIndex2 === Math.floor(categoryItemList.length / 8) * 8
                            ? "slick-disabled"
                            : null
                          }`}
                        style={{ display: "block", top: `calc(50% - 1.7em)` }}
                        onClick={this.next2}
                      ></button>
                    )}
                  </div>
                </div>
                <div className="slick-initialized slick-slider top-acts-3 top-acts flex-view middle">
                  {partnerSetting.is_combo === false ?
                    (orderItem.length < 1 ? null :
                      <button
                        className={`slick-arrow arrow-left slick-prev ${slickIndex1 !== 0 ? null : "slick-disabled"
                          }`}
                        aria-disabled="true"
                        style={{ display: "block", top: `calc(50% - 1.875em)` }}
                        onClick={page !== 1 ? this.previous1 : () => { }}
                      ></button>)
                    : ((comboName !== "" ? comboItemDetailOfItem.length < 1 : comboItemListItem.length < 1) ? null : (
                      <button
                        className={`slick-arrow arrow-left slick-prev ${slickIndex1 !== 0 ? null : "slick-disabled"
                          }`}
                        aria-disabled="true"
                        style={{ display: "block", top: `calc(50% - 1.875em)` }}
                        onClick={page !== 1 ? this.previous1 : () => { }}
                      ></button>
                    ))}
                  <div className="slick-list draggable content-slide-lst-food e-flex content-center"
                  >
                    <div className="detail-list"
                    ><Slider ref={c => (this.slider1 = c)} {...settings} >
                        {!partnerSetting.is_combo ?
                          (orderItem.length === 0 ? (this.noFood())
                            : orderItem.map((item1, index1) =>
                              <CategoryItem choose={(qty, item) =>
                                this.choose(qty, item)} key={index1}
                                selectedDishes={selectedDishes} item={item1} t={t} isClickOrder={isClick} dataPromotion={this.state.itemPromotion}/>))
                          : (comboName !== "" ?
                            (comboItemDetailOfItem.length === 0 ? (this.noFood()) :
                              comboItemDetailOfItem.map((item1, index1) =>
                                <CategoryItem choose={(qty, item) =>
                                  this.choose(qty, item)} key={index1}
                                  selectedDishes={selectedDishes} item={item1} t={t} isClickOrder={isClick} dataPromotion={this.state.itemPromotion}/>))
                            : comboItemListItem.length === 0 ? (this.noFood()) :
                              comboItemListItem.map((item3, index3) =>
                                <CategoryItem
                                  choose={(qty, item) => this.choose(qty, item)} key={index3}
                                  item={item3}
                                  selectedDishes={selectedDishes} t={t} isClickOrder={isClick} dataPromotion={this.state.itemPromotion}/>))
                        }
                      </Slider>
                    </div>
                  </div>
                  {partnerSetting.is_combo === false
                    ? (orderItem.length < 1 ? null : <button
                      className={`slick-arrow arrow-right slick-next ${page === Math.ceil(orderItem.length / qtyItem)
                        ? "slick-disabled"
                        : null
                        }`}
                      style={{ display: "block", top: `calc(50% - 1.875em)` }}
                      onClick={page !== Math.ceil(orderItem.length / qtyItem) ? this.next1 : () => { }}
                    ></button>)
                    : ((comboName !== "" ? comboItemDetailOfItem.length < 1 : comboItemListItem.length < 1) ? null : (
                      <button
                        className={`slick-arrow arrow-right slick-next ${(comboName === "" ? page === Math.ceil(comboItemListItem.length / qtyItem) : page === Math.ceil(comboItemDetailOfItem.length / qtyItem))
                          ? "slick-disabled"
                          : null
                          }`}
                        style={{ display: "block", top: `calc(50% - 1.875em)` }}
                        onClick={page !== Math.ceil(comboItemListItem.length / qtyItem) ? this.next1 : () => { }}
                      ></button>
                    ))}
                </div>
                <div className="paginate-order">
                  {!partnerSetting.is_combo ?
                    <div className="number-page page-no-combo">
                      <img src={image}
                        alt="Khong co hinh anh***" />
                      <span className="itemList-number-page-current">{page}</span>
                      <span className="itemList-number-page-total">{Math.ceil(orderItem.length / qtyItem)}</span>
                    </div> : <div className="page-is-combo number-page">
                      <img
                        src={image}
                        alt="Khong co hinh anh***" />
                      <span className="itemList-number-page-current">
                        {page}</span>
                      <span className="itemList-number-page-total">
                        {comboName !== ""
                          ? Math.ceil(comboItemDetailOfItem.length / qtyItem)
                          : Math.ceil(comboItemListItem.length / qtyItem)}
                      </span>
                    </div>
                  }
                </div> */}
                {showPopupSelectedList ? <PopupSelectedList
                  t={t}
                  show={showPopupSelectedList}
                  close={() => { this.setState({ showPopupSelectedList: false }) }}
                  showPopupPayments={(totalBill, order_no, surchange, voucher_code) => {
                    this.setState({ showPopupPayments: true, totalBill, order_no, surchange, voucher_code });
                  }}
                  dishList={selectedDishes}
                  onPlus={this.onPlus}
                  onMinus={this.onMinus}
                  onChangeQuantity={this.onChangeQuantity}
                  onDelete={this.onDelete}
                  onOrder={this.onOrder}
                  onAddNote={this.onAddNote}
                  onCheckedTakeaway={this.onCheckedTakeaway}
                  changePage={this.changePage}
                  order_id={this.props.orderId}
                  unit_price={unit_price}
                  billInfo={this.state.billInfo}
                  showPopupSelectedList_confirm_food={this.state.showPopupSelectedList_confirm_food}
                  onShowPopupSelectedList_confirm_food={this.onShowPopupSelectedList_confirm_food}
                  {...rest}
                /> : null}
              </div>
            )}

            {showPopupPayments ? <PopupPayments
              t={t}
              dishList={selectedDishes}
              show={showPopupPayments}
              close={() => this.setState({ showPopupPayments: false, selectedDishes: [], totalQtySelected: 0 })}
              totalBill={totalBill}
              surchange={surchange}
              voucher_code={voucher_code}
              order_id={order_no}
              order_no={this.props.orderItemById.order_no}
              changePage={this.changePage}
              billInfo={this.state.billInfo}
              unit_price={unit_price}
              orderItemById={this.props.orderItemById}
              {...rest}
            /> : null}
          </section>
        </main>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state[TableListReducerName],
    ...state[name],
  };
};
const mapDispatchToProps = (dispatch) => {
  const actions = {
    ...action,
    ...tableListActions,
  };
  return {
    tableListActions: bindActionCreators({ ...tableListActions }, dispatch), actions: bindActionCreators({ ...action }, dispatch),
  };

};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(withNamespaces()(TakeAwayScreen));

