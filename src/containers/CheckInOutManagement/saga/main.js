import { call, put, takeEvery } from "redux-saga/effects";
import * as actions from "../actions";
import * as apiCalendar from "../../../api/calendar";
import * as apiPartner from "../../../api/partner";
import * as apiAccount from "../../../api/account";
import * as CONSTS from "../consts";
import * as apiShift from "../../../api/shift";
import moment from "moment";
import { get } from "../../../services/localStorage";
import common from "../../../utils/common";

/**
 * Get calendar of an employee in a month
 */
function* handleGetCalendarOfUser(action) {
  try {
    const res = yield call(apiCalendar.getCalendarOfUser, action.payload);
    yield put(actions.getCalendarOfUserSuccess(res.data));
  } catch (err) {
    yield put(actions.getCalendarOfUserFail(err.response));
  }
}

function* handleGetUserInfo(action) {
  try {
    const data = common.decodeToken(get("accessToken"));
    yield put(actions.getUserInfoSuccess({ data }));
  } catch (err) {
    yield put(actions.getUserInfoFail(err.response));
  }
}

function* handleAddCheckInOut(action) {
  try {
    yield call(apiShift.createCheckinOut, action.payload);
    yield put(actions.addCheckInOutSuccess());
    yield action.payload.showSuccess();
  } catch (err) {
    yield put(actions.addCheckInOutFail());
    yield action.payload.showError();
  }
}

function* handleGetListShift(action) {
  try {
    const res = yield call(apiShift.getListShift, action.payload);
    yield put(actions.getListShiftSuccess(res.data));
  } catch (error) {}
}

function* handleDeleteOverTimeShift(action) {
  try {
    yield call(apiCalendar.deleteEmployeeToShift, action.payload.data);
    yield put(actions.setPageOverTime(1));
    yield put(
      actions.getOverTimeShift({
        user_id: action.payload.data.user_id,
        params: {
          overtime_at: action.payload.data.overtime_at,
          is_by_date: false,
          page_size: CONSTS.LIMIT,
          index: 0,
        },
      })
    );
    yield action.payload.showSuccess();
  } catch (err) {
    yield put(actions.deleteOverTimeShiftFail(err.response));
    yield action.payload.showErr();
  }
}

/**
 * Get list of employees
 */
function* handleGetAccountList(action) {
  try {
    const res = yield call(apiAccount.getFullAccountList, action.payload);
    yield put(actions.getAccountListSuccess(res.data));
  } catch (err) {
    yield put(actions.getAccountListFail(err.response));
  }
}

function* handleGetOverTimeShift(action) {
  try {
    const res = yield call(apiShift.getListOverShift, action.payload);
    yield put(actions.getOverTimeShiftSuccess(res.data));
  } catch (err) {
    yield put(actions.getOverTimeShiftFail());
  }
}

/**
 * add a few overtime shifts to an employee
 */
function* handleAddOverTimeShift(action) {
  try {
    const { data } = action.payload;
    yield call(apiShift.addOTShift, action.payload);
    yield put(actions.setPageOverTime(1));
    yield put(actions.addOverTimeShiftSuccess());
    yield put(
      actions.getOverTimeShift({
        user_id: data.user_id,
        params: {
          overtime_at: action.payload.data.overtime_at,
          is_by_date: false,
          page_size: CONSTS.LIMIT,
          index: 0,
        },
      })
    );

    yield action.payload.showSuccess();
  } catch (err) {
    yield put(actions.addOverTimeShiftFail());
    yield action.payload.showErr();
  }
}

/**
 * Use for take Leave Page
 */
function* handleAddTakeLeaveShift(action) {
  try {
    const { data } = action.payload;
    yield call(apiPartner.updateTakeLeave, action.payload);
    yield put(actions.setPageTakeLeave(1));
    yield put(
      actions.getTakeLeaveShift({
        user_id: data.user_id,
        params: {
          take_leave_at: action.payload.data.take_leave_at,
          is_by_date: false,
          page_size: CONSTS.LIMIT,
          index: 0,
        },
      })
    );
    yield action.payload.showSuccess();
  } catch (err) {
    yield action.payload.showErr();
    yield put(actions.addTakeLeaveFail());
  }
}

/**
 * Use for  Calendar Week
 */
