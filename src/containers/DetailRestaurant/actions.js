import { createAction } from "redux-actions";
import * as CONST from "./constants";

export const getInfoPartner = createAction(CONST.GET_INFO_PARTNER)
export const getInfoPartnerSuccess = createAction(CONST.GET_INFO_PARTNER_SUCCESS)
export const getInfoPartnerFail = createAction(CONST.GET_INFO_PARTNER_FAIL)

export const getCategoryItemList = createAction(CONST.GETCATEGORYITEMLIST);
export const getCategoryItemListSuccess = createAction(CONST.GETCATEGORYITEMLIST_SUCCESS);
export const getCategoryItemListFail = createAction(CONST.GETCATEGORYITEMLIST_FAIL);

export const getComboItemList = createAction(CONST.GETCOMBOITEMLIST);
export const getComboItemListSuccess = createAction(CONST.GETCOMBOITEMLIST_SUCCESS);
export const getComboItemListFail = createAction(CONST.GETCOMBOITEMLIST_FAIL);

export const getComboById = createAction(CONST.GETCOMBOBYID);
export const getComboByIdSuccess = createAction(CONST.GETCOMBOBYID_SUCCESS);
export const getComboByIdFail = createAction(CONST.GETCOMBOBYID_FAIL);

export const getPartnerSetting = createAction(CONST.GETPARTNERSETTING);
export const getPartnerSettingSuccess = createAction(CONST.GETPARTNERSETTING_SUCCESS);
export const getPartnerSettingFail = createAction(CONST.GETPARTNERSETTING_FAIL);

export const getOrderItem = createAction(CONST.GETORDERITEM);
export const getOrderItemSuccess = createAction(CONST.GETORDERITEM_SUCCESS);
export const getOrderItemFail = createAction(CONST.GETORDERITEM_FAIL);

export const getTableById = createAction(CONST.GETTABLEBYID);
export const getTableByIdSuccess = createAction(CONST.GETTABLEBYID_SUCCESS);
export const getTableByIdFail = createAction(CONST.GETTABLEBYID_FAIL);

export const callStaff = createAction(CONST.CALLSTAFFINSERTNOTI);