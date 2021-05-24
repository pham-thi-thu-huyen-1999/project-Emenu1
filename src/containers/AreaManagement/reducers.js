import freeze from "deep-freeze";
import { handleActions } from "redux-actions";
import * as actions from "./actions";

const initialState = freeze({
  listArea: [],
  isLoading: false,
  areaInfo: {},
  selectedArea: null,
  listAreaByPartner: []
})

const AreaReducerName = "AreaManagement";

const AreaReducer =  handleActions(
  {
    // Get list area
    [actions.getListArea]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getListAreaSuccess]: (state, action) => {
      return freeze({
        ...state,
        listArea: action.payload.data,
        isLoading: false,
      })
    },
    [actions.getListAreaFailure]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      })
    },

    // Get area info
    [actions.getAreaInfo]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getAreaInfoSuccess]: (state, action) => {
      return freeze({
        ...state,
        areaInfo: action.payload.data,
        isLoading: false,
      })
    },
    [actions.getAreaInfoFailure]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      })
    },

    // Delete area
    [actions.deleteArea]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.deleteAreaSuccess]: (state, action) => {
      const {areaId} = action.payload;
      let newAreaList = [...state.listArea];
      newAreaList = newAreaList.filter(area => {
        return area.id !== areaId;
      })
      return freeze({
        ...state,
        listArea: newAreaList,
        isLoading: false,
      })
    },
    // Select area
    [actions.selectArea]: (state, action) => {
      const {area} = action.payload;
      return freeze({
        ...state,
        selectedArea: area
      })
    },
    [actions.deselectArea]: (state, action) => {
      return freeze({
        ...state,
        selectedArea: null
      })
    },



    // Get area by partner
    [actions.getListAreaByPartnerId]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true
      })
    },
    [actions.getListAreaByPartnerIdSuccess]: (state, action) => {
      return freeze({
        ...state,
        listAreaByPartner: action.payload.data,
        isLoading: false,
      })
    },
    [actions.getListAreaByPartnerIdFailure]: (state, action) => {
      return freeze({
        ...state,
        isLoading: false
      })
    }
  },
  initialState
)

export {
  AreaReducer,
  AreaReducerName
}