function* handleAddTakeLeaveForCalendar(action) {
  try {
    yield call(apiPartner.updateTakeLeave, action.payload);
    let { workingCategory, user_id } = action.payload;
    if (workingCategory === CONSTS.WEEK) {
      const selectedDatesInWeek = action.payload.selectedDatesInWeek;
      const data = {
        userId: user_id,
        fromDate: moment(selectedDatesInWeek[0]).format("DD-MM-YYYY"),
        toDate: moment(selectedDatesInWeek[6]).format("DD-MM-YYYY"),
      };
      yield put(actions.getCalendarOfUserByWeek(data));
    } else if (workingCategory === CONSTS.MONTH) {
      const selectedDate = action.payload.selectedDate;
      const data = {
        userId: user_id,
        fromDate: moment(
          new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
        ).format("DD-MM-YYYY"),
        toDate: moment(
          new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
        ).format("DD-MM-YYYY"),
      };
      yield put(actions.getCalendarOfUserByMonth(data));
    }
    yield put(actions.addTakeLeaveForCalendarSuccess());
    yield action.payload.showSuccess();
  } catch (err) {
    yield action.payload.showErr();
    yield put(actions.addTakeLeaveForCalendarFail());
  }
}

/**
 *  Delete take leave for an employee
 */
function* handleDeleteTakeLeaveShift(action) {
  try {
    yield call(apiShift.deleteTakeLeave, action.payload);
    yield put(actions.setPageTakeLeave(1));
    yield put(
      actions.getTakeLeaveShift({
        user_id: action.payload.user_id,
        params: {
          take_leave_at: action.payload.take_leave_at,
          is_by_date: false,
          page_size: CONSTS.LIMIT,
          index: 0,
        },
      })
    );
    yield action.payload.showSuccess();
  } catch (err) {
    yield action.payload.showErr();
    yield put(actions.deleteTakeLeaveShiftFail());
  }
}

/**
 *  Delete take leave for an calendar
 */
function* handleDeleteTakeLeaveForCalendar(action) {
  try {
    yield call(apiPartner.deleteTakeLeaveShiftByEmployee, action.payload);
    let { workingCategory, user_id } = action.payload;
    if (workingCategory === CONSTS.WEEK) {
      const selectedDatesInWeek = action.payload.selectedDatesInWeek;
      const data = {
        userId: user_id,
        fromDate: moment(selectedDatesInWeek[0]).format("DD-MM-YYYY"),
        toDate: moment(selectedDatesInWeek[6]).format("DD-MM-YYYY"),
      };
      yield put(actions.getCalendarOfUserByWeek(data));
    } else if (workingCategory === CONSTS.MONTH) {
      const selectedDate = action.payload.selectedDate;
      const data = {
        userId: user_id,
        fromDate: moment(
          new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
        ).format("DD-MM-YYYY"),
        toDate: moment(
          new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
        ).format("DD-MM-YYYY"),
      };
      yield put(actions.getCalendarOfUserByMonth(data));
    }
    yield put(actions.deleteTakeLeaveForCalendarSuccess());
    yield action.payload.showSuccess();
  } catch (err) {
    yield action.payload.showErr();
    yield put(actions.deleteTakeLeaveForCalendarFail());
  }
}

