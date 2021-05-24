/**
 * @file reducers
 */

import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { reducer as login, name as nameOfLogin } from "./containers/Login";
import {
  reducer as SettingTable,
  name as nameOfSettingTable,
} from "./containers/SettingScreen/components/Tables";
import {
  reducer as TableManagement,
  name as nameOfTableManagement,
} from "./containers/TableListManagement";
import {
  reducer as UserManagement,
  name as nameOfUserManagement,
} from "./containers/UserManagement";
import {
  reducer as SettingFood,
  name as nameOfSettingFood,
} from "./containers/SettingScreen/components/Foods";
import {
  reducer as FoodManagement,
  name as nameOfFoodManagement
} from "./containers/FoodManagement";

import {
  reducer as FoodCategoryManagement,
  name as nameOfFoodCategoryManagement,
} from "./containers/FoodCategoryManagement";

import {
  reducer as comboDish,
  name as nameComboDish
} from "./containers/DishManagement"


import {
  reducer as Notification,
  name as nameOfNotification,
} from "./components/Notification";

import {
  reducer as TakeAway,
  name as nameOfTakeAway,
} from "./containers/TakeAwayScreen";

import {
  reducer as PromotionManagement,
  name as nameOfPromotionManagement,
} from "./containers/PromotionManagement";

import {
  reducer as FoodListIsProcessing,
  name as nameOfFoodListIsProcessing,
} from "./containers/FoodListIsProcessing";

import {
  reducer as BookingTable,
  name as nameBookingTable
} from "./containers/BookingTable";

import {
  reducer as PromotionManagements,
  name as namePromotionManagements
} from "./containers/PromotionManagements"
import {
  reducer as ReportManagement,
  name as nameOfReportManagement,
} from "./containers/ReportManagement";

import { AreaReducer, AreaReducerName } from './containers/AreaManagement/reducers';
import {
  reducer as SettingGenerals,
  name as nameOfSettingGeneral,
} from "./containers/SettingScreen/components/General";


import { reducer as TableArrangement, name as nameOfTableArrangement } from "./containers/TableArrangement";
import {
  reducer as shiftManagament,
  name as nameShiftManagament,
} from "./containers/ShiftManagement";
import { TableListReducer, TableListReducerName } from './containers/TableList/reducers';
import { PaymentReducer, PaymentReducerName } from './containers/PaymentManagement/reducers';

import {
  reducer as CalendarManagement,
  name as nameOfCalendarManagement,
} from "./containers/CalendarManagement";

import {
  reducer as Setting,
  name as nameOfSetting,
} from "./containers/SettingScreen";

import {
  reducer as DetailRestaurant,
  name as nameOfDetailRestaurant,
} from "./containers/DetailRestaurant";

import {
  reducer as RequestPayment,
  name as nameOfRequestPayment,
} from "./containers/RequestPayment";

import {
  reducer as CheckInOutManagement,
  name as nameOfCheckInOutManagement,
} from "./containers/CheckInOutManagement";

import {
  reducer as FoodListIsProcessingBar,
  name as nameOfFoodListIsProcessingBar,
} from "./containers/FoodListIsProcessingBar";

import {
  reducer as AddonManagement,
  name as nameOfAddonManagement
} from "./containers/AddonManagement";
// Place for reducers' app

const reducers = {
  [nameOfLogin]: login,
  [nameOfSettingTable]: SettingTable,
  [nameOfTableManagement]: TableManagement,
  [nameOfUserManagement]: UserManagement,
  [nameOfSettingFood]: SettingFood,
  [nameOfFoodManagement]: FoodManagement,
  [nameOfFoodCategoryManagement]: FoodCategoryManagement,
  [nameComboDish]: comboDish,
  [nameOfNotification]: Notification,
  [nameOfTakeAway]: TakeAway,
  [nameOfPromotionManagement]: PromotionManagement,
  [nameBookingTable]: BookingTable,
  [namePromotionManagements]: PromotionManagements,
  [nameOfFoodListIsProcessing]: FoodListIsProcessing,
  [nameOfReportManagement]: ReportManagement,
  [AreaReducerName]: AreaReducer,
  [nameOfSettingGeneral]: SettingGenerals,
  [nameOfCalendarManagement]: CalendarManagement,
  [TableListReducerName]: TableListReducer,
  [nameOfTableArrangement]: TableArrangement,
  [nameShiftManagament]: shiftManagament,
  [TableListReducerName]: TableListReducer,
  [PaymentReducerName]: PaymentReducer,
  [nameOfSetting]: Setting,
  [nameOfDetailRestaurant]: DetailRestaurant,
  [nameOfRequestPayment]: RequestPayment,
  [nameOfCheckInOutManagement]: CheckInOutManagement,
  [nameOfFoodListIsProcessingBar]: FoodListIsProcessingBar,
  [nameOfAddonManagement]: AddonManagement,
};

export default (history) =>
  combineReducers({
    ...reducers,
    router: connectRouter(history),
  });
