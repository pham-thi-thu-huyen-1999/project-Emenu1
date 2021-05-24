import freeze from "deep-freeze";
import { handleActions } from "redux-actions";
import * as actions from "./actions";
export const name = "bookingTable"
const initialState = freeze({
  listBooking: [],
  isLoading: false,
  isError: false,
  bookingDetail: {},
  tableListByStatus: [],
  areaList: [],
  listTableBooking: [],
  status: {},
  areaListDetails: [],
  tablesByArea: [],
  indexList: 0
})

export default handleActions(
  {
    [actions.getListBookingTable]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getListBookingTableSuccess]: (state, action) => {
      let data = [];
      if (action.payload.index === 0) {
        data = [...action.payload.data]
      } else {
        data = [...state.listBooking, ...action.payload.data]
      }
      return freeze({
        ...state,
        listBooking: data,
        total: action.payload.total,
        indexList: (action.payload.index + action.payload.page_size),
        isLoading: false
      })
    },
    [actions.getListBookingTableFail]: (state, action) => {
      return freeze({
        isLoading: false,
        isError: true
      })
    },
    /**
     * get booking by id
     */
    [actions.getBookingById]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getBookingByIdSuccess]: (state, action) => {
      return freeze({
        ...state,
        bookingDetail: action.payload.data.data,
        isLoading: false
      })
    },
    [actions.getBookingByIdFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true
      })
    },
    /**
     * add booking
     * @param(action)
     */
    [actions.addBookingTable]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.addBookingTableSuccess]: (state, action) => {
      return freeze({
        ...state,
        listBooking: state.listBooking.concat(action.payload.data),
        isLoading: false
      })
    },
    [actions.addBookingTableFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false,
        isError: true
      })
    },
    /**
     * edit booking
     */
    [actions.editBookingTable]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.editBookingTableSuccess]: (state, action) => {
      let newlistBooking = [...state.listBooking]
      for (let i in newlistBooking) {
        if (newlistBooking[i].id === action.payload.data.id) {
          newlistBooking.splice(i, 1, action.payload.data)
        }
      }
      return freeze({
        ...state,
        listBooking: newlistBooking,
        bookingDetail: action.payload.data,
        isLoading: false
      })
    },
    [actions.editBookingTableFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true
      })
    },

    /**
     * get list table by area with table empty
     */
    [actions.getListTableStatus]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getListTableStatusSuccess]: (state, action) => {
      return freeze({
        ...state,
        tableListByStatus: action.payload.data,
        tablesByArea: action.payload.data.length > 0 ? action.payload.data[0].tables : [],
        isLoading: false
      })
    },
    [actions.getListTableStatusFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true
      })
    },
    /**
     * get list Area
     */
    [actions.getListArea]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getListAreaSuccess]: (state, action) => {
      return freeze({
        ...state,
        areaList: action.payload.data,
        isLoading: false
      })
    },
    [actions.getListAreaFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true
      })
    },
    /**
     * reset booking detail
     */
    [actions.resetBookingDetail]: (state, action) => {
      return freeze({
        ...state,
        bookingDetail: {}
      })
    },
    /**
     * list table of booking
     */
    [actions.getListTableBooking]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getListTableBookingSuccess]: (state, action) => {
      return freeze({
        ...state,
        listTableBooking: action.payload.data,
        isLoading: false
      })
    },
    [actions.getListTableBookingFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true
      })
    },
    /**
   * update status booking
   */
    [actions.updateStatusBooking]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.updateStatusBookingSuccess]: (state, action) => {
      let newlistBooking = [...state.listBooking]
      for (let i in newlistBooking) {
        if (newlistBooking[i].id === action.payload.data.data.id) {
          newlistBooking.splice(i, 1, action.payload.data.data)
        }
      }
      return freeze({
        ...state,
        listBooking: newlistBooking,
        isLoading: false
      })
    },
    [actions.updateStatusBookingFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true
      })
    },
    /**
     * list area show status detail
     */
    [actions.getListAreaByParnerId]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getListAreaByParnerIdSuccess]: (state, action) => {
      return freeze({
        ...state,
        areaListDetails: action.payload.data,
        isLoading: false
      })
    },
    [actions.getListAreaByParnerIdFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true
      })
    },
    /**
     * 
     */
    [actions.updateListBooking]: (state, action) => {
      const booking = state.listBooking.find(booking => booking.id === action.payload.booking_id);
      let listBooking = [...state.listBooking];
      if (!booking) {
        listBooking = [action.payload.data, ...state.listBooking];
      }
      return freeze({
        ...state,
        listBooking,
        isLoading: false
      })
    },
  },
  initialState
)