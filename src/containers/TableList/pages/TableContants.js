const TABLE_STATUS_EMPTY = 0;
const TABLE_STATUS_IN_USE = 1;

const TABLE_JOINED = 1;

const TABLE_FEATURE_VALUE = {
  FOOD_LIST: 0,
  CHECK_OUT: 1,
  CHANGE_EMPTY_TABLE: 2,
  ADD_TABLE: 3,
  SEPERATE_TABLE: 4,
  COMBINE_TABLE_INFO: 5,
  ADD_ORDER: 6,
  CHANGE_TABLE: 7,
  CANCEL_CHECK_OUT: 8,
  COMBINE_TABLE: 9,
  CANCEL_ORDER: 10,
  ORDER: 11
};

const TABLE_TYPE_VALUE = {
  VIP: 2,
  NORMAL: 1
}

const TABLE_FEATURE_KEY = [
  'FOOD_LIST',
  'CHECK_OUT',
  'CHANGE_EMPTY_TABLE',
  'ADD_TABLE',
  'SEPERATE_TABLE',
  'COMBINE_TABLE_INFO',
  'ADD_ORDER',
  // 'CHANGE_TABLE',
  'CANCEL_CHECK_OUT',
  // 'COMBINE_TABLE',
  'CANCEL_ORDER',
  'ORDER',
  'RESTORE_ORDER'
]

const AVAILABLE_TABLE_FEATURE_KEY = [
  'SHOW_QR_CODE',
  'SEPERATE_TABLE',
  'COMBINE_TABLE_INFO'
]

const TABLE_ICON_TYPE = {
  0: "round",
  1: "square",
  2: "rectangle",
  3: "vertical-rectangle"
}

export const NOTIFICATIONSTOSHOW = 4;

const NOTI_ACTION_CALL_STAFF = "call_staff";
const NOTI_ACTION_CALL_PAYMENT = "call_payment";
export const NOTI_ACTION_STAFF_ORDER_ITEM = "staff_order_item";
export const NOTI_ACTION_RESET_TABLE = "reset_table";
export const NOTI_ACTION_CANCEL_PAYMENT = "cancel_payment";
export const NOTI_ACTION_FINISHED_PAYMENT = "finished_payment";
export const NOTI_ACTION_RELOAD_TABLE = [
  "finished_payment",
  "cancel_payment"
]
export default {
  TABLE_STATUS_EMPTY,
  TABLE_STATUS_IN_USE,
  TABLE_FEATURE_VALUE,
  TABLE_FEATURE_KEY,
  TABLE_TYPE_VALUE,
  TABLE_JOINED,
  TABLE_ICON_TYPE,
  AVAILABLE_TABLE_FEATURE_KEY,
  NOTI_ACTION_CALL_STAFF,
  NOTI_ACTION_CALL_PAYMENT,
  NOTI_ACTION_STAFF_ORDER_ITEM,
  NOTI_ACTION_RESET_TABLE,
};
