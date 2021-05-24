/**
 * @file reducer
 */

// Using to control stage

import freeze from "deep-freeze";
import { handleActions } from "redux-actions";
import * as actions from "./actions";
export const name = "TakeAway";

const initialState = freeze({
  comboItemDetail: [],
  comboItemDetailOfItem: [],
  comboItemList: [],
  comboItemListItem: [],
  partnerSetting: {},
  categoryItemList: [],
  itemList: [],
  orderForm: [],
  isLoading: false,
  isError: false,
  orderItemById: {},
  totalItem: 0,
  userInfo: {},
  orderId: "",
  partnerById: {},
  orderTotal: 0,
  orderLengthCurrent: 0,
  orderItem: [],
  voucher: null,
  errorMessageCheckVoucher: "",
  billInfoById: {},
});

export default handleActions(
  {
    [actions.getOrderItem]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getOrderItemSuccess]: (state, action) => {
      return freeze({
        ...state,
        orderItem: action.payload,
        isLoading: false
      })
    },
    [actions.getOrderItemFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      })
    },
    [actions.getPartnerSetting]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getPartnerSettingSuccess]: (state, action) => {
      return freeze({
        ...state,
        partnerSetting: action.payload.data,
        isLoading: false
      })
    },
    [actions.getPartnerSettingFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      })
    },
    [actions.getPartnerById]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getPartnerByIdSuccess]: (state, action) => {
      return freeze({
        ...state,
        partnerById: action.payload.data,
        isLoading: false
      })
    },
    [actions.getPartnerByIdFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      })
    },
    [actions.getComboById]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getComboByIdSuccess]: (state, action) => {
      let arrayTemp = [];
      for (var index = 0; index < action.payload.length; index++) {
        for (var index1 = 0; index1 < action.payload[index].items.length; index1++) {
          arrayTemp.push(action.payload[index].items[index1]);
        }
      }
      return freeze({
        ...state,
        /* comboItemDetail: action.payload.data, */
        comboItemDetailOfItem: arrayTemp,
        isLoading: false
      })
    },
    [actions.getComboByIdFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      })
    },
    /**
     * list combo and list item get by id combo
     */
    [actions.getComboItemList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getComboItemListSuccess]: (state, action) => {
      let { dataByComboId, comboItemDetail } = action.payload;
      let lstData = [];
      for (var index = 0; index < dataByComboId.length; index++) {
        for (var index1 = 0; index1 < dataByComboId[index].items.length; index1++) {
          lstData.push(dataByComboId[index].items[index1]);
        }
      }
      return freeze({
        ...state,
        comboItemList: action.payload.comboFalse,
        // comboItemListItem: action.payload.arrayTemp,
        comboItemListItem: lstData,
        comboItemDetail,
        comboItemDetailOfItem: action.payload.arrayTemp,
        isLoading: false
      });
    },
    [actions.getComboItemListFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    [actions.getCategoryItemList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getCategoryItemListSuccess]: (state, action) => {
      return freeze({
        ...state,
        categoryItemList: action.payload.data,
        isLoading: false
      });
    },
    [actions.getCategoryItemListFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    [actions.getItemList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getItemListSuccess]: (state, action) => {
      return freeze({
        ...state,
        itemList: action.payload.data,
        totalPage: Math.ceil(action.payload.total / 10),
        isLoading: false,
      });
    },
    [actions.getItemListFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },
    //////////////////////////////////////////
    [actions.getOrderItemById]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getOrderItemByIdSuccess]: (state, action) => {
      return freeze({
        ...state,
        orderItemById: action.payload.data,
        isLoading: false,
      });
    },
    [actions.getOrderItemByIdFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },
    //////////////////////////////////////////
    [actions.paymentOrder]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.paymentOrderSuccess]: (state, action) => {
      return freeze({
        ...state,
        orderForm: action.payload.data,
        isLoading: false,
      });
    },
    [actions.paymentOrderFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },
    ////////////////////////////////////////////////////////////////
    [actions.getOrderForm]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getOrderFormSuccess]: (state, action) => {
      console.log("order reducer", action.payload)
      return freeze({
        ...state,
        orderForm: (action.payload.check === true ? action.payload.data : JSON.stringify(state.orderForm) === JSON.stringify(action.payload.data) ? state.orderForm : state.orderForm.concat(action.payload.data)),
        orderTotal: action.payload.total,
        /* orderLengthCurrent: state.orderLengthCurrent + action.payload.data.length, */
        isLoading: false,
      });
    },
    [actions.getOrderFormFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },
    ////////////////////////////////////////////////////////////////
    [actions.createOrder]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.createOrderSuccess]: (state, action) => {
      console.log("order Id reducer", action.payload[0].order_id)
      return freeze({
        ...state,
        orderId: action.payload[0].order_id,
        orderForm: action.payload[1].data,
        isLoading: false,
      });
    },
    [actions.createOrderFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },
    ////////////////////////////////////////////////////////////////
    [actions.deleteOrder]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.deleteOrderSuccess]: (state, action) => {
      /* const newOrderForm = state.orderForm.filter(
        (form) => form.id !== action.payload.order_id
      ); */
      return freeze({
        ...state,
        /* orderForm: newOrderForm, */
        orderForm: action.payload.data,
        isLoading: false,
      });
    },
    [actions.deleteOrderFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },
    [actions.getAccountInfo]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getAccountInfoSuccess]: (state, action) => {
      return freeze({
        ...state,
        userInfo: action.payload.data,
        isLogined: true,
        isLoading: false,
      });
    },
    [actions.getAccountInfoFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message,
      });
    },
    //////////////////////////////////////////
    [actions.deliveryConfirm]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.deliveryConfirmSuccess]: (state, action) => {
      return freeze({
        ...state,
        orderForm: action.payload.data,
        isLoading: false,
      });
    },
    [actions.deliveryConfirmFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },
    [actions.getCheckVoucher]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getCheckVoucherSuccess]: (state, action) => {
      return freeze({
        ...state,
        voucher: action.payload.data,
        isLoading: false,
      });
    },
    [actions.getCheckVoucherFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessageCheckVoucher: action.payload.data.error.internal_message,
      });
    },
    [actions.getBillInfoById]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getBillInfoByIdSuccess]: (state, action) => {
      return freeze({
        ...state,
        billInfoById: action.payload.data,
        isLoading: false
      })
    },
    [actions.getBillInfoByIdFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      })
    },
  },
  initialState
);
