/**
 * @file reducer
 */
// Using to control stage
import freeze from "deep-freeze";
import { handleActions } from "redux-actions";
import * as actions from "./actions";
export const name = "CalendarManagement";

const initialState = freeze({
  calendar: [],
  calendarWeek: [],
  calendarOfUser: [],
  accountList: [],
  listShifts: [],
  checkInOut: [],
  totalShift: [],
  updateFlag: false,
  isLoading: false,
  isError: false,
});

export default handleActions(
  {
    [actions.getCalendar]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getCalendarSuccess]: (state, action) => {
      return freeze({
        ...state,
        calendar: [...action.payload.data],
        isLoading: false
      })
    },
    [actions.getCalendarFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true
      })
    },

    ////////////////////////////////////////////////////////
    [actions.updateTakeLeave]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.updateTakeLeaveSuccess]: (state, action) => {
      return freeze({
        ...state,
        calendar: [],
        isLoading: false
      })
    },
    [actions.updateTakeLeaveFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true
      })
    },

    ///////////////////////////////////////////////////////
    [actions.getAccountList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getAccountListSuccess]: (state, action) => {
      return freeze({
        ...state,
        accountList: action.payload.data,
        isLoading: false
      })
    },
    [actions.getAccountListFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true
      })
    },
    
    ///////////////////////////////////////////////////////
    [actions.addEmployeesToShift]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.addEmployeesToShiftSuccess]: (state, action) => {
      return freeze({
        ...state,
        accountList: action.payload.data,
        isLoading: false
      })
    },
    [actions.addEmployeesToShiftFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true
      })
    },

    /////////////////////////////////////////////////////////
    [actions.getCalendarWeek]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getCalendarWeekSuccess]: (state, action) => {
      return freeze({
        ...state,
        calendarWeek: [...action.payload.data],
        isLoading: false
      })
    },
    [actions.getCalendarWeekFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true
      })
    },

    ////////////////////////////////////////////////////////
    [actions.deleteEmployeeToShift]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.deleteEmployeeToShiftSuccess]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      })
    },
    [actions.deleteEmployeeToShiftFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true
      })
    },

    ////////////////////////////////////////////////////////
    [actions.updateCancelTakeLeave]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.updateCacelTakeLeaveSuccess]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      })
    },
    [actions.updateCanceTakeleaveFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true
      })
    },

    ////////////////////////////////////////////////////////
    [actions.updateUI]: (state, action) => {
      return freeze({
        ...state,
        updateFlag: true,
        isLoading: false
      })
    },
    [actions.noUpdateUI]: (state, action) => {
      return freeze({
        ...state,
        updateFlag: false,
        isLoading: false
      })
    },

    //////////////////////////////////////////////////
    [actions.getCalendarOfUser]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getCalendarOfUserSuccess]: (state, action) => {
      return freeze({
        ...state,
        calendarOfUser: action.payload.data,
        isLoading: false
      })
    },
    [actions.getCalendarOfUserFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true
      })
    },

    //////////////////////////////////////////////////
    [actions.getListShift]: (state, action) => {
      return {
        ...state,
        isLoading: true
      }
    },
    [actions.getListShiftSuccess]: (state, action) => {
      return {
        ...state,
        listShifts: action.payload.data,
        isLoading: false
      }
    },
    [actions.getListShiftFail]: (state, action) => {
      return {
        ...state,
        isError: true
      }
    },

    /////////////////////////////////////////////////////////
    [actions.addOverTimeShift]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.addOverTimeShiftSuccess]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      })
    },
    [actions.addOverTimeShiftFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true
      })
    },

    /////////////////////////////////////////////////////////
    [actions.getCheckInOut]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getCheckInOutSuccess]: (state, action) => {
      return freeze({
        ...state,
        checkInOut: [...action.payload.data],
        isLoading: false
      })
    },
    [actions.getCheckInOutFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true
      })
    },

    /////////////////////////////////////////////////////////
    [actions.resetCheckInOut]: (state, action) => {
      return freeze({
        ...state,
        checkInOut: [],
        isLoading: false
      })
    },

    /////////////////////////////////////////////////////////
    [actions.getTotalShift]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getTotalShiftSuccess]: (state, action) => {
      return freeze({
        ...state,
        totalShift: [...action.payload.data],
        isLoading: false
      })
    },
    [actions.getTotalShiftFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true
      })
    },
  },
  initialState
);
