import { createAction } from "redux-actions";
import * as CONST from "./constants";


export const getUnitItemList = createAction(CONST.GETUNITITEMLIST);
export const getUnitItemListSuccess = createAction(CONST.GETUNITITEMLIST_SUCCESS);
export const getUnitItemListFail = createAction(CONST.GETUNITITEMLIST_FAIL);

export const createUnitItem = createAction(CONST.CREATEUNITITEM);
export const createUnitItemSuccess = createAction(CONST.CREATEUNITITEM_SUCCESS);
export const createUnitItemFail = createAction(CONST.CREATEUNITITEM_FAIL);

export const editUnitItem = createAction(CONST.EDITUNITITEM);
export const editUnitItemSuccess = createAction(CONST.EDITUNITITEM_SUCCESS);
export const editUnitItemFail = createAction(CONST.EDITUNITITEM_FAIL);

export const deleteUnitItem = createAction(CONST.DELETEUNITITEM);
export const deleteUnitItemSuccess = createAction(CONST.DELETEUNITITEM_SUCCESS);
export const deleteUnitItemFail = createAction(CONST.DELETEUNITITEM_FAIL);
