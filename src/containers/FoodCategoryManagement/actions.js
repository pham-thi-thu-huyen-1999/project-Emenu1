import { createAction } from "redux-actions";
import * as CONST from "./constants";

export const getCategoryItemList = createAction(CONST.GETCATEGORYITEMLIST);
export const getCategoryItemListSuccess = createAction(CONST.GETCATEGORYITEMLIST_SUCCESS);
export const getCategoryItemListFail = createAction(CONST.GETCATEGORYITEMLIST_FAIL);

export const createCategoryItem = createAction(CONST.CREATECATEGORYITEM);
export const createCategoryItemSuccess = createAction(CONST.CREATECATEGORYITEM_SUCCESS);
export const createCategoryItemFail = createAction(CONST.CREATECATEGORYITEM_FAIL);

export const deleteCategoryItem = createAction(CONST.DELETECATEGORYITEM);
export const deleteCategoryItemSuccess = createAction(CONST.DELETECATEGORYITEM_SUCCESS);
export const deleteCategoryItemFail = createAction(CONST.DELETECATEGORYITEM_FAIL);

export const editCategoryItem = createAction(CONST.EDITCATEGORYITEM);
export const editCategoryItemSuccess = createAction(CONST.EDITCATEGORYITEM_SUCCESS);
export const editCategoryItemFail = createAction(CONST.EDITCATEGORYITEM_FAIL);

