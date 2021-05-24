import * as ACTION_TYPES from './actionTypes';
import { createAction } from "redux-actions";

export const getOrderDetail = createAction(ACTION_TYPES.GET_ORDER_DETAIL)
export const getOrderDetailSuccess = createAction(ACTION_TYPES.GET_ORDER_DETAIL_SUCCESS)
export const getOrderDetailFailure = createAction(ACTION_TYPES.GET_ORDER_DETAIL_FAILURE)

export const selectPaymentMethod = createAction(ACTION_TYPES.SELECT_PAYMENT_METHOD)
export const deSelectPaymentMethod = createAction(ACTION_TYPES.DESELECT_PAYMENT_METHOD)

export const getInfoPartner = createAction(ACTION_TYPES.GET_INFO_PARTNER)
export const getInfoPartnerSuccess = createAction(ACTION_TYPES.GET_INFO_PARTNER_SUCCESS)
export const getInfoPartnerFail = createAction(ACTION_TYPES.GET_INFO_PARTNER_FAIL)