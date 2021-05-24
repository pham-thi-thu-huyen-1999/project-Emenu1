import api from "../services/api_v1_1";
import common from '../utils/common';
import { get } from "../services/localStorage";

const endPoint = "/Calendar";
const endPoint_User = "/Calendar/User";
const endPoint_Overtime = "/Calendar/Overtime";
const endPoint_CheckInOut = "/Calendar/CheckInOut";
const endPoitn_TotalShift = "/Calendar/User/TotalShift"

const language = get("lng") || "vi";
let infoToken = common.decodeToken(get('accessToken'));

export const getCalendar = (payload) => {
  const { fromDate, toDate } = payload;
  return api.get(
    `${endPoint}?language=${language}&from_date=${fromDate}&to_date=${toDate}`
  );
};

export const getCalendarOfUser = (payload) => {
  const { fromDate, toDate, userId } = payload;
  return api.get(
    `${endPoint_User}/${userId}?language=${language}&from_date=${fromDate}&to_date=${toDate}`
  );

};

export const getTotalShift = (payload) => {
  const { month, year } = payload;
  return api.get(
    `${endPoitn_TotalShift}?language=${language}&month=${month}&year=${year}`
  )
}

export const getCheckInCheckOut = (payload) => {
  const { shiftId, checkInOutAt } = payload;
  return api.get(
    `${endPoint_CheckInOut}?language=${language}&shift_id=${shiftId}&check_in_out_at=${checkInOutAt}`
  );
};


export const deleteEmployeeToShift = (payload) => {
  const { user_id, shift_id, overtime_at } = payload;
  const url = `${endPoint_User}/${user_id}/OvertimeShift/${shift_id}?language=${language}&overtime_at=${overtime_at}`
  return api.delete(url);
};

export const updateCancelTakeLeave = (payload) => {
  const { user_id, shift_id, take_leave_at } = payload;
  const url = `${endPoint_User}/${user_id}/TakeLeave/${shift_id}?language=${language}&take_leave_at=${take_leave_at}`
  return api.delete(url);
};

export const addEmployeesToShift = (payload) => {
  const { data } = payload;
  return api.post(`${endPoint_Overtime}?language=vi`, data);
};

export const getEmployeeOfShift = (payload) => {
  const { shift_id, params } = payload;
  return api.get(`${endPoint}/Shift/${shift_id}`, {
    params: {
      language: "vi",
      ...params,
    },
  });
};



