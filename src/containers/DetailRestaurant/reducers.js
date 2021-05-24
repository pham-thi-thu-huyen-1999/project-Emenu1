/**
 * @file reducer
 */

// Using to control stage

import freeze from "deep-freeze";
import { handleActions } from "redux-actions";
import * as actions from "./actions";
export const name = "DetailRestaurant";

const initialState = freeze({
  infoPartner: null,
  isLoading: false,
  isLogined: false,
  isError: false,
  errorMessage: "",
  comboItemList: [],
  comboItemListItem: [],
  categoryItemList: [],
  comboItemDetailOfItem: [],
  infoPartnerSetting: {},
  orderItem: [],
  comboId: "",
  tableDetail: {},
  itemLists: [], // list all item nocombo
  listItemByComboId: []
});

export default handleActions(
  {
    [actions.getInfoPartner]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getInfoPartnerSuccess]: (state, action) => {
      return freeze({
        ...state,
        infoPartner: { ...action.payload.data },
        isLoading: false,
      })
    },
    [actions.getInfoPartnerFail]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      })
    },
    /**
      * Lay danh sach loai
     **/
    [actions.getCategoryItemList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getCategoryItemListSuccess]: (state, action) => {
      return freeze({
        ...state,
        categoryItemList: action.payload.data,
        isLoading: false,
      });
    },
    [actions.getCategoryItemListFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
      });
    },
    /**
      * Lay danh sach combo
     **/
    [actions.getComboItemList]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      });
    },
    [actions.getComboItemListSuccess]: (state, action) => {
      let arrayTemp = [];
      for (let i = 0; i < action.payload.arrayFilter[0].length; i++) {
        for (let j = 0; j < action.payload.arrayFilter[i].combo_item_details.length; j++) {
          for (let k = 0; k < action.payload.arrayFilter[i].combo_item_details[j].items.length; k++) {
            if (action.payload.arrayFilter[i].combo_item_details[j].category_name === state.categoryItemList[0].name) {
              arrayTemp.push(action.payload.arrayFilter[i].combo_item_details[j].items[k]);
            }
          }
        }
      }
      return freeze({
        ...state,
        comboItemList: action.payload.arrayFilter, //danh sách các combo có is_price là false
        comboItemListItem: arrayTemp,
        comboId: action.payload.data[0].id,
        isLoading: false
      });
    },
    [actions.getComboItemListFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    /**
      * get list item by comboid
     **/
    [actions.getComboById]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getComboByIdSuccess]: (state, action) => {
      let arrayTemp = [];
      for (var index = 0; index < action.payload.length; index++) {
        for (var index1 = 0; index1 < action.payload[index].items.length; index1++) {
          arrayTemp.push(action.payload[index].items[index1]);
        }
      }
      return freeze({
        ...state,
        /* comboItemDetail: action.payload.data, */
        comboItemDetailOfItem: arrayTemp,
        isLoading: false
      })
    },
    [actions.getComboByIdFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      });
    },
    /**
     * infoPartnerSetting: info partnerSetting
     * dataItems: list all item no combo or is combo
     * dataItemByComboId: list item by comboid
     */
    [actions.getPartnerSetting]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getPartnerSettingSuccess]: (state, action) => {
      const {
        infoPartnerSetting,
        dataItems,
        dataItemsByComboId
      } = action.payload;
      let listItemByComboId = [];
      for (let index = 0; index < dataItemsByComboId.length; index++) {
        for (let index1 = 0; index1 < dataItemsByComboId[index].items.length; index1++) {
          listItemByComboId.push(dataItemsByComboId[index].items[index1]);
        }
      }
      return freeze({
        ...state,
        infoPartnerSetting: infoPartnerSetting,
        itemLists: dataItems,
        isLoading: false
      })
    },
    [actions.getPartnerSettingFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      })
    },
    [actions.getOrderItem]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getOrderItemSuccess]: (state, action) => {
      return freeze({
        ...state,
        orderItem: action.payload,
        isLoading: false
      })
    },
    [actions.getOrderItemFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      })
    },
    /**
     * return table detail with id
     */
    [actions.getTableById]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getTableByIdSuccess]: (state, action) => {
      return freeze({
        ...state,
        tableDetail: action.payload.data,
        isLoading: false
      })
    },
    [actions.getTableByIdFail]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false
      })
    },
  },
  initialState
);
