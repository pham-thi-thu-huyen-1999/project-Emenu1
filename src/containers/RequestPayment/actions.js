import { createAction } from "redux-actions";
import * as CONST from "./consts";

export const getListReqPayment = createAction(CONST.GETLISTREQUESTPAYMENT);
export const getListReqPaymentSuccess = createAction(CONST.GETLISTREQUESTPAYMENT_SUCCESS);
export const getListReqPaymentFail = createAction(CONST.GETLISTREQUESTPAYMENT_FAIL);

export const getDetailReqPayment = createAction(CONST.GETDETAILREQUESTPAYMENT);
export const getDetailReqPaymentSuccess = createAction(CONST.GETDETAILREQUESTPAYMENT_SUCCESS);
export const getDetailReqPaymentFail = createAction(CONST.GETDETAILREQUESTPAYMENT_FAIL);

export const sendProvisiVote = createAction(CONST.SENDPROVISIVOTE);
export const sendProvisiVoteSuccess = createAction(CONST.SENDPROVISIVOTE_SUCCESS);
export const sendProvisiVoteFail = createAction(CONST.SENDPROVISIVOTE_FAIL);

export const getOrderItemById = createAction(CONST.GETORDERITEMBYID);
export const getOrderItemByIdSuccess = createAction(CONST.GETORDERITEMBYID_SUCCESS);
export const getOrderItemByIdFail = createAction(CONST.GETORDERITEMBYID_FAIL);

export const getInfoDetailProvisiVote = createAction(CONST.GETINFODETAILPROVISIVOTE);
export const getInfoDetailProvisiVoteSuccess = createAction(CONST.GETINFODETAILPROVISIVOTE_SUCCESS);
export const getInfoDetailProvisiVoteFail = createAction(CONST.GETINFODETAILPROVISIVOTE_FAIL);

export const updateAmountItem = createAction(CONST.UPDATEAMOUNTITEMORDERED);
export const updateAmountItemSuccess = createAction(CONST.UPDATEAMOUNTITEMORDERED_SUCCESS);
export const updateAmountItemFail = createAction(CONST.UPDATEAMOUNTITEMORDERED_FAIL);

export const cancelFoodOrdered = createAction(CONST.CANCELFOODORDERED);
export const cancelFoodOrderedSuccess = createAction(CONST.CANCELFOODORDERED_SUCCESS);
export const cancelFoodOrderedFail = createAction(CONST.CANCELFOODORDERED_FAIL);

export const updateStatusFoodOrdered = createAction(CONST.UPDATESTATUSFOODORDERD);