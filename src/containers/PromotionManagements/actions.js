import { createAction } from "redux-actions";
import * as CONST from "./consts"

export const getListPromotion = createAction(CONST.GETLISTPROMOTION)
export const getListPromotionSuccess = createAction(CONST.GETLISTPROMOTION_SUCCESS)
export const getListPromotionFail = createAction(CONST.GETLISTPROMOTION_FAIL)

export const getListPromotionBySearch = createAction(CONST.GETLISTPROMOTIONBYSEARCH)
export const getListPromotionBySearchSuccess = createAction(CONST.GETLISTPROMOTIONBYSEARCH_SUCCESS)
export const getListPromotionBySearchFail = createAction(CONST.GETLISTPROMOTIONBYSEARCH_FAIL)

export const deletePromotion = createAction(CONST.DELETEPROMOTION)

export const getListPromotionDiscount = createAction(CONST.GETLISTPROMOTIONDISCOUNT)
export const getListPromotionDiscountSuccess = createAction(CONST.GETLISTPROMOTIONDISCOUNT_SUCCESS)
export const getListPromotionDiscountFail = createAction(CONST.GETLISTPROMOTIONDISCOUNT_FAIL)

export const addPromotionDiscountBill = createAction(CONST.ADDPROMOTIONBILLDISCOUNT)
export const addPromotionDiscountBillSuccess = createAction(CONST.ADDPROMOTIONBILLDISCOUNT_SUCCESS)
export const addPromotionDiscountBillFail = createAction(CONST.ADDPROMOTIONBILLDISCOUNT_FAIL)

export const getPromotionBillDiscountById = createAction(CONST.GETPROMOTIONBILLDISCOUNTBYID)
export const getPromotionBillDiscountByIdSuccess = createAction(CONST.GETPROMOTIONBILLDISCOUNTBYID_SUCCESS)
export const getPromotionBillDiscountByIdFail = createAction(CONST.GETPROMOTIONBILLDISCOUNTBYID_FAIL)

export const getPromotionItemDiscountById = createAction(CONST.GETPROMOTIONITEMDISCOUNTBYID)
export const getPromotionItemDiscountByIdSuccess = createAction(CONST.GETPROMOTIONITEMDISCOUNTBYID_SUCCESS)
export const getPromotionItemDiscountByIdFail = createAction(CONST.GETPROMOTIONITEMDISCOUNTBYID_FAIL)

export const getPromotionComboItemDiscountById = createAction(CONST.GETPROMOTIONCOMBOITEMDISCOUNTBYID)
export const getPromotionComboItemDiscountByIdSuccess = createAction(CONST.GETPROMOTIONCOMBOITEMDISCOUNTBYID_SUCCESS)
export const getPromotionComboItemDiscountByIdFail = createAction(CONST.GETPROMOTIONCOMBOITEMDISCOUNTBYID_FAIL)

export const getPromotionVoucherDiscountById = createAction(CONST.GETPROMOTIONVOUCHERDISCOUNTBYID)
export const getPromotionVoucherDiscountByIdSuccess = createAction(CONST.GETPROMOTIONVOUCHERDISCOUNTBYID_SUCCESS)
export const getPromotionVoucherDiscountByIdFail = createAction(CONST.GETPROMOTIONVOUCHERDISCOUNTBYID_FAIL)

export const resetPromotionBillDiscountById = createAction(CONST.RESETPROMOTIONBILLDISCOUNTBYID)

export const addPromotionDiscountItem = createAction(CONST.ADDPROMOTIONITEMDISCOUNT)
export const addPromotionDiscountItemSuccess = createAction(CONST.ADDPROMOTIONITEMDISCOUNT_SUCCESS)
export const addPromotionDiscountItemFail = createAction(CONST.ADDPROMOTIONITEMDISCOUNT_FAIL)

export const addPromotionDiscountComboItem = createAction(CONST.ADDPROMOTIONCOMBOITEMDISCOUNT)
export const addPromotionDiscountComboItemSuccess = createAction(CONST.ADDPROMOTIONCOMBOITEMDISCOUNT_SUCCESS)
export const addPromotionDiscountComboItemFail = createAction(CONST.ADDPROMOTIONCOMBOITEMDISCOUNT_FAIL)

export const addPromotionDiscountVoucher = createAction(CONST.ADDPROMOTIONVOUCHERDISCOUNT)
export const addPromotionDiscountVoucherSuccess = createAction(CONST.ADDPROMOTIONVOUCHERDISCOUNT_SUCCESS)
export const addPromotionDiscountVoucherFail = createAction(CONST.ADDPROMOTIONVOUCHERDISCOUNT_FAIL)

export const editPromoDiscountBill = createAction(CONST.EDITPROMOTIONBILLDISCOUNT)

export const editPromoDiscountItem = createAction(CONST.EDITPROMOTIONITEMDISCOUNT)

export const editPromoDiscountComboItem = createAction(CONST.EDITPROMOTIONCOMBOITEMDISCOUNT)

export const editPromoDiscountVoucher = createAction(CONST.EDITPROMOTIONVOUCHERDISCOUNT)

export const getListItem = createAction(CONST.GETLISTITEM)
export const getListItemSuccess = createAction(CONST.GETLISTITEM_SUCCESS)
export const getListItemFail = createAction(CONST.GETLISTITEM_FAIL)

export const getListComboItem = createAction(CONST.GETLISTCOMBOITEM)
export const getListComboItemSuccess = createAction(CONST.GETLISTCOMBOITEM_SUCCESS)
export const getListComboItemFail = createAction(CONST.GETLISTCOMBOITEM_FAIL)

export const setPage = createAction(CONST.SETPAGE)