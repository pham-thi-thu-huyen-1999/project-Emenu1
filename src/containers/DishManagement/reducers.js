
import freeze from "deep-freeze";
import { handleActions } from "redux-actions";
import * as actions from "./actions";
import { LIMIT_COMBO_ITEM, LIMIT_ITEM } from "../../consts/settings/dish/dish";
import pagination from "../../utils/pagination";
export const name = "comboDish";
const initialState = freeze({
    comboList: [],
    isLoading: false,
    isError: false,
    itemList: [],
    comboItemDetail: {},
    countPage: 0,
    countPageItem: 0,
    itemComboList: [],
    dishIconList: []
})

export default handleActions(
    {
        [actions.getComboList]: (state, action) => {
            return freeze({
                ...state,
                isLoading: true
            })
        },
        [actions.getComboListSuccess]: (state, action) => {
            const { data, page } = action.payload
            return freeze({
                ...state,
                comboList: data.data,
                countPage: pagination(LIMIT_COMBO_ITEM, data.total),
                page,
                isLoading: false
            })
        },
        [actions.getComboListFail]: (state, action) => {
            return freeze({
                ...state,
                isError: true,
                isLoading: false
            })
        },
        [actions.getComboById]: (state, action) => {
            return freeze({
                ...state,
                isLoading: true
            })
        },
        [actions.getComboByIdSuccess]: (state, action) => {
            return freeze({
                ...state,
                comboItemDetail: action.payload.data,
                isLoading: false
            })
        },
        [actions.getComboByIdFail]: (state, action) => {
            return freeze({
                ...state,
                isError: true,
                isLoading: false
            })
        },
        [actions.resetComboDetail]: (state, action) => {
            return freeze({
                ...state,
                isLoading: false,
                comboItemDetail: {}
            })
        },
        [actions.createCombo]: (state, action) => {
            return freeze({
                ...state,
                isLoading: true
            })
        },
        [actions.createComboSuccess]: (state, action) => {
            return freeze({
                ...state,
                isLoading: false
            })
        },
        [actions.createComboFail]: (state, action) => {
            return freeze({
                ...state,
                isLoading: false,
                isError: true
            })
        },
        [actions.editCombo]: (state, action) => {
            return freeze({
                ...state,
                isLoading: true
            })
        },
        [actions.editComboSuccess]: (state, action) => {
            var newComboList = [...state.comboList]
            for (let i = 0; i < newComboList.length; i++) {
                if (newComboList[i].id === action.payload.data.id) {
                    newComboList.splice(i, 1, action.payload.data)
                }
            }
            return freeze({
                ...state,
                comboList: newComboList,
                isLoading: false
            })
        },
        [actions.editComboFail]: (state, action) => {
            return freeze({
                ...state,
                isLoading: false,
                isError: true
            })
        },
        [actions.getItems]: (state, action) => {
            return freeze({
                ...state,
                isLoading: true
            })
        },
        [actions.getItemsSuccess]: (state, action) => {
            return freeze({
                ...state,
                itemList: action.payload.data,
                countPageItem: pagination(LIMIT_ITEM, action.payload.total),
                isLoading: false
            })
        },
        [actions.getItemsFail]: (state, action) => {
            return freeze({
                ...state,
                isLoading: false,
                isError: true
            })
        },
        [actions.getItemComboList]: (state, action) => {
            return freeze({
                ...state,
                isLoading: true
            })
        },
        [actions.getItemComboListSuccess]: (state, action) => {
            return freeze({
                ...state,
                itemComboList: action.payload.data.data,
                countPageAddon: pagination(LIMIT_ITEM, action.payload.total_item),
                isLoading: false
            })
        },
        [actions.getItemComboListFail]: (state, action) => {
            return freeze({
                ...state,
                isLoading: false,
                isError: true
            })
        },
        [actions.resetItemComboList]: (state, action) => {
            return freeze({
                ...state,
                isLoading: false,
                itemComboList: {}
            })
        },
        [actions.loadDishIcon]: (state, action) => {
            return freeze({
                ...state,
                isLoading: true
            });
        },
        [actions.getDishIconSuccess]: (state, action) => {
            return freeze({
                ...state,
                isLoading: false,
                dishIconList: action.payload.data.data
            });
        },
    },
    initialState
)