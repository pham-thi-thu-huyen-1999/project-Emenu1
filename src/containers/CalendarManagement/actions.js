import { createAction } from "redux-actions";
import * as CONST from "./constants";

export const getCalendar = createAction(CONST.GETCALENDAR);
export const getCalendarSuccess = createAction(CONST.GETCALENDAR_SUCCESS);
export const getCalendarFail = createAction(CONST.GETCALENDAR_FAIL);

export const getCalendarWeek = createAction(CONST.GETCALENDARWEEK);
export const getCalendarWeekSuccess = createAction(CONST.GETCALENDARWEEK_SUCCESS);
export const getCalendarWeekFail = createAction(CONST.GETCALENDARWEEK_FAIL);

export const updateTakeLeave = createAction(CONST.UPDATETAKELEAVE);
export const updateTakeLeaveSuccess = createAction(CONST.UPDATETAKELEAVE_SUCCESS);
export const updateTakeLeaveFail = createAction(CONST.UPDATETAKELEAVE_FAIL);

export const updateCancelTakeLeave = createAction(CONST.UPDATECANCELTAKELEAVE);
export const updateCacelTakeLeaveSuccess = createAction(CONST.UPDATECANCELTAKELEAVE_SUCCESS);
export const updateCanceTakeleaveFail = createAction(CONST.UPDATECANCELTAKELEAVE_FAIL);

export const getAccountList = createAction(CONST.GETACCOUNTLIST);
export const getAccountListSuccess = createAction(CONST.GETACCOUNTLIST_SUCCESS);
export const getAccountListFail = createAction(CONST.GETACCOUNTLIST_FAIL);

export const deleteEmployeeToShift = createAction(CONST.DELETEEMPLOYEETOSHIFT);
export const deleteEmployeeToShiftSuccess = createAction(CONST.DELETEEMPLOYEETOSHIFT_SUCCESS);
export const deleteEmployeeToShiftFail = createAction(CONST.DELETEEMPLOYEETOSHIFT_FAIL);

export const addEmployeesToShift = createAction(CONST.ADDEMPLOYEESTOSHIFT);
export const addEmployeesToShiftSuccess = createAction(CONST.ADDEMPLOYEESTOSHIFT_SUCCESS);
export const addEmployeesToShiftFail = createAction(CONST.ADDEMPLOYEESTOSHIFT_FAIL);

export const getCalendarOfUser = createAction(CONST.GETCALENDAROFUSER);
export const getCalendarOfUserSuccess = createAction(CONST.GETCALENDAROFUSER_SUCCESS);
export const getCalendarOfUserFail = createAction(CONST.GETCALENDAROFUSER_FAIL);

export const getListShift = createAction(CONST.GETLISTSHIFT)
export const getListShiftSuccess = createAction(CONST.GETLISTSHIFT_SUCCESS)
export const getListShiftFail = createAction(CONST.GETLISTSHIFT_FAIL)

export const updateUI = createAction(CONST.UPDATEUI);
export const noUpdateUI = createAction(CONST.NOUPDATEUI);

export const addOverTimeShift = createAction(CONST.ADDOTSHIFT);
export const addOverTimeShiftSuccess = createAction(CONST.ADDOTSHIFT_SUCCESS);
export const addOverTimeShiftFail = createAction(CONST.ADDOTSHIFT_FAIL);

export const getCheckInOut = createAction(CONST.GETCHECKINOUT);
export const getCheckInOutSuccess = createAction(CONST.GETCHECKINOUT_SUCCESS);
export const getCheckInOutFail = createAction(CONST.GETCHECKINOUT_FAIL);

export const resetCheckInOut = createAction(CONST.RESETCHECKINOUT);

export const getTotalShift = createAction(CONST.GETTOTALSHIFT);
export const getTotalShiftSuccess = createAction(CONST.GETTOTALSHIFT_SUCCESS);
export const getTotalShiftFail = createAction(CONST.GETTOTALSHIFT_FAIL);

