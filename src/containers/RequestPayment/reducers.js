import * as actions from "./actions";
import freeze from "deep-freeze";
import { handleActions } from "redux-actions";
import pagination from "../../utils/pagination";
import { LIMITREQPAYMENT } from "./consts";
export const name = "RequestPayment";

const initialState = freeze({
  listRequestPayment: [],
  isLoading: false,
  isError: false,
  page: 1,
  pageCount: 0,
  orderDetail: {},
  reqPaymentDetail: {}
});
const dataAfterAdd = (data) => {
  let lstOrder = data.order_items
  const newData = lstOrder.map(item => {
    return { ...item, isEdit: false }
  })
  const allData = { ...data, order_items: newData }
  return allData
}
const searchData = (data, nameSearch) => {
  data.filter(item => {
    let { name_search } = item.order.table
    if (name_search) {
      return name_search.toLowerCase().indexOf(nameSearch.toLowerCase()) !== -1
    }
  })
}
export default handleActions(
  {
    [actions.getListReqPayment]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getListReqPaymentSuccess]: (state, action) => {
      let data = action.payload.data.data;
      if (action.payload.page === 1) {
        data = action.payload.data.data
      } else {
        data = [...state.listRequestPayment, ...action.payload.data.data]
      }
      if (action.payload.params.nameSearch) {
        data = searchData(data, action.payload.params.nameSearch) !== undefined
          ? searchData(data, action.payload.params.nameSearch) : action.payload.data.data
      }
      return freeze({
        ...state,
        listRequestPayment: data,
        pageCount: pagination(LIMITREQPAYMENT, action.payload.data.total),
        page: action.payload.page + 1,
        isLoading: false
      })
    },
    [actions.getListReqPaymentFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    //
    [actions.getDetailReqPayment]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getDetailReqPaymentSuccess]: (state, action) => {
      const { resOrderId, resReqdetail } = action.payload
      return freeze({
        ...state,
        reqPaymentDetail: resReqdetail.data,
        orderDetail: resOrderId.data,
        isLoading: false
      })
    },
    [actions.getDetailReqPaymentFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    //
    [actions.getOrderItemById]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getOrderItemByIdSuccess]: (state, action) => {
      return freeze({
        ...state,
        orderDetail: dataAfterAdd(action.payload.data),
        isLoading: false
      })
    },
    [actions.getOrderItemByIdFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    //
    [actions.getInfoDetailProvisiVote]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getInfoDetailProvisiVoteSuccess]: (state, action) => {
      return freeze({
        ...state,
        detailProviVotes: action.payload.data,
        isLoading: false
      })
    },
    [actions.getInfoDetailProvisiVoteFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    }
  },
  initialState
)