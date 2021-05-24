// Get notifications
export const GETNOTIFICATIONS = "NOTIFICATION/GETNOTIFICATIONS";
export const GETNOTIFICATIONS_SUCCESS = "NOTIFICATION/GETNOTIFICATIONS_SUCCESS";
export const GETNOTIFICATIONS_FAILURE = "NOTIFICATION/GETNOTIFICATIONS_FAILURE";

//Subcriber to topic
export const SUBCRIBERTOTOPIC = "NOTIFICATION/SUBCRIBERTOTOPIC";
export const SUBCRIBERTOTOPIC_SUCCESS = "NOTIFICATION/SUBCRIBERTOTOPIC_SUCCESS";
export const SUBCRIBERTOTOPIC_FAILURE = "NOTIFICATION/SUBCRIBERTOTOPIC_FAILURE";

export const CHANGEACTIONSTATUS = "NOTIFICATION/CHANGEACTIONSTATUS";
export const CHANGEACTIONSTATUS_SUCCESS = "NOTIFICATION/CHANGEACTIONSTATUS_SUCCESS";
export const CHANGEACTIONSTATUS_FAIL = "NOTIFICATION/CHANGEACTIONSTATUS_FAIL";

export const CREATEORDER = "NOTIFICATION/CREATEORDER";
export const CREATEORDER_SUCCESS = "NOTIFICATION/CREATEORDER_SUCCESS";
export const CREATEORDER_FAIL = "NOTIFICATION/CREATEORDER_FAIL";

export const UPDATESTATUSNOTI = "NOTIFICATION/UPDATESTATUSNOTI";
export const UPDATESTATUSNOTI_SUCCESS = "NOTIFICATION/UPDATESTATUSNOTI_SUCCESS";
export const UPDATESTATUSNOTI_FAIL = "NOTIFICATION/UPDATESTATUSNOTI_FAIL";

export const GETLISTNOTIUNREAD = "NOTIFICATION/GETLISTNOTIUNREAD";
export const GETLISTNOTIUNREAD_SUCCESS = "NOTIFICATION/GETLISTNOTIUNREAD_SUCCESS";
export const GETLISTNOTIUNREAD_FAIL = "NOTIFICATION/GETLISTNOTIUNREAD_FAIL";

export const DELETENOTI = "NOTIFICATION/DELETENOTI";
export const DELETENOTI_SUCCESS = "NOTIFICATION/DELETENOTI_SUCCESS";
export const DELETENOTI_FAIL = "NOTIFICATION/DELETENOTI_FAIL";

export const UPDATEHEADERBYNOTI = "NOTIFICATION/UPDATEHEADERBYNOTI"
export const UPDATEQUANTITYNOTI = "NOTIFICATION/UPDATEQUANTITYNOTI"
export const RESETQUANTITYNOTI = "NOTIFICATION/RESETQUANTITYNOTI"
export const KITCHEN = "KITCHEN";
export const BAR = "BAR";
export const BOOK_TABLE = "BOOK_TABLE";
export const TAKE_AWAY = "TAKE_AWAY";

export const URL_KITCHEN = "/dish-processing";
export const URL_BAR = "/dish-processing-bar";
export const URL_BOOK_TABLE = "/booking-table";
export const URL_TAKE_AWAY = "/takeaway";
export const NOTIS_FOR_KITCHEN = [
  "staff_order_item",
  "cancel_item",
  "change_item",
  "cancel_order",
]

export const NOTIS_FOR_BAR = [
  "staff_order_item",
  "cancel_item",
  "change_item",
  "cancel_order",
]

export const NOTIS_FOR_TAKE_AWAY = [
  "staff_order_item"
]

export const NOTIS_FOR_BOOK_TABLE = [
  "reservation"
]