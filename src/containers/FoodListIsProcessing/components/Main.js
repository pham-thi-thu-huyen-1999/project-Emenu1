import React, { Component } from "react";
import Slider from "react-slick";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import FoodAccourdingToTable from "./FoodAccourdingToTable";
import FoodItem from "./FoodItem";
import OrderItem from "./OrderItem";
import PopupDishDetail from "./PopupDishDetail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmokingBan } from "@fortawesome/free-solid-svg-icons";
import * as CONSTS from "./../constants";
import "./style.scss";
import AreaListDetailModal from "./AreaListDetailModal";
import Loading from "../../../components/common/Loading";

function NextArrow() {
  return <div style={{ display: "none" }} />;
}
function PrevArrow() {
  return <div style={{ display: "none" }} />;
}

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      dishChoice: 0,
      areaIndex: [],
      showPopupDishDetail: false,
      showPopupAreaList: false,
      slickIndexOfFood: 0,
      selected: 0,
      selectedOrder: {},
      selectedOrderId: this.props.orderIdGetDish,
      selectedTableName: "",
      areaList: this.props.areaList,
      slickIndexOfOrder: 0,
      areaIdArr: [],
      orderListAccourdingToTable: [],
      settings: {
        infinite: false,
        speed: 400,
        slidesToShow: 2,
        slidesPerRow: 5,
        slidesToScroll: 2,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        afterChange: (current) => { this.setState({ slickIndexOfOrder: current }) },
      },
    };
  }

  /**
   * Thay đổi khu vực
   */
  changeAreaIndex = (selectedIndex) => {
    // Lấy danh sách id của những khu vực được chọn
    let selectedAreaIndex = [];
    for (var i = 0; i < selectedIndex.length; i++) {
      selectedAreaIndex.push(this.props.areaList[selectedIndex[i]].id);
    }

    // cập nhật lại danh sách món ăn khi thay đổi khu vực tab theo món
    this.props.actions.getOrderFoodList({
      data: {
        selectedAreaIndex,
        order_item_status_id: CONSTS.WAITING_ORDER,
      }
    });

    const data = {
      selectedAreaIndex
    }

    // cập nhật lại danh sách món ăn của tab theo order/bàn
    this.props.actions.searchOrder({
      data
    });

    this.setState({
      areaIndex: selectedIndex,
      areaIdArr: selectedAreaIndex,
      selectedOrderId: "",
      selectedTableName: "",
      selectedOrder: null,
    });
  };

  /**
   * Thay đổi order được chọn trong tab theo order/bàn
   */
  onSelectOrder = (orderId, selectedTableName, order) => {
    const data = {
      orderId
    }
    // Gọi api get danh sách món ăn của order mới này
    this.props.actions.getDishByOrder({ data });
    this.setState({
      selectedOrderId: orderId,
      selectedTableName: selectedTableName,
      selectedOrder: order,
    });

  };

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    let settings = this.state.settings;
    let width = window.innerWidth;
    if (width <= 1200) {
      settings.slidesToShow = 1;
      settings.slidesPerRow = 10;
      settings.slidesToScroll = 1;
    } else {
      settings.slidesToShow = 2;
      settings.slidesPerRow = 5;
      settings.slidesToScroll = 2;
    }
    this.setState({
      settings,
    });
  };

  next = () => {
    this.slider.slickNext();
  };

  previous = () => {
    this.slider.slickPrev();
  };

  nextOrder = () => {
    this.props.actions.startLoading();
    this.slider.slickNext();
  };

  previousOrder = () => {
    this.props.actions.startLoading();
    this.slider.slickPrev();
  };


  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      JSON.stringify(nextProps.orderListAccourdingToTable) !==
      JSON.stringify(prevState.orderListAccourdingToTable) ||
      JSON.stringify(nextProps.selectedOrderId) !==
      JSON.stringify(prevState.orderIdGetDish)
    ) {
      const orderList = [...nextProps.orderListAccourdingToTable];
      let { selectedOrderId, selectedOrder, selectedTableName } = prevState;
      selectedOrderId = nextProps.orderIdGetDish;
      selectedOrder = orderList.length > 0
        ? { ...orderList.find(order => order.id === selectedOrderId) }
        : prevState.selectedOrder;
      if (selectedOrder) {
        selectedTableName = selectedOrder.table && selectedOrder.table.name ? nextProps.t('foodProcessing.table_') + selectedOrder.table.name : nextProps.t('foodProcessing.Takeaway') + selectedOrder.order_no
      }

      return {
        selectedOrder,
        selectedOrderId,
        selectedTableName,
      };
    }
    return null;
  }

  render() {
    const rest = this.props;
    let { areaList, orderListAccourdingToTable, t } = this.props;
    const {
      dishChoice,
      areaIdArr,
      dishPage,
      showPopupDishDetail,
      showPopupAreaList,
      areaIndex,
      slickIndexOfOrder,
      slickIndexOfFood,
      selectedOrderId,
      selectedTableName,
      settings,
    } = this.state;
    const settingsForOrders = {
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      afterChange: (current) => this.setState({ slickIndexOfFood: current }),
      arrows: false,
    };

    return (
      <>
        <main id="site-main" className="nofooter food-list-processing">
          <Loading show={this.props.isLoading} />
          <div className="main-title-group">
            <div></div>
            {areaList.length !== 0 && areaList.length !== 1 ?
              (areaIndex.length !== 0 ? (
                <h3
                  className="main-title text-center"
                  onClick={() => this.setState({ showPopupAreaList: true })}
                >
                  {areaIndex.length !== 0 ? (
                    areaIndex.map((value, index) => {
                      if (index < areaIndex.length - 1) {
                        return (
                          <span key={index}>
                            <span>
                              {areaList[value].name}
                              {areaList[value].is_smoke === false ? (
                                <FontAwesomeIcon
                                  style={{ color: "#f27922" }}
                                  icon={faSmokingBan}
                                />
                              ) : null}
                            ,
                          </span>
                          &nbsp;
                          </span>
                        );
                      } else {
                        return (
                          <span key={index}>
                            <span>
                              {areaList[value].name}

                              {areaList[value].is_smoke === false ? (
                                <FontAwesomeIcon
                                  style={{ color: "#f27922" }}
                                  icon={faSmokingBan}
                                />
                              ) : null}
                            </span>
                          &nbsp;
                          </span>
                        );
                      }
                    })
                  ) : (
                    <span>{t("foodProcessing.allArea")}</span>
                  )}
                </h3>
              ) : (
                <div
                  id="sel-area"
                  className="box-sel-area"
                  style={{
                    position: "absolute",
                    right: "1%",
                    top: "12px",
                    marginTop: "0px",
                  }}
                  onClick={() => this.setState({ showPopupAreaList: true })}
                >
                  <span>{t("mainScreen.selectArea")}</span>
                </div>
              )
              ) : null
            }
          </div>

          <div id="processing-dishes" className="clear main-tab-group ">
            <Tabs
              selectedIndex={this.state.tabIndex}
              className="tabs-group"
              onSelect={(tabIndex) => this.setState({ tabIndex, slickIndexOfFood: 0, slickIndexOfOrder: 0 })}
            >
              <TabList className="tab-list tabs-group__title">
                <Tab>{t("foodProcessing.food")}</Tab>
                <Tab>{t("foodProcessing.table")}</Tab>
              </TabList>
              <TabPanel className="tab-panel-food-list">
                <h2 className="text-center main-tit sub-main-title">
                  {this.props.orderFoodList.length > 0
                    ? t("foodProcessing.title")
                    : t("foodProcessing.titleNoFood")}
                </h2>
                <aside
                  className="slider slick-initialized slick-slider food-list-slick"
                  style={{
                    overflowX: "hidden",
                    height: `calc(100vh - 210px)`,
                    overflow: "auto",
                    padding: "0 100px",
                    position: "relative",
                    zIndex: "0",
                  }}
                >
                  {this.props.orderFoodList && this.props.orderFoodList.length !== 0 ?
                    (<>
                      <button
                        className={`img-txt slick-arrow slick-prev  `}
                        aria-disabled="true"
                        style={{
                          display: `${slickIndexOfOrder === 0 ? "none" : "block"}`,
                          left: "0",
                        }}
                        onClick={this.previous}
                      ></button>
                      <div
                        className="draggable"
                        style={{
                          position: "relative",
                          zIndex: "-2",
                        }}
                      >
                        <Slider
                          className="col"
                          ref={(c) => (this.slider = c)}
                          {...settings}
                        >
                          {this.props.orderFoodList.map((item, index) => {
                            return (
                              <FoodItem
                                orderFoodItem={item}
                                key={index}
                                no={index + 1}
                                t={this.props.t}
                                showPopupDishDetail={(dishChoice) =>
                                  this.setState({
                                    showPopupDishDetail: !showPopupDishDetail,
                                    dishChoice,
                                  })
                                }
                              />
                            );
                          })}
                        </Slider>
                      </div>
                      <button
                        className={`img-txt slick-arrow slick-next  `}
                        style={{
                          display: `${(settings.slidesToScroll === 1 ? slickIndexOfOrder >= Math.ceil(this.props.orderFoodList.length / CONSTS.LIMIT_DISH) - 1 : slickIndexOfOrder >= Math.ceil(this.props.orderFoodList.length / CONSTS.LIMIT_DISH) * 2 - 2) ? "none" : "block"
                            }`,
                          right: "0px",
                        }}
                        aria-disabled="false"
                        onClick={this.next}
                      ></button>
                    </>) :
                    (
                      <div className="e-p-50 kitchenbar-text-center" >
                        <div className="">
                          <img src={require("../../../images/no-data.png")} />
                          <div>
                            <span>{t("dishManagament.notiNodata")}</span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                </aside>
              </TabPanel>
              <TabPanel className="tab-panel-order-list">
                <h2 className={orderListAccourdingToTable.length !== 0 ? "text-center main-tit has-order" : "text-center main-tit no-order"}>
                  {
                    orderListAccourdingToTable.length === 0
                      ? t("foodProcessing.titleNoFoodOfTable")
                      : selectedTableName || ""
                  }
                </h2>
                <aside className={orderListAccourdingToTable.length !== 0 ? "tab-panel-order-list__body" : "tab-panel-order-list__body no-order"}>
                  {
                    orderListAccourdingToTable.length > 0 ?
                      (
                        <>
                          <div className="food-accurding-to-table opopup-box inner-box e-m-top-0">
                            {orderListAccourdingToTable.length > 0 ? (
                              <FoodAccourdingToTable
                                selectedOrder={this.state.selectedOrder}
                                dishPage={dishPage}
                                areaIdArr={areaIdArr}
                                {...rest}
                              ></FoodAccourdingToTable>
                            ) : null}
                          </div>

                          <aside
                            className="top-acts flex-view middle order-list"
                            style={{}}
                          >
                            <div
                              className="sets-slider slick-initialized slick-slider"
                              style={{
                                width: "100%",
                              }}
                            >
                              {orderListAccourdingToTable.length < 5 ? null : (
                                <button
                                  className={`slick-arrow arrow-left slick-prev ${slickIndexOfFood > 0 ? null : "slick-disabled"
                                    }`}
                                  aria-disabled="true"
                                  style={{
                                    display: "block",
                                    left: "0",
                                    top: `calc(50% - 30px)`,
                                  }}
                                  onClick={this.previousOrder}
                                ></button>
                              )}
                              <div
                                className="draggable"
                                style={{
                                  width: "100%",
                                }}
                              >
                                <div
                                  className="slick-track e-m-bottom-10"
                                  style={{ width: `calc(100% - 100px)` }}
                                >
                                  <Slider
                                    ref={(c) => (this.slider = c)}
                                    {...settingsForOrders}
                                  >
                                    {orderListAccourdingToTable.map(
                                      (order, index) => (
                                        <OrderItem
                                          orderItem={order}
                                          key={index}
                                          selectedOrderId={selectedOrderId}
                                          onSelectOrder={() => {
                                            this.onSelectOrder(
                                              order.id,
                                              order && order.table && order.table.name ? t('foodProcessing.table_') + order.table.name : t('foodProcessing.Takeaway') + order.order_no,
                                              order,
                                            );
                                          }}
                                          {...rest}
                                        ></OrderItem>
                                      )
                                    )}
                                  </Slider>
                                </div>
                              </div>
                              {orderListAccourdingToTable.length < 5 ? null : (
                                <button
                                  className={`slick-arrow arrow-right slick-next ${orderListAccourdingToTable.length - slickIndexOfFood <= settingsForOrders.slidesToShow ? "slick-disabled" : null
                                    }`}
                                  style={{
                                    display: "block",
                                    right: "0",
                                    top: `calc(50% - 30px)`,
                                  }}
                                  onClick={this.nextOrder}
                                ></button>
                              )}
                            </div>
                          </aside>
                        </>
                      ) :
                      (
                        <div className="e-p-50 kitchenbar-text-center" style={{ flex: "1" }}>
                          <div className="">
                            <img src={require("../../../images/no-data.png")} />
                            <div>
                              <span>{t("dishManagament.notiNodata")}</span>
                            </div>
                          </div>
                        </div>
                      )
                  }


                </aside>
              </TabPanel>
            </Tabs>
          </div>
        </main>
        {showPopupDishDetail ? (
          <PopupDishDetail
            orderFoodItem={dishChoice}
            dishPage={dishPage}
            areaIdArr={areaIdArr}
            {...rest}
            hide={() => this.setState({ showPopupDishDetail: false })}
          />
        ) : null}
        {showPopupAreaList ? (
          <AreaListDetailModal
            areaIndex={areaIndex}
            areaList={this.props.areaList}
            trans={this.props.t}
            hide={() => this.setState({ showPopupAreaList: false })}
            selectArea={(e) => {
              this.changeAreaIndex(e);
            }}
          />
        ) : null}
      </>
    );
  }
}
