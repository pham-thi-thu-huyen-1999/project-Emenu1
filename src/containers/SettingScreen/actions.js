import { createAction } from "redux-actions";
import * as CONST from "./constants";

export const getInfoTaxSetting = createAction(CONST.GETINFOTAXSETTING);
export const getInfoTaxSettingSuccess = createAction(CONST.GETINFOTAXSETTING_SUCCESS);
export const getInfoTaxSettingFail = createAction(CONST.GETINFOTAXSETTING_FAIL);

export const updateInfoTaxSetting = createAction(CONST.UPDATEINFOTAXSETTING);
export const updateInfoTaxSettingSuccess = createAction(CONST.UPDATEINFOTAXSETTING_SUCCESS);
export const updateInfoTaxSettingFail = createAction(CONST.UPDATEINFOTAXSETTING_FAIL);

export const getPartnerById = createAction(CONST.GETPARTNERBYID);
export const getPartnerByIdSuccess = createAction(
  CONST.GETPARTNERBYID_SUCCESS
);
export const getPartnerByIdFail = createAction(CONST.GETPARTNERBYID_FAIL);

/*
  * Print bill - thu ngan
*/
export const getPrinterBillList = createAction(CONST.GETPRINTERBILLLIST);
export const getPrinterBillListSuccess = createAction(CONST.GETPRINTERBILLLIST_SUCCESS);
export const getPrinterBillListFail = createAction(CONST.GETPRINTERBILLLIST_FAIL);

export const getPrinterBillById = createAction(CONST.GETPRINTERBILLBYID);
export const getPrinterBillByIdSuccess = createAction(CONST.GETPRINTERBILLBYID_SUCCESS);
export const getPrinterBillByIdFail = createAction(CONST.GETPRINTERBILLBYID_FAIL);

export const createPrinterBill = createAction(CONST.CREATEPRINTERBILL);
export const createPrinterBillSuccess = createAction(CONST.CREATEPRINTERBILL_SUCCESS);
export const createPrinterBillFail = createAction(CONST.CREATEPRINTERBILL_FAIL);

export const deletePrinterBill = createAction(CONST.DELETEPRINTERBILL);
export const deletePrinterBillSuccess = createAction(CONST.DELETEPRINTERBILL_SUCCESS);
export const deletePrinterBillFail = createAction(CONST.DELETEPRINTERBILL_FAIL);

export const editPrinterBill = createAction(CONST.EDITPRINTERBILL);
export const editPrinterBillSuccess = createAction(CONST.EDITPRINTERBILL_SUCCESS);
export const editPrinterBillFail = createAction(CONST.EDITPRINTERBILL_FAIL);

/*
  * Print chicken bar - bep va bar
*/
export const getPrinterChickenBarList = createAction(CONST.GETPRINTERCHICKENBARLIST);
export const getPrinterChickenBarListSuccess = createAction(CONST.GETPRINTERCHICKENBARLIST_SUCCESS);
export const getPrinterChickenBarListFail = createAction(CONST.GETPRINTERCHICKENBARLIST_FAIL);

export const getPrinterChickenBarById = createAction(CONST.GETPRINTERCHICKENBARBYID);
export const getPrinterChickenBarByIdSuccess = createAction(CONST.GETPRINTERCHICKENBARBYID_SUCCESS);
export const getPrinterChickenBarByIdFail = createAction(CONST.GETPRINTERCHICKENBARBYID_FAIL);

export const createPrinterChickenBar = createAction(CONST.CREATEPRINTERCHICKENBAR);
export const createPrinterChickenBarSuccess = createAction(CONST.CREATEPRINTERCHICKENBAR_SUCCESS);
export const createPrinterChickenBarFail = createAction(CONST.CREATEPRINTERCHICKENBAR_FAIL);

export const deletePrinterChickenBar = createAction(CONST.DELETEPRINTERCHICKENBAR);
export const deletePrinterChickenBarSuccess = createAction(CONST.DELETEPRINTERCHICKENBAR_SUCCESS);
export const deletePrinterChickenBarFail = createAction(CONST.DELETEPRINTERCHICKENBAR_FAIL);

export const editPrinterChickenBar = createAction(CONST.EDITPRINTERCHICKENBAR);
export const editPrinterChickenBarSuccess = createAction(CONST.EDITPRINTERCHICKENBAR_SUCCESS);
export const editPrinterChickenBarFail = createAction(CONST.EDITPRINTERCHICKENBAR_FAIL);
