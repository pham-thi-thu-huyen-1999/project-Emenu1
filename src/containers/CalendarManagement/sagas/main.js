import { call, put, takeEvery } from "redux-saga/effects";
import * as actions from "../actions";
import * as apiCalendar from "../../../api/calendar";
import * as apiPartner from "../../../api/partner";
import * as apiAccount from "../../../api/account";
import * as CONSTS from "../constants";
import * as apiShift from "../../../api/shift";
import moment from "moment";

/**
 * Get calendar by day
 */
function* handleGetCalendar(action) {
  try {
    const res = yield call(apiCalendar.getCalendar, action.payload);
    yield put(actions.getCalendarSuccess(res.data));
    yield put(actions.updateUI());
  } catch (err) {
    yield put(actions.getCalendarFail(err.response));
  }
}

/**
 * Get Total shifts of an employee in a month
 */
function* handleGetTotalShift(action) {
  try {
    const res = yield call(apiCalendar.getTotalShift, action.payload);
    yield put(actions.getTotalShiftSuccess(res.data));
    yield put(actions.updateUI());
  } catch (err) {
    yield put(actions.getTotalShiftFail(err.response));
  }
}

/**
 * Get calendar by week from Sunday to Saturday
 */
function* handleGetCalendarWeek(action) {
  try {
    const res = yield call(apiCalendar.getCalendar, action.payload);
    yield put(actions.getCalendarWeekSuccess(res.data));
    yield put(actions.updateUI());
  } catch (err) {
    yield put(actions.getCalendarWeekFail(err.response));
  }
}

/**
 * Get calendar of an employee in a month
 */
function* handleGetCalendarOfUser(action) {
  try {
    const res = yield call(apiCalendar.getCalendarOfUser, action.payload);
    yield put(actions.getCalendarOfUserSuccess(res.data));
    yield put(actions.updateUI());
  } catch (err) {
    yield put(actions.getCalendarOfUserFail(err.response));
  }
}

/**
 * Take leave for an employee => day, week, month
 */
function* handleUpdateTakeLeave(action) {
  try {
    yield call(apiPartner.updateTakeLeave, action.payload);
    yield put(actions.updateTakeLeaveSuccess());

    const selectedBtn = action.payload.selectedBtn;
    //Handle for day
    if (selectedBtn === CONSTS.DAY) {
      const res = yield call(apiCalendar.getCalendar, {
        fromDate: moment(new Date(action.payload.take_leave_at)).format("DD-MM-YYYY"),
        toDate: moment(new Date(action.payload.take_leave_at)).format("DD-MM-YYYY"),
      });
      yield put(actions.getCalendarSuccess(res.data));
      yield action.payload.callback_success();
    } else if (selectedBtn === CONSTS.WEEK) {
      //Handle for week
      const selectedDatesInWeek = action.payload.selectedDatesInWeek;
      const res = yield call(apiCalendar.getCalendar, {
        fromDate: moment(new Date(selectedDatesInWeek[0])).format("DD-MM-YYYY"),
        toDate: moment(new Date(selectedDatesInWeek[selectedDatesInWeek.length - 1])).format("DD-MM-YYYY"),
      });
      yield put(actions.getCalendarWeekSuccess(res.data));
      yield action.payload.callback_success();
    } else if (selectedBtn === CONSTS.MONTH) {
      //Handle for month
      const selectedDate = action.payload.selectedDate;
      const res = yield call(apiCalendar.getCalendarOfUser, {
        userId: action.payload.data.user_id,
        fromDate: moment(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)).format("DD-MM-YYYY"),
        toDate: moment(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)).format("DD-MM-YYYY"),
      });
      yield put(actions.getCalendarOfUserSuccess(res.data));

      const resTotalShift = yield call(apiCalendar.getTotalShift, {
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear()
      });
      yield put(actions.getTotalShiftSuccess(resTotalShift.data));
      yield action.payload.callback_success();

    }
    yield put(actions.updateUI());
  } catch (err) {
    yield put(actions.updateTakeLeaveFail(err.response));
    yield action.payload.callback_fail();
  }
}

/**
 * Cancel take leave for an employee => day, month
 */
