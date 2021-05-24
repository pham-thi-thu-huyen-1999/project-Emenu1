import freeze from "deep-freeze";
import { handleActions } from "redux-actions";
import * as actions from "./actions";
export const name = "SettingManagament";

const initialState = freeze({
  infoTax: {},
  userInfo: {},
  isLoading: false,
  isError: false,
  printerBillList: null, //TODO
  printerChickenBarList: null, //TODO
  printerChickenBarById: null,
  printerBillById: null
});

export default handleActions(
  {
    [actions.getInfoTaxSetting]: (state, action) => {
      return {
        ...state,
        isLoading: true
      }
    },
    [actions.getInfoTaxSettingSuccess]: (state, action) => {
      return {
        ...state,
        infoTax: action.payload.data,
        isLoading: false
      }
    },
    [actions.getInfoTaxSettingFail]: (state, action) => {
      return {
        ...state,
        isError: true
      }
    },
    /////////////////////////////////
    [actions.getPartnerById]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getPartnerByIdSuccess]: (state, action) => {
      return freeze({
        ...state,
        userInfo: action.payload.data,
        isLoading: false,
      });
    },
    [actions.getPartnerByIdFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },
    /*
    * Printer Bill - Thu Ngan
    */
    [actions.getPrinterBillList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getPrinterBillListSuccess]: (state, action) => {
      return freeze({
        ...state,
        printerBillList: action.payload.data,
        isLoading: false
      });
    },
    [actions.getPrinterBillListFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    [actions.getPrinterBillById]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getPrinterBillByIdSuccess]: (state, action) => {
      return freeze({
        ...state,
        printerBillById: action.payload.data,
        isLoading: false
      });
    },
    [actions.getPrinterBillByIdFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    [actions.createPrinterBill]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.createPrinterBillSuccess]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      });
    },
    [actions.createPrinterBillFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    [actions.deletePrinterBill]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.deletePrinterBillSuccess]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      });
    },
    [actions.deletePrinterBillFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    [actions.editPrinterBill]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.editPrinterBillSuccess]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      });
    },
    [actions.editPrinterBillFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    /*
    * Printer Chicken Bar - Bep Bar
    */
    [actions.getPrinterChickenBarList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getPrinterChickenBarListSuccess]: (state, action) => {
      return freeze({
        ...state,
        printerChickenBarList: action.payload.data,
        isLoading: false
      });
    },
    [actions.getPrinterChickenBarListFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    [actions.getPrinterChickenBarById]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getPrinterChickenBarByIdSuccess]: (state, action) => {
      return freeze({
        ...state,
        printerChickenBarById: action.payload.data,
        isLoading: false
      });
    },
    [actions.getPrinterChickenBarByIdFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    [actions.createPrinterChickenBar]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.createPrinterChickenBarSuccess]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      });
    },
    [actions.createPrinterChickenBarFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    [actions.deletePrinterChickenBar]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.deletePrinterChickenBarSuccess]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      });
    },
    [actions.deletePrinterChickenBarFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    [actions.editPrinterChickenBar]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.editPrinterChickenBarSuccess]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      });
    },
    [actions.editPrinterChickenBarFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
  },
  initialState
);
