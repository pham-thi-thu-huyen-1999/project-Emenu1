import { createAction } from "redux-actions";
import * as CONST from "./constants";

export const getPromotionList = createAction(CONST.GETPROMOTIONS);
export const getPromotionListSuccess = createAction(
  CONST.GETPROMOTIONS_SUCCESS
);
export const getPromotionListFail = createAction(CONST.GETPROMOTIONS_FAIL);

export const createPromotion = createAction(CONST.CREATEPROMOTION);
export const createPromotionSuccess = createAction(
  CONST.CREATEPROMOTION_SUCCESS
);
export const createPromotionFail = createAction(CONST.CREATEPROMOTION_FAIL);

export const deletePromotion = createAction(CONST.DELETEPROMOTION);
export const deletePromotionSuccess = createAction(
  CONST.DELETEPRMOTION_SUCCESS
);
export const deletePromotionFail = createAction(CONST.DELETEPRMOTION_FAIL);

export const editPromotion = createAction(CONST.EDITPROMOTION);
export const editPromotionSuccess = createAction(CONST.EDITPROMOTION_SUCCESS);
export const editPromotionFail = createAction(CONST.EDITPROMOTION_FAIL);
