import { createAction } from "redux-actions";
import * as CONST from "./constants";

export const getItemList = createAction(CONST.GETITEMLIST);
export const getItemListSuccess = createAction(CONST.GETITEMLIST_SUCCESS);
export const getItemListFail = createAction(CONST.GETITEMLIST_FAIL);

export const getOrderItemById = createAction(CONST.GETORDERITEMBYID);
export const getOrderItemByIdSuccess = createAction(CONST.GETORDERITEMBYID_SUCCESS);
export const getOrderItemByIdFail = createAction(CONST.GETORDERITEMBYID_FAIL);

export const getOrderForm = createAction(CONST.GETORDERFORM);
export const getOrderFormSuccess = createAction(CONST.GETORDERFORM_SUCCESS);
export const getOrderFormFail = createAction(CONST.GETORDERFORM_FAIL);

export const createOrder = createAction(CONST.CREATEORDER);
export const createOrderSuccess = createAction(CONST.CREATEORDER_SUCCESS);
export const createOrderFail = createAction(CONST.CREATEORDER_FAIL);

export const deleteOrder = createAction(CONST.DELETEORDER);
export const deleteOrderSuccess = createAction(CONST.DELETEORDER_SUCCESS);
export const deleteOrderFail = createAction(CONST.DELETEORDER_FAIL);

export const deliveryConfirm = createAction(CONST.DELIVERYCONFIRM);
export const deliveryConfirmSuccess = createAction(CONST.DELIVERYCONFIRM_SUCCESS);
export const deliveryConfirmFail = createAction(CONST.DELIVERYCONFIRM_FAIL);

export const getCategoryItemList = createAction(CONST.GETCATEGORYITEMLIST);
export const getCategoryItemListSuccess = createAction(CONST.GETCATEGORYITEMLIST_SUCCESS);
export const getCategoryItemListFail = createAction(CONST.GETCATEGORYITEMLIST_FAIL);

export const getPartnerSetting = createAction(CONST.GETPARTNERSETTING);
export const getPartnerSettingSuccess = createAction(CONST.GETPARTNERSETTING_SUCCESS);
export const getPartnerSettingFail = createAction(CONST.GETPARTNERSETTING_FAIL);

export const getComboItemList = createAction(CONST.GETCOMBOITEMLIST);
export const getComboItemListSuccess = createAction(CONST.GETCOMBOITEMLIST_SUCCESS);
export const getComboItemListFail = createAction(CONST.GETCOMBOITEMLIST_FAIL);

export const getComboById = createAction(CONST.GETCOMBOBYID);
export const getComboByIdSuccess = createAction(CONST.GETCOMBOBYID_SUCCESS);
export const getComboByIdFail = createAction(CONST.GETCOMBOBYID_FAIL);

export const getAccountInfo = createAction(CONST.GETACCOUNTINFO);
export const getAccountInfoSuccess = createAction(CONST.GETACCOUNTINFO_SUCCESS);
export const getAccountInfoFail = createAction(CONST.GETACCOUNTINFO_FAIL);

export const paymentOrder = createAction(CONST.PAYMENTORDER);
export const paymentOrderSuccess = createAction(CONST.PAYMENTORDER_SUCCESS);
export const paymentOrderFail = createAction(CONST.PAYMENTORDER_FAIL);

export const getPartnerById = createAction(CONST.GETPARTNERBYID);
export const getPartnerByIdSuccess = createAction(CONST.GETPARTNERBYID_SUCCESS);
export const getPartnerByIdFail = createAction(CONST.GETPARTNERBYID_FAIL);

export const getOrderItem = createAction(CONST.GETORDERITEM);
export const getOrderItemSuccess = createAction(CONST.GETORDERITEM_SUCCESS);
export const getOrderItemFail = createAction(CONST.GETORDERITEM_FAIL);

export const getCheckVoucher = createAction(CONST.GETCHECKVOUCHER);
export const getCheckVoucherSuccess = createAction(CONST.GETCHECKVOUCHER_SUCCESS);
export const getCheckVoucherFail = createAction(CONST.GETCHECKVOUCHER_FAIL);

export const getBillInfoById = createAction(CONST.GETBILLINFOBYID);
export const getBillInfoByIdSuccess = createAction(CONST.GETBILLINFOBYID_SUCCESS);
export const getBillInfoByIdFail = createAction(CONST.GETBILLINFOBYID_FAIL);

export const cancelBill = createAction(CONST.CANCELBILL);
export const cancelBillSuccess = createAction(CONST.CANCELBILL_SUCCESS);
export const cancelBillFail = createAction(CONST.CANCELBILL_FAIL);

export const rollbackOrder = createAction(CONST.ROLLBACKLORDER);