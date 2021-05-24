import { createAction } from "redux-actions";
import * as CONST from "./consts";

export const getCalendarOfUser = createAction(CONST.GETCALENDAROFUSER);
export const getCalendarOfUserSuccess = createAction(
  CONST.GETCALENDAROFUSER_SUCCESS
);
export const getCalendarOfUserFail = createAction(CONST.GETCALENDAROFUSER_FAIL);

export const addCheckInOut = createAction(CONST.ADDCHECKIN_OUT);
export const addCheckInOutSuccess = createAction(CONST.ADDCHECKIN_OUT_SUCCESS);
export const addCheckInOutFail = createAction(CONST.ADDCHECKIN_OUT_FAIL);

export const getListShift = createAction(CONST.GETLISTSHIFT);
export const getListShiftSuccess = createAction(CONST.GETLISTSHIFT_SUCCESS);
export const getListShiftFail = createAction(CONST.GETLISTSHIFT_FAIL);

export const getOverTimeShift = createAction(CONST.GETOTSHIFT);
export const getOverTimeShiftSuccess = createAction(CONST.GETOTSHIFT_SUCCESS);
export const getOverTimeShiftFail = createAction(CONST.GETOTSHIFT_FAIL);

export const deleteOverTimeShift = createAction(CONST.DELETEOTSHIFT);
export const deleteOverTimeShiftSuccess = createAction(
  CONST.DELETEOTSHIFT_SUCCESS
);
export const deleteOverTimeShiftFail = createAction(CONST.DELETEOTSHIFT_FAIL);

export const addOverTimeShift = createAction(CONST.ADDOTSHIFT);
export const addOverTimeShiftSuccess = createAction(CONST.ADDOTSHIFT_SUCCESS);
export const addOverTimeShiftFail = createAction(CONST.ADDOTSHIFT_FAIL);

export const getAccountList = createAction(CONST.GETACCOUNTLIST);
export const getAccountListSuccess = createAction(CONST.GETACCOUNTLIST_SUCCESS);
export const getAccountListFail = createAction(CONST.GETACCOUNTLIST_FAIL);

export const getUserInfo = createAction(CONST.GETUSERINFO);
export const getUserInfoSuccess = createAction(CONST.GETUSERINFO_SUCCESS);
export const getUserInfoFail = createAction(CONST.GETUSERINFO_FAIL);

export const addTakeLeave = createAction(CONST.ADDTAKELEAVE);
export const addTakeLeaveSuccess = createAction(CONST.ADDTAKELEAVE_SUCCESS);
export const addTakeLeaveFail = createAction(CONST.ADDTAKELEAVE_FAIL);

export const getTakeLeaveShift = createAction(CONST.GETTAKELEAVESHIFT);
export const getTakeLeaveShiftSuccess = createAction(
  CONST.GETTAKELEAVESHIFT_SUCCESS
);
export const getTakeLeaveShiftFail = createAction(CONST.GETTAKELEAVESHIFT_FAIL);

export const deleteTakeLeaveShift = createAction(CONST.DELETETAKELEAVESHIFT);
export const deleteTakeLeaveShiftSuccess = createAction(
  CONST.DELETETAKELEAVESHIFT_SUCCESS
);
export const deleteTakeLeaveShiftFail = createAction(
  CONST.DELETETAKELEAVESHIFT_FAIL
);
export const setPageTakeLeave = createAction(CONST.SETPAGETAKELEAVE);
export const setPageOverTime = createAction(CONST.SETPAGEOVERTIME);
export const setPageReplace = createAction(CONST.SETPAGEREPLACE);
export const resetCalendarOfUser = createAction(CONST.RESETCALENDAROFUSER);

export const addReplaceShift = createAction(CONST.ADDREPLACESHIFT);
export const addReplaceShiftSuccess = createAction(
  CONST.ADDREPLACESHIFT_SUCCESS
);
export const addReplaceShiftFail = createAction(CONST.ADDREPLACESHIFT_FAIL);

