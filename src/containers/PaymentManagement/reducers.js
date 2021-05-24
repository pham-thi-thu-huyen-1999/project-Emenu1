import freeze from "deep-freeze";
import { handleActions } from "redux-actions";
import * as actions from "./actions";

const initialState = freeze({
  orderDetail: null,
  isLoading: false,
  selectedPaymentMethod: null,
  infoPartner: {}
})

const PaymentReducerName = "PaymentManagement";

const PaymentReducer =  handleActions(
  {
    // Get order detail
    [actions.getOrderDetail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getOrderDetailSuccess]: (state, action) => {
      return freeze({
        ...state,
        orderDetail: action.payload.orderDetail,
        isLoading: false
      })
    },
    [actions.getOrderDetailFailure]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      })
    },
    // Select payment method
    [actions.selectPaymentMethod]: (state, action) => {
      return freeze({
        ...state,
        selectedPaymentMethod: action.payload.payment_method
      })
    },
    [actions.deSelectPaymentMethod]: (state, action) => {
      return freeze({
        ...state,
        selectedPaymentMethod: null
      })
    },
    /** info partner by id */
    [actions.getInfoPartner]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getInfoPartnerSuccess]: (state, action) => {
      return freeze({
        ...state,
        infoPartner: action.payload.partnerInfo,
        isLoading: false
      })
    },
    [actions.getInfoPartnerFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      })
    },
  },
  initialState
)

export {
  PaymentReducerName,
  PaymentReducer
}