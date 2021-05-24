/**
 * @file reducer
 */
import freeze from "deep-freeze";
import { handleActions } from "redux-actions";
import * as actions from "./actions";
import pagination from "../../utils/pagination";
import { LIMIT_ADDON } from "./constants";
export const name = "FoodManagement";

const initialState = freeze({
  itemList: [],
  unitItemList: [],
  categoryItem: [],
  imageItem: [],
  isLoading: false,
  isError: false,
  generateId: '',
  total: 0,
  totalBySearch: null,
  limitPage: 0,
  infoVatSetting: {},
  addonList: [],
  limitAddonPage: 0,
});

export default handleActions(
  {
    [actions.getItemListBySearchAdvanced]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getItemListBySearchAdvancedSuccess]: (state, action) => {
      return freeze({
        ...state,
        itemList: action.payload.page && action.payload.page === 1
          ? action.payload.data : [...state.itemList, ...action.payload.data],
        totalBySearch: action.payload.total,
        limitPage: pagination(20, action.payload.total),
        isLoading: false
      });

    },
    [actions.getItemListBySearchAdvancedFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    [actions.deleteItem]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.deleteItemSuccess]: (state, action) => {
      var filtered = state.itemList.filter(function (value, index, arr) {
        return value.id !== action.payload.food_id;
      });
      return freeze({
        ...state,
        itemList: filtered,
        isLoading: false
      });
    },
    [actions.deleteItemFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    [actions.getUnitItemList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getUnitItemListSuccess]: (state, action) => {
      return freeze({
        ...state,
        unitItemList: action.payload.data,
        isLoading: false
      });
    },
    [actions.getUnitItemListFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    [actions.getCategoryItemList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getCategoryItemListSuccess]: (state, action) => {
      return freeze({
        ...state,
        categoryItem: action.payload.data,
        isLoading: false
      });
    },
    [actions.getCategoryItemListFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    /* */
    [actions.createItem]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.createItemSuccess]: (state, action) => {
      // var str = "";
      // for (let j = 0; j < action.payload.data.item_imgs.length; j++) {
      //   str = action.payload.data.item_imgs[j].image;
      //   action.payload.data.item_imgs[j] = { ...action.payload.data.item_imgs[j], image_link: str }
      // }
      // for (var i = 0; i < state.unitItemList.length; i++) {
      //   if (state.unitItemList[i].id === action.payload.data.unit_id) {
      //     action.payload.data = { ...action.payload.data, unit_name: state.unitItemList[i].name, unit_item: { name: state.unitItemList[i].name } }
      //   }
      // }
      // for (var k = 0; k < state.categoryItem.length; k++) {
      //   if (state.categoryItem[k].id === action.payload.data.category_id) {
      //     action.payload.data = { ...action.payload.data, category_name: state.categoryItem[k].name, category_item: { name: state.categoryItem[k].name } }
      //   }
      // }
      return freeze({
        ...state,
        // itemList: [...state.itemList, ...action.payload.data],
        isLoading: false
      });
    },
    [actions.createItemFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    /* */
    [actions.editItem]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.editItemSuccess]: (state, action) => {
      let newItemList = Array.from(state.itemList);
      var str = "";
      for (let j = 0; j < action.payload.data.item_imgs.length; j++) {
        str = action.payload.data.item_imgs[j].image;
        action.payload.data.item_imgs[j] = { ...action.payload.data.item_imgs[j], image_link: str }
      }
      for (let i = 0; i < newItemList.length; i++) {
        if (newItemList[i].id === action.payload.data.id) {
          newItemList.splice(i, 1, action.payload.data);
        }
      }

      return freeze({
        ...state,
        itemList: newItemList,
        isLoading: false
      });
    },
    [actions.editItemFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },
    /* */
    [actions.getGenerateById]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getGenerateByIdSuccess]: (state, action) => {
      return freeze({
        ...state,
        generateId: action.payload.data.sku,
        isLoading: false
      });
    },
    [actions.getGenerateByIdFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    /* */
    [actions.uploadImageItem]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.uploadImageItemSuccess]: (state, action) => {
      return freeze({
        ...state,
        imageItem: [...action.payload.data],
        isLoading: false
      });
    },
    [actions.uploadImageItemFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    [actions.startLoading]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    /**
     * info vat setting by partner
     */
    [actions.getInfoVatSetting]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getInfoVatSettingSuccess]: (state, action) => {
      return freeze({
        ...state,
        infoVatSetting: action.payload.data,
        isLoading: false
      });
    },

    /**
     * Get addon list with params
     */
    [actions.getAddonList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getAddonListSuccess]: (state, action) => {
      return freeze({
        ...state,
        addonList: action.payload.data,
        limitAddonPage: pagination(LIMIT_ADDON, action.payload.total),
        isLoading: false
      });

    },
    [actions.getAddonListFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
  },
  initialState
);
