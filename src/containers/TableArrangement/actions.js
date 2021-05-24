import { createAction } from "redux-actions";
import * as CONST from "./constants";

export const getAreaInfo = createAction(CONST.GETAREAINFO)
export const getAreaInfoSuccess = createAction(CONST.GETAREAINFO_SUCCESS)
export const getAreaInfoFail = createAction(CONST.GETAREAINFO_FAIL)

export const editArea = createAction(CONST.EDITAREA)
export const editAreaSuccess = createAction(CONST.EDITAREA_SUCCESS)
export const editAreaFail = createAction(CONST.EDITAREA_FAIL)

export const getTableList = createAction(CONST.GETTABLELIST);
export const getTableListSuccess = createAction(CONST.GETTABLELIST_SUCCESS);
export const getTableListFail = createAction(CONST.GETTABLELIST_FAIL);

export const getTableListByAreaId = createAction(CONST.GETTABLELISTBYAREAID);
export const getTableListByAreaIdSuccess = createAction(CONST.GETTABLELISTBYAREAID_SUCCESS);
export const getTableListByAreaIdFail = createAction(CONST.GETTABLELISTBYAREAID_FAIL);

export const getTableListArrangementById = createAction(CONST.GETTABLELISTARRANGEMENTBYID);
export const getTableListArrangementByIdSuccess = createAction(CONST.GETTABLELISTARRANGEMENTBYID_SUCCESS);
export const getTableListArrangementByIdFail = createAction(CONST.GETTABLELISTARRANGEMENTBYID_FAIL);
/* Post thông tin sắp xếp bàn */
export const postTableListArrangementById = createAction(CONST.POSTTABLELISTARRANGEMENTBYID);
export const postTableListArrangementByIdSuccess = createAction(CONST.POSTTABLELISTARRANGEMENTBYID_SUCCESS);
export const postTableListArrangementByIdFail = createAction(CONST.POSTTABLELISTARRANGEMENTBYID_FAIL);



export const searchTable = createAction(CONST.SEARCHTABLE);

export const getAreaIcon = createAction(CONST.GETAREAICON);
export const getAreaIconSuccess = createAction(CONST.GETAREAICON_SUCCESS);
export const getAreaIconFail = createAction(CONST.GETAREAICON_FAIL);



