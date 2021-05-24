import { handleActions } from "redux-actions"
import freeze from "deep-freeze"
import * as actions from "./actions";
import pagination from "../../utils/pagination";
import { LIMIT_COMBO, LIMIT_ITEM, LIMIT_PROMOTION } from "../../consts/settings/promotion";
export const name = "PromotionManagements";
const initialState = freeze({
  listPromotion: [],
  limitPage: 0,
  isLoading: false,
  isError: false,
  listPromotionDiscount: [],
  listFood: [],
  promoBillDiscountDetail: {},
  promoItemDiscountDetail: {},
  promoComboItemDiscountDetail: {},
  promoVoucherDetails: {},
  listCombo: [],
  pageCountItem: 0,
  pageCountCombo: 0,
  page: 1
})
export default handleActions(
  {
    [actions.getListPromotion]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.setPage]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
        page: action.payload
      })
    },
    [actions.getListPromotionSuccess]: (state, action) => {
      return freeze({
        ...state,
        listPromotion: state.page && state.page === 1 ? action.payload.data : [...state.listPromotion, ...action.payload.data],
        limitPage: pagination(LIMIT_PROMOTION, action.payload.total),
        page: state.page + 1,
        isLoading: false
      })
    },
    [actions.getListPromotionFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true
      })
    },
    /**
     * get promotion by search name and status
     */
    [actions.getListPromotionBySearch]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getListPromotionBySearchSuccess]: (state, action) => {
      return freeze({
        ...state,
        listPromotion: action.payload.data,
        limitPage: pagination(LIMIT_PROMOTION, action.payload.total),
        page: 1,
        isLoading: false
      })
    },
    [actions.getListPromotionBySearchFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true
      })
    },
    /**
     * list promotionDiscount
     */
    [actions.getListPromotionDiscount]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getListPromotionDiscountSuccess]: (state, action) => {
      return freeze({
        ...state,
        listPromotionDiscount: action.payload.data,
        isLoading: false
      })
    },
    [actions.getListPromotionDiscountFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true
      })
    },
    /**
     * add promotion by BillDiscount
     */
    [actions.addPromotionDiscountBill]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.addPromotionDiscountBillSuccess]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      })
    },
    [actions.addPromotionDiscountBillFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true
      })
    },
    /**
     * get promotion BillDiscount Detail
     */
    [actions.getPromotionBillDiscountById]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getPromotionBillDiscountByIdSuccess]: (state, action) => {
      return freeze({
        ...state,
        promoBillDiscountDetail: action.payload.data,
        isLoading: true
      })
    },
    [actions.getPromotionBillDiscountByIdFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    /**
     * get item discount detail
     */
    [actions.getPromotionItemDiscountById]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getPromotionItemDiscountByIdSuccess]: (state, action) => {
      return freeze({
        ...state,
        promoItemDiscountDetail: action.payload.data,
        isLoading: true
      })
    },
    [actions.getPromotionItemDiscountByIdFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    /**
     * get comboitem discount detail
     */
    [actions.getPromotionComboItemDiscountById]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getPromotionComboItemDiscountByIdSuccess]: (state, action) => {
      return freeze({
        ...state,
        promoComboItemDiscountDetail: action.payload.data,
        isLoading: true
      })
    },
    [actions.getPromotionComboItemDiscountByIdFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      })
    },
    /**
     * get promotion details
     */
    [actions.getPromotionVoucherDiscountById]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getPromotionVoucherDiscountByIdSuccess]: (state, action) => {
      return freeze({
        ...state,
        promoVoucherDetails: action.payload.data,
        isLoading: true
      })
    },
    [actions.getPromotionVoucherDiscountByIdFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    /**
     * reset data
     */
    [actions.resetPromotionBillDiscountById]: (state, action) => {
      return freeze({
        ...state,
        promoBillDiscountDetail: {},
        isLoading: false
      })
    },
    /**
     * get list item
     */
    [actions.getListItem]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getListItemSuccess]: (state, action) => {
      return freeze({
        ...state,
        listFood: action.payload.data,
        pageCountItem: pagination(LIMIT_ITEM, action.payload.total),
        isLoading: false
      })
    },
    [actions.getListItemFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true
      })
    },
    /**
     * list comboitem
     */
    [actions.getListComboItem]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getListComboItemSuccess]: (state, action) => {
      return freeze({
        ...state,
        listCombo: action.payload.data,
        pageCountCombo: pagination(LIMIT_COMBO, action.payload.total),
        isLoading: false
      })
    },
    [actions.getListComboItemFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true
      })
    },
  },
  initialState
)