export const deleteReplaceShift = createAction(CONST.DELETEREPLACESHIFT);
export const deleteReplaceShiftSuccess = createAction(
  CONST.DELETEREPLACESHIFT_SUCCESS
);
export const deleteReplaceShiftFail = createAction(CONST.DELETEREPLACESHIFT_FAIL);

export const getReplaceShift = createAction(CONST.GETREPLACESHIFT);
export const getReplaceShiftSuccess = createAction(
  CONST.GETREPLACESHIFT_SUCCESS
);
export const getReplaceShiftFail = createAction(CONST.GETREPLACESHIFT_FAIL);

export const getCalendarOfUserByWeek = createAction(
  CONST.GETCALENDAROFUSERBYWEEK
);
export const getCalendarOfUserByWeekSuccess = createAction(
  CONST.GETCALENDAROFUSERBYWEEK_SUCCESS
);
export const getCalendarOfUserByWeekFail = createAction(
  CONST.GETCALENDAROFUSERBYWEEK_FAIL
);

export const getEmployeeOfShift = createAction(CONST.GETEMPLOYEEOFSHIFT);
export const getEmployeeOfShiftSuccess = createAction(
  CONST.GETEMPLOYEEOFSHIFT_SUCCESS
);
export const getEmployeeOfShiftFail = createAction(
  CONST.GETEMPLOYEEOFSHIFT_FAIL
);

export const addTakeLeaveForCalendar = createAction(
  CONST.ADDTAKELEAVEFORCALENDAR
);
export const addTakeLeaveForCalendarSuccess = createAction(
  CONST.ADDTAKELEAVEFORCALENDAR_SUCCESS
);
export const addTakeLeaveForCalendarFail = createAction(
  CONST.ADDTAKELEAVEFORCALENDAR_FAIL
);

export const getCalendarOfUserByMonth = createAction(
  CONST.GETCALENDAROFUSERBYMONTH
);
export const getCalendarOfUserByMonthSuccess = createAction(
  CONST.GETCALENDAROFUSERBYMONTH_SUCCESS
);
export const getCalendarOfUserByMonthFail = createAction(
  CONST.GETCALENDAROFUSERBYMONTH_FAIL
);

export const getListCheckIn = createAction(CONST.GETLISTCHECKIN);
export const getListCheckInSuccess = createAction(CONST.GETLISTCHECKIN_SUCCESS);
export const getListCheckInFail = createAction(CONST.GETLISTCHECKIN_FAIL);

export const deleteTakeLeaveForCalendar = createAction(CONST.DELETETAKElEAVEFORCALENDAR);
export const deleteTakeLeaveForCalendarSuccess = createAction(
  CONST.DELETETAKElEAVEFORCALENDAR_SUCCESS
);
export const deleteTakeLeaveForCalendarFail = createAction(CONST.DELETETAKElEAVEFORCALENDAR_FAIL);

export const deleteOverTimeForCalendar = createAction(
  CONST.DELETEOVERTIMEFORCALENDAR
);
export const deleteOverTimeForCalendarSuccess = createAction(
  CONST.DELETEOVERTIMEFORCALENDAR_SUCCESS
);
export const deleteOverTimeForCalendarFail = createAction(
  CONST.DELETEOVERTIMEFORCALENDAR_FAIL
);

export const deleteReplaceShiftForCalendar = createAction(
  CONST.DELETEREPLACESHIFTFORCALENDAR
);
export const deleteReplaceShiftForCalendarSuccess = createAction(
  CONST.DELETEREPLACESHIFTFORCALENDAR_SUCCESS
);
export const deleteReplaceShiftForCalendarFail = createAction(
  CONST.DELETEREPLACESHIFTFORCALENDAR_FAIL
);

export const setAtCheckInPage = createAction(CONST.SETATCHECKINPAGE);
export const setNoAtCheckInPage = createAction(CONST.SETNOATCHECKINPAGE);