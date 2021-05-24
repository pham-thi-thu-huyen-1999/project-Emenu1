import { createAction } from "redux-actions";
import * as CONST from "./constants";

export const getNotifications = createAction(CONST.GETNOTIFICATIONS);

export const getNotificationsSuccess = createAction(
  CONST.GETNOTIFICATIONS_SUCCESS
);

export const getNotificationsFailure = createAction(
  CONST.GETNOTIFICATIONS_FAILURE
);

/**
 * Subcriber to topic
 */
export const subcriberToTopic = createAction(CONST.SUBCRIBERTOTOPIC);

/**
 * Subcriber to topic success
 */
export const subcriberToTopicSuccess = createAction(
  CONST.SUBCRIBERTOTOPIC_SUCCESS
);

/**
 * Subcriber to topic failure
 */
export const subcriberToTopicFailure = createAction(
  CONST.SUBCRIBERTOTOPIC_FAILURE
);

export const changeActionStatus = createAction(CONST.CHANGEACTIONSTATUS)
export const changeActionStatusSuccess = createAction(CONST.CHANGEACTIONSTATUS_SUCCESS)
export const changeActionStatusFail = createAction(CONST.CHANGEACTIONSTATUS_FAIL)

export const createOrder = createAction(CONST.CREATEORDER)
export const createOrderSuccess = createAction(CONST.CREATEORDER_SUCCESS)
export const createOrderFail = createAction(CONST.CREATEORDER_FAIL)

export const updateStatusNoti = createAction(CONST.UPDATESTATUSNOTI)
export const updateStatusNotiSuccess = createAction(CONST.UPDATESTATUSNOTI_SUCCESS)
export const updateStatusNotiFail = createAction(CONST.UPDATESTATUSNOTI_FAIL)

export const getListNotiUnread = createAction(CONST.GETLISTNOTIUNREAD)
export const getListNotiUnreadSuccess = createAction(CONST.UPDATESTATUSNOTI_SUCCESS)
export const getListNotiUnreadFail = createAction(CONST.UPDATESTATUSNOTI_FAIL)

export const deleteNotification = createAction(CONST.DELETENOTI)
export const deleteNotificationSuccess = createAction(CONST.DELETENOTI_SUCCESS)
export const deleteNotificationFail = createAction(CONST.DELETENOTI_FAIL)

export const updateHeaderByNoti = createAction(CONST.UPDATEHEADERBYNOTI);
export const updateQuantityNoti = createAction(CONST.UPDATEQUANTITYNOTI);
export const resetQuantityNoti = createAction(CONST.RESETQUANTITYNOTI);