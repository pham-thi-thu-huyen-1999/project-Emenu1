/**
 * @file reducer
 */

// Using to control stage

import freeze from "deep-freeze";
import { handleActions } from "redux-actions";
import * as actions from "./actions";
import { save } from "../../services/localStorage";
export const name = "notification";

const initialState = freeze({
  notifications: [],
  isLoading: false,
  isError: false,
  errorMessage: "",
  indexNoti: 0,
  quantityNotis: {},
  total: 0
});

export default handleActions(
  {
    [actions.getNotifications]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    [actions.getNotificationsSuccess]: (state, action) => {
      const { data, index } = action.payload;
      let newData = (data.index < data.total) && index > 0 ? [...state.notifications, ...data.data]
        : data.data
      save("notifications", newData)
      return freeze({
        ...state,
        notifications: newData,
        indexNoti: (data.index + data.page_size),
        total: data.total,
        isLoading: false
      });
    },
    [actions.getNotificationsFailure]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message,
      });
    },
    /**
     * Subcriber to topic
     */
    [actions.subcriberToTopic]: (state, action) => {
      return freeze({
        ...state,
        isLoading: true,
      });
    },
    /**
     * Subcriber to topic success
     */
    [actions.subcriberToTopicSuccess]: (state, action) => {
      return freeze({
        ...state,
        notifications: action.payload.data,
        isLoading: false,
      });
    },
    /**
     * Subcriber to topic failure
     */
    [actions.subcriberToTopicFailure]: (state, action) => {
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        errorMessage: action.payload.data.error.internal_message,
      });
    },

    [actions.updateQuantityNoti]: (state, action) => {
      let quantityNotis = { ...state.quantityNotis }
      let data = action.payload.data;
      let type = data.type;
      let quantity = data.quantity;
      quantityNotis = {
        ...quantityNotis,
        [type]: quantity === -1 ? 0 : parseInt(quantityNotis[type] || 0) + parseInt(quantity),
      }
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        quantityNotis,
      });
    },

    [actions.resetQuantityNoti]: (state, action) => {
      let quantityNotis = { ...state.quantityNotis }
      let type = action.payload.type;
      if (type) {
        quantityNotis = {
          ...quantityNotis,
          [type]: 0,
        }
      }
      return freeze({
        ...state,
        isError: true,
        isLoading: false,
        quantityNotis,
      });
    },
  },
  initialState
);