function* handleDeleteOverTimeForCalendar(action) {
  try {
    yield call(apiPartner.deleteOverTimeShiftByEmployee, action.payload);
    let { workingCategory, user_id } = action.payload;
    if (workingCategory === CONSTS.WEEK) {
      const selectedDatesInWeek = action.payload.selectedDatesInWeek;
      const data = {
        userId: user_id,
        fromDate: moment(selectedDatesInWeek[0]).format("DD-MM-YYYY"),
        toDate: moment(selectedDatesInWeek[6]).format("DD-MM-YYYY"),
      };
      yield put(actions.getCalendarOfUserByWeek(data));
    } else if (workingCategory === CONSTS.MONTH) {
      const selectedDate = action.payload.selectedDate;
      const data = {
        userId: user_id,
        fromDate: moment(
          new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
        ).format("DD-MM-YYYY"),
        toDate: moment(
          new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
        ).format("DD-MM-YYYY"),
      };
      yield put(actions.getCalendarOfUserByMonth(data));
    }
    yield put(actions.deleteOverTimeForCalendarSuccess());
    yield action.payload.showSuccess();
  } catch (err) {
    yield action.payload.showErr();
    yield put(actions.deleteOverTimeForCalendarFail());
  }
}
function* handleDeleteReplaceShiftForCalendar(action) {
  try {
    yield call(apiPartner.deleteReplaceShift, action.payload);
    let { workingCategory, user_id } = action.payload;
    if (workingCategory === CONSTS.WEEK) {
      const selectedDatesInWeek = action.payload.selectedDatesInWeek;
      const data = {
        userId: user_id,
        fromDate: moment(selectedDatesInWeek[0]).format("DD-MM-YYYY"),
        toDate: moment(selectedDatesInWeek[6]).format("DD-MM-YYYY"),
      };
      yield put(actions.getCalendarOfUserByWeek(data));
    } else if (workingCategory === CONSTS.MONTH) {
      const selectedDate = action.payload.selectedDate;
      const data = {
        userId: user_id,
        fromDate: moment(
          new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
        ).format("DD-MM-YYYY"),
        toDate: moment(
          new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
        ).format("DD-MM-YYYY"),
      };
      yield put(actions.getCalendarOfUserByMonth(data));
    }
    yield put(actions.deleteReplaceShiftForCalendarSuccess());
    yield action.payload.showSuccess();
  } catch (err) {
    yield action.payload.showErr();
    yield put(actions.deleteReplaceShiftForCalendarFail());
  }
}

function* handleGetTakeLeaveShift(action) {
  try {
    const res = yield call(apiShift.getListTakeLeave, action.payload);
    yield put(actions.getTakeLeaveShiftSuccess(res.data));
  } catch (err) {
    yield put(actions.getTakeLeaveShiftFail());
  }
}

/**
 * add a few overtime shifts to an employee
 */
function* handleAddReplaceShift(action) {
  try {
    const { data } = action.payload;
    yield call(apiPartner.addReplaceShift, action.payload);
    yield put(actions.setPageReplace(1));
    yield put(
      actions.getReplaceShift({
        user_id: data.user_id,
        params: {
          replace_at: data.replace_at,
          is_by_date: false,
          page_size: CONSTS.LIMIT,
          index: 0,
        },
      })
    );
    yield action.payload.showSuccess();
  } catch (err) {
    yield put(actions.addReplaceShiftFail());
    yield action.payload.showErr();
  }
}

function* handleGetReplaceShift(action) {
  try {
    const res = yield call(apiPartner.getReplaceShift, action.payload);
    yield put(actions.getReplaceShiftSuccess(res.data));
  } catch (err) {
    yield put(actions.getReplaceShiftFail());
  }
}

/**
 * Get calendar of an employee in a week
 */
function* handleGetCalendarOfUserByWeek(action) {
  try {
    const res = yield call(apiCalendar.getCalendarOfUser, action.payload);
    yield put(actions.getCalendarOfUserByWeekSuccess(res.data));
  } catch (err) {
    yield put(actions.getCalendarOfUserByWeekFail(err.response));
  }
}

function* handleGetEmployeeOfShift(action) {
  try {
    const res = yield call(apiCalendar.getEmployeeOfShift, action.payload);
    yield put(actions.getEmployeeOfShiftSuccess(res.data));
  } catch (err) {
    yield put(actions.getEmployeeOfShiftFail(err.response));
  }
}

/**
 * Get calendar of an employee in a month
 */
function* handleGetCalendarOfUserByMonth(action) {
  try {
    const res = yield call(apiCalendar.getCalendarOfUser, action.payload);
    yield put(actions.getCalendarOfUserByMonthSuccess(res.data));
  } catch (err) {
    yield put(actions.getCalendarOfUserByMonthFail(err.response));
  }
}

function* handleGetListCheckIn(action) {
  try {
    const res = yield call(apiShift.getListCheckinCheckout, action.payload);
    yield put(actions.getListCheckInSuccess(res.data));
  } catch (err) {
    yield put(actions.getListCheckInFail());
  }
}

