import { all } from "redux-saga/effects";
//////////////////////////////////////////////
import { sagas as login } from "./containers/Login";
import { sagas as settingTable } from "./containers/SettingScreen/components/Tables";
import { sagas as tableManagement } from "./containers/TableListManagement";
import { sagas as userManagement } from "./containers/UserManagement";
import { sagas as settingFood } from "./containers/SettingScreen/components/Foods";
import { sagas as foodManagement } from "./containers/FoodManagement";
import { sagas as foodCategoryManagement } from "./containers/FoodCategoryManagement";
import { sagas as dishManagament } from "./containers/DishManagement";
import { sagas as notifications } from "./components/Notification";
import { sagas as takeAway } from "./containers/TakeAwayScreen";
import { sagas as promotion } from "./containers/PromotionManagement";
import { sagas as bookingTable } from "./containers/BookingTable";
import { sagas as PromotionManagements } from "./containers/PromotionManagements";
import { sagas as foodListIsProcessing } from "./containers/FoodListIsProcessing";
import { sagas as reportManagement } from "./containers/ReportManagement";
import AreaSagas from "./containers/AreaManagement/saga";
import TableListSagas from "./containers/TableList/saga";
import PaymentSagas from "./containers/PaymentManagement/saga";
import { sagas as settingGeneral } from "./containers/SettingScreen/components/General";
import { sagas as calendarManagement } from "./containers/CalendarManagement";
import { sagas as TableArrangement } from "./containers/TableArrangement";
import { sagas as detailRestaurant } from "./containers/DetailRestaurant";
import { sagas as shiftManagament } from "./containers/ShiftManagement";
import { sagas as settingManagament } from "./containers/SettingScreen";
import { sagas as requestPayment } from "./containers/RequestPayment";
import { sagas as checkInOutManagement } from "./containers/CheckInOutManagement";
import { sagas as foodListIsProcessingBar } from "./containers/FoodListIsProcessingBar";
import { sagas as addon } from "./containers/AddonManagement";
// Place for sagas' app

const sagasList = [
  login(),
  settingTable(),
  tableManagement(),
  userManagement(),
  settingFood(),
  foodManagement(),
  foodCategoryManagement(),
  dishManagament(),
  notifications(),
  takeAway(),
  promotion(),
  bookingTable(),
  PromotionManagements(),
  foodListIsProcessing(),
  reportManagement(),
  settingGeneral(),
  shiftManagament(),
  AreaSagas(),
  settingGeneral(),
  TableListSagas(),
  calendarManagement(),
  detailRestaurant(),
  PaymentSagas(),
  settingManagament(),
  TableArrangement(),
  detailRestaurant(),
  requestPayment(),
  checkInOutManagement(),
  foodListIsProcessingBar(),
  addon(),
];

export default function* () {
  yield all(sagasList);
}
