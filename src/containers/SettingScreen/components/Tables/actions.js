import { createAction } from "redux-actions";
import * as CONST from "./constants";

export const createArea = createAction(CONST.CREATEAREA);
export const createAreaSuccess = createAction(CONST.CREATEAREA_SUCCESS);
export const createAreaFail = createAction(CONST.CREATEAREA_FAIL);

export const editArea = createAction(CONST.EDITAREA);
export const editAreaSuccess = createAction(CONST.EDITAREA_SUCCESS);
export const editAreaFail = createAction(CONST.EDITAREA_FAIL);

export const deleteArea = createAction(CONST.DELETEAREA);
export const deleteAreaSuccess = createAction(CONST.DELETEAREA_SUCCESS);
export const deleteAreaFail = createAction(CONST.DELETEAREA_FAIL);

export const getAreaList = createAction(CONST.GETAREALIST);
export const getAreaListSuccess = createAction(CONST.GETAREALIST_SUCCESS);
export const getAreaListFail = createAction(CONST.GETAREALIST_FAIL);
