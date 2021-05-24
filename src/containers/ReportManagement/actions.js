import { createAction } from "redux-actions";
import * as CONSTS from "./constants";

export const getPartnerSetting = createAction(CONSTS.GETPARTNERSETTING);
export const getPartnerSettingSuccess = createAction(CONSTS.GETPARTNERSETTING_SUCCESS);
export const getPartnerSettingFail = createAction(CONSTS.GETPARTNERSETTING_FAIL);


export const getReportOverview = createAction(CONSTS.GETREPORTOVERVIEW);
export const getReportOverviewSuccess = createAction(CONSTS.GETREPORTOVERVIEW_SUCCESS);
export const getReportOverviewFail = createAction(CONSTS.GETREPORTOVERVIEW_FAIL);

export const getGuestTableByDate = createAction(CONSTS.GETGUESTTABLEBYCURRENTDATE);
export const getGuestTableByDateSuccess = createAction(CONSTS.GETGUESTTABLEBYCURRENTDATE_SUCCESS);
export const getGuestTableByDateFail = createAction(CONSTS.GETGUESTTABLEBYCURRENTDATE_FAIL);

export const getGuestTableByCurrentDate = createAction(CONSTS.GETGUESTTABLEBYCURRENTDATE);
export const getGuestTableByCurrentDateSuccess = createAction(CONSTS.GETGUESTTABLEBYCURRENTDATE_SUCCESS);
export const getGuestTableByCurrentDateFail = createAction(CONSTS.GETGUESTTABLEBYCURRENTDATE_FAIL);

export const getRevenueByDate = createAction(CONSTS.GETREVENUEBYDATE);
export const getRevenueByDateSuccess = createAction(CONSTS.GETREVENUEBYDATE_SUCCESS);
export const getRevenueByDateFail = createAction(CONSTS.GETREVENUEBYDATE_FAIL);

export const getRevenueByMonth = createAction(CONSTS.GETREVENUEBYMONTH);
export const getRevenueByMonthSuccess = createAction(CONSTS.GETREVENUEBYMONTH_SUCCESS);
export const getRevenueByMonthFail = createAction(CONSTS.GETREVENUEBYMONTH_FAIL);

export const getRevenueByYear = createAction(CONSTS.GETREVENUEBYYEAR);
export const getRevenueByYearSuccess = createAction(CONSTS.GETREVENUEBYYEAR_SUCCESS);
export const getRevenueByYearFail = createAction(CONSTS.GETREVENUEBYYEAR_FAIL);

export const getRevenueTopFoodByDate = createAction(CONSTS.GETREVENUETOPFOODBYDATE);
export const getRevenueTopFoodByDateSuccess = createAction(CONSTS.GETREVENUETOPFOODBYDATE_SUCCESS);
export const getRevenueTopFoodByDateFail = createAction(CONSTS.GETREVENUETOPFOODBYDATE_FAIL);

export const getRevenueTopDrinkByDate = createAction(CONSTS.GETREVENUETOPDRINKBYDATE);
export const getRevenueTopDrinkByDateSuccess = createAction(CONSTS.GETREVENUETOPDRINKBYDATE_SUCCESS);
export const getRevenueTopDrinkByDateFail = createAction(CONSTS.GETREVENUETOPDRINKBYDATE_FAIL);

export const getTotalStaffWorkingByDate = createAction(CONSTS.GETTOTALSTAFFWORKINGBYDATE);
export const getTotalStaffWorkingByDateSuccess = createAction(CONSTS.GETTOTALSTAFFWORKINGBYDATE_SUCCESS);
export const getTotalStaffWorkingByDateFail = createAction(CONSTS.GETTOTALSTAFFWORKINGBYDATE_FAIL);

export const getTotalStaffWorkingByWeek = createAction(CONSTS.GETTOTALSTAFFWORKINGBYWEEK);
export const getTotalStaffWorkingByWeekSuccess = createAction(CONSTS.GETTOTALSTAFFWORKINGBYWEEK_SUCCESS);
export const getTotalStaffWorkingByWeekFail = createAction(CONSTS.GETTOTALSTAFFWORKINGBYWEEK_FAIL);