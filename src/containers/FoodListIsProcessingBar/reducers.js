/**
 * @file reducer
 */

// Using to control stage

import freeze from "deep-freeze";
import { handleActions } from "redux-actions";
import * as actions from "./actions";
import * as CONSTS from "./constants";
import pagination from "../../utils/pagination";
import { get } from "../../services/localStorage";
import common from "../../utils/common";
export const name = "FoodListIsProcessingBar";

const initialState = freeze({
  areaList: [],
  order: [],
  orderFoodList: [],
  orderListAccourdingToTable: [],
  orderListAccourdingToTableFull: [],
  subcribeAreaList: [],
  userId: null,
  orderIdGetDish: "",
  hasReloadOrder: false,
  dataGetTabDish: null,
  showMessage: false,
  selectedAreaIndex: [],
  notiData: {},
  isLoading: false,
  isError: false,
});

export default handleActions(
  {
    //////////////////////////////////////////////////////////
    [actions.getAreaList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getAreaListSuccess]: (state, action) => {
      return freeze({
        ...state,
        areaList: action.payload.data,
        isLoading: false,
      });
    },
    [actions.getAreaListFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },

    ///////////////////////////////////////////////////////////
    [actions.getOrderFoodList]: (state, action) => {
      return freeze({
        ...state,
        dataGetTabDish: { ...action.payload.data },
        isLoading: true,
      });
    },
    [actions.getOrderFoodListSuccess]: (state, action) => {
      let orderFoodList = [...action.payload.data];
      let selectedAreaIndex = state.dataGetTabDish.selectedAreaIndex ? [...state.dataGetTabDish.selectedAreaIndex] : []
      orderFoodList = selectedAreaIndex.length === 0 || selectedAreaIndex.length === state.areaList.length ? [...orderFoodList] : orderFoodList.filter(item => {
        let areaId = item.order && item.order.table && item.order.table.area && item.order.table.area.id;
        if (areaId && selectedAreaIndex.includes(areaId)) {
          return true;
        }
        return false;
      })
      return freeze({
        ...state,
        orderFoodList,
        isLoading: false,
      });
    },
    [actions.getOrderFoodListFail]: (state, action) => {
      return freeze({
        ...state,
        dataGetTabDish: null,
        isError: true,
        isLoading: false,
      });
    },

    ///////////////////////////////////////////////////////////
    [actions.getOrderByTable]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getOrderByTableSuccess]: (state, action) => {
      // Lọc chỉ lấy những order có tồn tại món ăn đang ở trạng thái chờ
      let orderListAccourdingToTableFull = action.payload.data.filter(order => order.total_item_waiting !== "0" && order.total_item_waiting !== 0)
      let { selectedAreaIndex } = state;
      const orderListAccourdingToTable = selectedAreaIndex.length === 0 ? [...orderListAccourdingToTableFull] : orderListAccourdingToTableFull.filter(order => {
        if (order.table && order.table.area && order.table.area.id && selectedAreaIndex.includes(order.table.area.id)) {
          return order;
        } else {
          return;
        }
      })
      return freeze({
        ...state,
        orderListAccourdingToTable: [...orderListAccourdingToTable],
        orderListAccourdingToTableFull: [...orderListAccourdingToTableFull],
        isLoading: false,
      });
    },
    [actions.getOrderByTableFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },

    ///////////////////////////////////////////////////////////
    [actions.getDishByOrder]: (state, action) => {
      return freeze({
        ...state,
        orderIdGetDish: action.payload.data.orderId,
        isLoading: true,
      });
    },
    [actions.getDishByOrderSuccess]: (state, action) => {
      let { data } = action.payload;
      let order = []
      order = [...action.payload.data.order_items];
      data.order_combo_items.map(combo => {
        combo.order_items.map(item => {
          order.push(item);
        })
      })
      // Lọc chỉ lấy những món ăn của bar
      order = order.filter(item => item.is_bar === true);
      return freeze({
        ...state,
        order,
        hasReloadOrder: false,
        isLoading: false,
      });
    },
    [actions.getDishByOrderFail]: (state, action) => {
      return freeze({
        ...state,
        orderIdGetDish: null,
        hasReloadOrder: false,
        isError: true,
        isLoading: false,
      });
    },

    //////////////////////////////////////////////////////////
    [actions.updateOrderItemIsOff]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.updateOrderItemIsOffSuccess]: (state, action) => {
      const { order_id } = action.payload.data;
      let orderListAccourdingToTable = state.orderListAccourdingToTable.map(order => {
        if (order.id === order_id) {
          const total_item_waiting = parseInt(order.total_item_waiting) - 1;
          const total_item_off = parseInt(order.total_item_off) + 1;
          return {
            ...order,
            total_item_off,
            total_item_waiting,
          };
        } else {
          return order;
        }
      })
      let orderListAccourdingToTableFull = state.orderListAccourdingToTableFull.map(order => {
        if (order.id === order_id) {
          const total_item_waiting = parseInt(order.total_item_waiting) - 1;
          const total_item_off = parseInt(order.total_item_off) + 1;
          return {
            ...order,
            total_item_off,
            total_item_waiting,
          };
        } else {
          return order;
        }
      })
      // Lọc lại danh sách order để khi order hết món không hiển thị order đó nữa
      orderListAccourdingToTableFull = [...orderListAccourdingToTableFull.filter(order => order.total_item_waiting !== "0" && order.total_item_waiting !== 0)]
      orderListAccourdingToTable = [...orderListAccourdingToTable.filter(order => order.total_item_waiting !== "0" && order.total_item_waiting !== 0)]
      // Lọc lại danh sách order để khi order hết món không hiển thị order đó nữa
      let { hasReloadOrder, orderIdGetDish } = state;
      if (orderListAccourdingToTable.length > 0) {
        let selectedOrder = orderListAccourdingToTable.find(order => order.id === orderIdGetDish)
        hasReloadOrder = selectedOrder ? false : true;
      }
      return freeze({
        ...state,
        isLoading: false,
        orderListAccourdingToTable,
        orderListAccourdingToTableFull,
        hasReloadOrder,
      });
    },
    [actions.updateOrderItemIsOffFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },

    //////////////////////////////////////////////////////////
    [actions.updateOrderItemIsCompleted]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.updateOrderItemIsCompletedSuccess]: (state, action) => {
      const { order_id } = action.payload.data;
      // cập nhật thông tin cho danh sách order hiển thị
      let orderListAccourdingToTable = state.orderListAccourdingToTable.map(order => {
        if (order.id === order_id) {
          const total_item_waiting = parseInt(order.total_item_waiting) - 1;
          const total_item_completed = parseInt(order.total_item_completed) + 1;
          return {
            ...order,
            total_item_completed,
            total_item_waiting,
          };
        } else {
          return order;
        }
      })
      // cập nhật thông tin cho danh sách order gốc
      let orderListAccourdingToTableFull = state.orderListAccourdingToTableFull.map(order => {
        if (order.id === order_id) {
          const total_item_waiting = parseInt(order.total_item_waiting) - 1;
          const total_item_completed = parseInt(order.total_item_completed) + 1;
          return {
            ...order,
            total_item_completed,
            total_item_waiting,
          };
        } else {
          return order;
        }
      })
      // Lọc lại danh sách order để khi order hết món không hiển thị order đó nữa
      orderListAccourdingToTableFull = [...orderListAccourdingToTableFull.filter(order => order.total_item_waiting !== "0" && order.total_item_waiting !== 0)]
      orderListAccourdingToTable = [...orderListAccourdingToTable.filter(order => order.total_item_waiting !== "0" && order.total_item_waiting !== 0)]
      //Check xem có cần lấy danh sách món ăn của order mới không
      let { hasReloadOrder, orderIdGetDish } = state;
      if (orderListAccourdingToTable.length > 0) {
        let selectedOrder = orderListAccourdingToTable.find(order => order.id === orderIdGetDish)
        hasReloadOrder = selectedOrder ? false : true;
      }
      return freeze({
        ...state,
        isLoading: false,
        hasReloadOrder,
        orderListAccourdingToTable,
        orderListAccourdingToTableFull
      });
    },
    [actions.updateOrderItemIsCompletedFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
      });
    },

    //////////////////////////////////////////////////////////

    [actions.setOrderPage]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
        orderPage: action.payload,
      });
    },

    //////////////////////////////////////////////////////////
    [actions.searchOrder]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.searchOrderSuccess]: (state, action) => {
      const { selectedAreaIndex } = action.payload.data;
      const { orderListAccourdingToTableFull } = state;
      const orderListAccourdingToTable = selectedAreaIndex.length === 0 ? [...orderListAccourdingToTableFull] : orderListAccourdingToTableFull.filter(order => {
        if (order.table && order.table.area && order.table.area.id && selectedAreaIndex.includes(order.table.area.id)) {
          return order;
        } else {
          return;
        }
      })
      return freeze({
        ...state,
        orderListAccourdingToTable,
        selectedAreaIndex,
        isLoading: false,
      });
    },
    [actions.searchOrderFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },

    //////////////////////////////////////////////////////////
    [actions.startLoading]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },

    [actions.stopLoading]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
      });
    },

    //////////////////////////////////////////////////////////
    [actions.getUserInfo]: (state, action) => {
      const userId = common.decodeToken(get("accessToken")).sub;
      return freeze({
        ...state,
        userId: userId,
        isLoading: false,
      });
    },

    //////////////////////////////////////////////////////////
    [actions.updateKitchenBar]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
      });
    },
    [actions.updateOrderByNoti]: (state, action) => {
      const data = action.payload ? action.payload.data : {};
      const { order_id, item_id } = data;
      const actionOfNoti = data.action;
      let orderListAccourdingToTable = [...state.orderListAccourdingToTable];
      let orderListAccourdingToTableFull = [...state.orderListAccourdingToTableFull];
      let order = [...state.order];
      switch (actionOfNoti) {
        // cancel a dish in order
        case CONSTS.NOTI_ACTION_CANCEL_ITEM:
          orderListAccourdingToTable = state.orderListAccourdingToTable.map(order => {
            if (order.id === order_id) {
              const total_item_waiting = parseInt(order.total_item_waiting) - 1;
              const total_item_cancel = parseInt(order.total_item_cancel) + 1;
              return {
                ...order,
                total_item_cancel,
                total_item_waiting,
              };
            } else {
              return order;
            }
          })
          orderListAccourdingToTableFull = state.orderListAccourdingToTableFull.map(order => {
            if (order.id === order_id) {
              const total_item_waiting = parseInt(order.total_item_waiting) - 1;
              const total_item_cancel = parseInt(order.total_item_cancel) + 1;
              return {
                ...order,
                total_item_cancel,
                total_item_waiting,
              };
            } else {
              return order;
            }
          })

          if (order_id === state.orderIdGetDish) {
            for (let i = 0; i < order.length; i++) {
              if (order[i].item_id === item_id && order[i].order_item_status && order[i].order_item_status.id === CONSTS.WAITING_ORDER) {
                order[i] = { ...order[i], order_item_status_id: CONSTS.OUTOFF_ORDER,order_item_status: {id: CONSTS.OUTOFF_ORDER} }
                break;
              }
            }
          }
          break;
        // update quantity of dish
        case CONSTS.NOTI_ACTION_CHANGE_ITEM:
          orderListAccourdingToTable = [...state.orderListAccourdingToTable];
          orderListAccourdingToTableFull = [...state.orderListAccourdingToTableFull];
          let qty = parseInt(data.qty);
          if (order_id === state.orderIdGetDish) {
            order = state.order.map(item => {
              if (item.item_id === item_id) {
                return {
                  ...item,
                  qty
                };
              } else {
                return item;
              }
            })
          }
          break;
        // cancel a dish in order
        case CONSTS.NOTI_ACTION_DELIVERY_ITEM:
          orderListAccourdingToTable = state.orderListAccourdingToTable.map(order => {
            if (order.id === order_id) {
              const total_item_waiting = parseInt(order.total_item_waiting) - 1;
              const total_item_completed  = parseInt(order.total_item_completed ) + 1;
              return {
                ...order,
                total_item_completed ,
                total_item_waiting,
              };
            } else {
              return order;
            }
          })
          orderListAccourdingToTableFull = state.orderListAccourdingToTableFull.map(order => {
            if (order.id === order_id) {
              const total_item_waiting = parseInt(order.total_item_waiting) - 1;
              const total_item_completed  = parseInt(order.total_item_completed ) + 1;
              return {
                ...order,
                total_item_completed ,
                total_item_waiting,
              };
            } else {
              return order;
            }
          })
          if (order_id === state.orderIdGetDish) {
            for (let i = 0; i < order.length; i++) {
              if (order[i].item_id === item_id && order[i].order_item_status && order[i].order_item_status.id === CONSTS.WAITING_ORDER) {
                order[i] = { ...order[i], order_item_status_id: CONSTS.COMPLETED_ORDER,order_item_status: {id: CONSTS.COMPLETED_ORDER} }
                break;
              }
            }
          }
          break;
      }
      // Lọc lại danh sách order để khi order hết món không hiển thị order đó nữa
      orderListAccourdingToTableFull = [...orderListAccourdingToTableFull.filter(order => order.total_item_waiting !== "0" && order.total_item_waiting !== 0)]
      orderListAccourdingToTable = [...orderListAccourdingToTable.filter(order => order.total_item_waiting !== "0" && order.total_item_waiting !== 0)]
      //Check xem có cần lấy danh sách món ăn của order mới không
      let { hasReloadOrder, orderIdGetDish } = state;
      if (orderListAccourdingToTable.length > 0) {
        let selectedOrder = orderListAccourdingToTable.find(order => order.id === orderIdGetDish)
        hasReloadOrder = selectedOrder ? false : true;
      }
      return freeze({
        ...state,
        isLoading: false,
        hasReloadOrder,
        orderListAccourdingToTable,
        orderListAccourdingToTableFull,
        order,
      });
    },
    [actions.getParamsTabFood]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
      });
    },
    [actions.showMessageByNoti]: (state, action) => {
      const isShow = action.payload.show;
      const notiData = action.payload.notiData;
      return freeze({
        ...state,
        showMessage: isShow,
        notiData,
        isLoading: false,
      });
    },

    [actions.getInfoStaff]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getInfoStaffSuccess]: (state, action) => {
      let { data } = action.payload;
      console.log(data);
      let subcribeAreaList = data.UserAreas.map(area => {
        return area.area_id;
      })
      console.log(subcribeAreaList)
      return freeze({
        ...state,
        subcribeAreaList,
        isLoading: false,
      });
    },
    [actions.getInfoStaffFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },
    //////////////////////////////////////////////////////////

  },
  initialState
);
