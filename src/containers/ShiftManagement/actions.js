import { createAction } from "redux-actions";
import * as CONST from "./const"

export const getListShift = createAction(CONST.GETLISTSHIFT)
export const getListShiftSuccess = createAction(CONST.GETLISTSHIFT_SUCCESS)
export const getListShiftFail = createAction(CONST.GETLISTSHIFT_FAIL)

export const addShift = createAction(CONST.ADDSHIFT);
export const addShiftSuccess = createAction(CONST.ADDSHIFT_SUCCESS);
export const addShiftFail = createAction(CONST.ADDSHIFT_FAIL);

export const editShift = createAction(CONST.EDITSHIFT);
export const editShiftSuccess = createAction(CONST.EDITSHIFT_SUCCESS);
export const editShiftFail = createAction(CONST.EDITSHIFT_FAIL);

export const deleteShift = createAction(CONST.DELETESHIFT);