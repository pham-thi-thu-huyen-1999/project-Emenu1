import { createAction } from "redux-actions";
import * as CONST from "./constants";

export const getComboList = createAction(CONST.GETCOMBO);
export const getComboListSuccess = createAction(CONST.GETCOMBO_SUCCESS);
export const getComboListFail = createAction(CONST.GETCOMBO_FAIL);

export const getComboById = createAction(CONST.GETCOMBOBYID);
export const getComboByIdSuccess = createAction(CONST.GETCOMBOBYID_SUCCESS);
export const getComboByIdFail = createAction(CONST.GETCOMBOBYID_FAIL);

export const createCombo = createAction(CONST.CREATECOMBO);
export const createComboSuccess = createAction(CONST.CREATECOMBO_SUCCESS);
export const createComboFail = createAction(CONST.CREATECOMBO_FAIL);

export const editCombo = createAction(CONST.UPDATECOMBO);
export const editComboSuccess = createAction(CONST.UPDATECOMBO_SUCCESS);
export const editComboFail = createAction(CONST.UPDATECOMBO_FAIL);

export const resetComboDetail = createAction(CONST.RESETCOMBODETAIL)
export const resetComboDetailSuccess = createAction(CONST.RESETCOMBODETAIL_SUCCESS)
export const resetComboDetailFail = createAction(CONST.RESETCOMBODETAIL_FAIL)
/**
 * Item (food)
 */
export const getItems = createAction(CONST.GETITEMLIST);
export const getItemsSuccess = createAction(CONST.GETITEMLIST_SUCCESS);
export const getItemsFail = createAction(CONST.GETITEMLIST_FAIL)

export const getItemComboList = createAction(CONST.GETITEM_COMBOLIST);
export const getItemComboListSuccess = createAction(CONST.GETITEM_COMBOLIST_SUCCESS);
export const getItemComboListFail = createAction(CONST.GETITEM_COMBOLIST_FAIL);

export const resetItemComboList = createAction(CONST.RESETITEMCOMBOLIST)

export const deleteCombo = createAction(CONST.DELETECOMBO);
export const deleteComboSuccess = createAction(CONST.DELETECOMBO_SUCCESS);
export const deleteComboFail = createAction(CONST.DELETECOMBO_FAIL);

export const loadDishIcon = createAction(CONST.LOADDISHICON);
export const getDishIconSuccess = createAction(CONST.GET_DISHICON_SUCCESS);

