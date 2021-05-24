import * as actions from "./actions";
import { handleActions } from "redux-actions";
import freeze from "deep-freeze";

const initialState = freeze({
  listShifts: [],
  isLoading: true,
  isError: true
})
export const name = "shiftManagament";

export default handleActions(
  {
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
    [actions.addShift]: (state, action) => {
      return {
        ...state,
        isLoading: true
      }
    },
    [actions.addShiftSuccess]: (state, action) => {
      let listShifts = [...state.listShifts, action.payload.data]
      return {
        ...state,
        listShifts,
        isLoading: false
      }
    },
    [actions.addShiftFail]: (state, action) => {
      return {
        ...state,
        isError: true
      }
    },
    [actions.editShift]: (state, action) => {
      return {
        ...state,
        isLoading: true

      }
    },
    [actions.editShiftSuccess]: (state, action) => {
      let newListShifts = [...state.listShifts]
      newListShifts.map((shift, index) => {
        if (shift.id === action.payload.data.id) {
          newListShifts.splice(index, 1, action.payload.data)
        }
        return newListShifts
      })
      return {
        ...state,
        listShifts: newListShifts,
        isLoading: false
      }
    },
    [actions.editShiftFail]: (state, action) => {
      return {
        ...state,
        isError: true
      }
    }
  },
  initialState
)