function* handleDeleteReplaceShift(action) {
  try {
    yield call(apiPartner.deleteReplaceShift, action.payload);
    yield put(actions.setPageReplace(1));
    yield put(
      actions.getReplaceShift({
        user_id: action.payload.data.user_id,
        params: {
          replace_at: action.payload.data.replace_at,
          is_by_date: false,
          page_size: CONSTS.LIMIT,
          index: 0,
        },
      })
    );
    yield action.payload.showSuccess();
  } catch (err) {
    yield put(actions.deleteReplaceShiftFail());
    yield action.payload.showErr();
  }
}





//////////////////////////////////////////////////////
// attach to Watcher

function* getCalendarOfUser() {
  yield takeEvery(actions.getCalendarOfUser, handleGetCalendarOfUser);
}

function* addCheckInOut() {
  yield takeEvery(actions.addCheckInOut, handleAddCheckInOut);
}

function* getListShift() {
  yield takeEvery(actions.getListShift, handleGetListShift);
}

function* deleteOverTimeShift() {
  yield takeEvery(actions.deleteOverTimeShift, handleDeleteOverTimeShift);
}

function* addOverTimeShift() {
  yield takeEvery(actions.addOverTimeShift, handleAddOverTimeShift);
}

function* getOverTimeShift() {
  yield takeEvery(actions.getOverTimeShift, handleGetOverTimeShift);
}

function* getAccountList() {
  yield takeEvery(actions.getAccountList, handleGetAccountList);
}

function* getUserInfo() {
  yield takeEvery(actions.getUserInfo, handleGetUserInfo);
}

function* addTakeLeaveShift() {
  yield takeEvery(actions.addTakeLeave, handleAddTakeLeaveShift);
}

function* deleteTakeLeaveShift() {
  yield takeEvery(actions.deleteTakeLeaveShift, handleDeleteTakeLeaveShift);
}

function* deleteTakeLeaveForCalendar() {
  yield takeEvery(
    actions.deleteTakeLeaveForCalendar,
    handleDeleteTakeLeaveForCalendar
  );
}

function* deleteOverTimeForCalendar() {
  yield takeEvery(
    actions.deleteOverTimeForCalendar,
    handleDeleteOverTimeForCalendar
  );
}

function* deleteReplaceShiftForCalendar() {
  yield takeEvery(
    actions.deleteReplaceShiftForCalendar,
    handleDeleteReplaceShiftForCalendar
  );
}

function* deleteReplaceShift() {
  yield takeEvery(actions.deleteReplaceShift, handleDeleteReplaceShift);
}

function* getTakeLeaveShift() {
  yield takeEvery(actions.getTakeLeaveShift, handleGetTakeLeaveShift);
}

function* addReplaceShift() {
  yield takeEvery(actions.addReplaceShift, handleAddReplaceShift);
}

function* getReplaceShift() {
  yield takeEvery(actions.getReplaceShift, handleGetReplaceShift);
}

function* getCalendarOfUserByWeek() {
  yield takeEvery(
    actions.getCalendarOfUserByWeek,
    handleGetCalendarOfUserByWeek
  );
}

function* getCalendarOfUserByMonth() {
  yield takeEvery(
    actions.getCalendarOfUserByMonth,
    handleGetCalendarOfUserByMonth
  );
}

function* getEmployeeOfShift() {
  yield takeEvery(actions.getEmployeeOfShift, handleGetEmployeeOfShift);
}

function* addTakeLeaveForCalendar() {
  yield takeEvery(
    actions.addTakeLeaveForCalendar,
    handleAddTakeLeaveForCalendar
  );
}

function* getListCheckIn() {
  yield takeEvery(actions.getListCheckIn, handleGetListCheckIn);
}

//////////////////////////////////////////////////////
export default [
  getCalendarOfUser,
  addCheckInOut,
  getListShift,
  deleteOverTimeShift,
  addOverTimeShift,
  getAccountList,
  getUserInfo,
  getOverTimeShift,
  addTakeLeaveShift,
  getTakeLeaveShift,
  deleteTakeLeaveShift,
  addReplaceShift,
  getReplaceShift,
  getCalendarOfUserByWeek,
  getCalendarOfUserByMonth,
  getEmployeeOfShift,
  addTakeLeaveForCalendar,
  getListCheckIn,
  deleteReplaceShift,
  deleteTakeLeaveForCalendar,
  deleteOverTimeForCalendar,
  deleteReplaceShiftForCalendar,
];