function* handleUpdateCancelTakeLeave(action) {
  try {
    yield call(apiCalendar.updateCancelTakeLeave, action.payload.data);
    const selectedBtn = action.payload.selectedBtn;

    //Handle for day
    if (selectedBtn === CONSTS.DAY) {
      const res = yield call(apiCalendar.getCalendar, {
        fromDate: action.payload.data.take_leave_at,
        toDate: action.payload.data.take_leave_at,
      });
      yield put(actions.getCalendarSuccess(res.data));
    } else {
      //Handle for month
      const selectedDate = action.payload.selectedDate;
      const res = yield call(apiCalendar.getCalendarOfUser, {
        userId: action.payload.data.user_id,
        fromDate: moment(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)).format("DD-MM-YYYY"),
        toDate: moment(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)).format("DD-MM-YYYY"),
      });
      yield put(actions.getCalendarOfUserSuccess(res.data));

      const resTotalShift = yield call(apiCalendar.getTotalShift, {
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear()
      });
      yield put(actions.getTotalShiftSuccess(resTotalShift.data));
    }
    yield action.payload.callback_success();
    yield put(actions.updateUI());
  } catch (err) {
    yield action.payload.callback_fail();
    yield put(actions.updateCanceTakeleaveFail(err.response));
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

/**
 * delete an overtime employee in a shift => day, month
 */
function* handleDeleteEmployeeToShift(action) {
  try {
    yield call(apiCalendar.deleteEmployeeToShift, action.payload.data);
    const selectedBtn = action.payload.selectedBtn;

    if (selectedBtn === CONSTS.DAY) {
      //Handle for day
      const res = yield call(apiCalendar.getCalendar, {
        fromDate: action.payload.data.overtime_at,
        toDate: action.payload.data.overtime_at
      });
      yield put(actions.getCalendarSuccess(res.data));
    } else {
      //Handle for month
      const selectedDate = action.payload.selectedDate;
      const res = yield call(apiCalendar.getCalendarOfUser, {
        userId: action.payload.data.user_id,
        fromDate: moment(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)).format("DD-MM-YYYY"),
        toDate: moment(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)).format("DD-MM-YYYY"),
      });
      yield put(actions.getCalendarOfUserSuccess(res.data));

      const resTotalShift = yield call(apiCalendar.getTotalShift, {
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear()
      });
      yield put(actions.getTotalShiftSuccess(resTotalShift.data));
    }
    yield action.payload.callback_success();
    yield put(actions.updateUI());
  } catch (err) {
    yield put(actions.deleteEmployeeToShiftFail(err.response));
    yield action.payload.callback_fail();
  }
}

/**
 * Add an employee to a shift in day management
 */
function* handleAddEmployeesToShift(action) {
  try {
    yield call(apiCalendar.addEmployeesToShift, action.payload);
    const overtimeAt = action.payload.data.overtime_at;
    const res = yield call(apiCalendar.getCalendar, {
      fromDate: overtimeAt,
      toDate: overtimeAt,
    });
    yield put(actions.getCalendarSuccess(res.data));
    yield put(actions.updateUI());
    yield action.payload.callback_success();
  } catch (err) {
    yield put(actions.addEmployeesToShiftFail(err.response));
    yield action.payload.callback_fail();
  }
}

function* handleGetListShift(action) {
  try {
    const res = yield call(apiShift.getListShift, action.payload)
    yield put(actions.getListShiftSuccess(res.data))
  } catch (error) {
    return error;
  }
}

/**
 * add a few overtime shifts to an employee in month management
 */
function* handleAddOverTimeShift(action) {
  try {
    yield call(apiShift.addOTShift, action.payload);
    const selectedDate = action.payload.selectedDate;
    const res = yield call(apiCalendar.getCalendarOfUser, {
      userId: action.payload.data.user_id,
      fromDate: moment(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)).format("DD-MM-YYYY"),
      toDate: moment(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)).format("DD-MM-YYYY"),
    });
    yield put(actions.getCalendarOfUserSuccess(res.data));
    const resTotalShift = yield call(apiCalendar.getTotalShift, {
      month: selectedDate.getMonth() + 1,
      year: selectedDate.getFullYear()
    });
    yield put(actions.getTotalShiftSuccess(resTotalShift.data));
    yield put(actions.updateUI());
    yield action.payload.callback_success();
  } catch (err) {
    yield put(actions.addOverTimeShiftFail(err.response));
    yield action.payload.callback_fail();
  }
}

/**
 * Get checkin-checkout of employees in a day => week management
 */
function* handleGetCheckInOut(action) {
  try {
    const res = yield call(apiCalendar.getCheckInCheckOut, action.payload);
    yield put(actions.getCheckInOutSuccess(res.data));
    yield put(actions.updateUI());
  } catch (err) {
    yield put(actions.getCheckInOutFail(err.response));
  }
}



//////////////////////////////////////////////////////
// attach to Watcher

function* getCalendar() {
  yield takeEvery(actions.getCalendar, handleGetCalendar);
}

function* getCalendarWeek() {
  yield takeEvery(actions.getCalendarWeek, handleGetCalendarWeek);
}

function* getCheckInOut() {
  yield takeEvery(actions.getCheckInOut, handleGetCheckInOut);
}

function* getCalendarOfUser() {
  yield takeEvery(actions.getCalendarOfUser, handleGetCalendarOfUser);
}

function* getListShift() {
  yield takeEvery(actions.getListShift, handleGetListShift)
}

function* updateTakeLeave() {
  yield takeEvery(actions.updateTakeLeave, handleUpdateTakeLeave);
}

function* getAccountList() {
  yield takeEvery(actions.getAccountList, handleGetAccountList);
}

function* deleteEmployeeToShift() {
  yield takeEvery(actions.deleteEmployeeToShift, handleDeleteEmployeeToShift);
}

function* addEmployeeToShift() {
  yield takeEvery(actions.addEmployeesToShift, handleAddEmployeesToShift);
}

function* updateCancelTakeLeave() {
  yield takeEvery(actions.updateCancelTakeLeave, handleUpdateCancelTakeLeave);
}

function* addOverTimeShift() {
  yield takeEvery(actions.addOverTimeShift, handleAddOverTimeShift);
}

function* getTotalShift() {
  yield takeEvery(actions.getTotalShift, handleGetTotalShift);
}

//////////////////////////////////////////////////////
export default [
  getCalendar,
  getCalendarWeek,
  updateTakeLeave,
  getAccountList,
  deleteEmployeeToShift,
  addEmployeeToShift,
  updateCancelTakeLeave,
  getCalendarOfUser,
  getListShift,
  addOverTimeShift,
  getCheckInOut,
  getTotalShift,
];
