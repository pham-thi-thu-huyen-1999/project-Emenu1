import api from "../services/api_v1_1";
import common from '../utils/common';
import { get } from "../services/localStorage";

const endPoint = "Shift";
const infoToken = common.decodeToken(get('accessToken'));

export const getListShift = payload => {
  const { partner_id } = infoToken
  return api.get(`Partner/${partner_id}/${endPoint}?language=vi`)
}

export const getListDayShift = payload => {
  return api.get(`${endPoint}/Weekday?language=vi`)
}

export const getListOverShift = payload => {
  const { partner_id } = infoToken
  const { user_id, params } = payload
  return api.get(`Partner/${partner_id}/OvertimeShift`,
    {
      params: {
        language: "vi",
        user_id,
        ...params
      }
    }
  )
}

export const addOTShift = payload => {
  const { partner_id } = infoToken
  const { data } = payload;
  return api.post(
    `Partner/${partner_id}/OvertimeShift?language=vi`, data
  );
};

export const postShiftForStaff = payload => {
  const { partner_id } = infoToken
  const { data } = payload;
  return api.post(
    `Partner/${partner_id}/WeekdayShift?language=vi`, data
  );
};
/**
 * delete OT shift
 * @param {*} payload
 */
export const deleteShiftForStaff = payload => {
  const { partner_id } = infoToken
  const { overtime_shift_id } = payload;
  return api.delete(
    `/Partner/${partner_id}/OvertimeShift/${overtime_shift_id}?language=vi`
  );
};

export const getListTakeLeave = payload => {
  const { partner_id } = infoToken
  const { user_id, params } = payload
  return api.get(`Partner/${partner_id}/TakeLeave`,
    {
      params: {
        language: "vi",
        user_id,
        ...params
      }
    }
  )
}

export const deleteTakeLeave = payload => {
  const { partner_id } = infoToken
  const { take_leave_id } = payload;
  return api.delete(
    `Partner/${partner_id}/TakeLeave/${take_leave_id}?language=vi`
  );
};

export const addTakeLeave = payload => {
  const { partner_id } = infoToken
  const { data } = payload;
  return api.post(
    `Partner/${partner_id}/TakeLeave?language=vi`, data
  );
}

export const getListCheckinCheckout = payload => {
  const { partner_id } = infoToken
  const { user_id, params } = payload
  return api.get(`Partner/${partner_id}/CheckInOut`,
    {
      params: {
        language: "vi",
        user_id,
        ...params
      }
    }
  )
}
/**
 * create checkin checkout
 * @param {*} payload
 */
export const createCheckinOut = payload => {
  const { partner_id } = infoToken
	const { data } = payload;
  return api.post(
    `Partner/${partner_id}/CheckInOut?language=vi`, data
  );
}

export const putCheckinOut = payload => {
  const { partner_id } = infoToken
  const { data, check_in_out_id } = payload;
  return api.put(
    `Partner/${partner_id}/CheckInOut/${check_in_out_id}?language=vi`, data
  );
}

export const deleteCheckinOut = payload => {
  const { partner_id } = infoToken
  const { check_in_out_id } = payload;
  return api.delete(
    `Partner/${partner_id}/CheckInOut/${check_in_out_id}?language=vi`
  );
}

export const getListHistoryCheck = payload => {
  const { partner_id } = infoToken
  const { user_id, params, check_in_out_id } = payload
  return api.get(`Partner/${partner_id}/CheckInOut/${check_in_out_id}`,
    {
      params: {
        language: "vi",
        user_id,
        ...params
      }
    }
  )
}
/**
 * get list weekday shift
 * @param {*} payload
 */
export const getListWeekdayShift = payload => {
  const { partner_id } = infoToken
  const { user_id } = payload
  return api.get(`Partner/${partner_id}/WeekdayShift`,
    {
      params: {
        language: "vi",
        user_id
      }
    }
  )
}

export const createShift = payload => {
  const partner_id = infoToken.partner_id
  const { data } = payload
  return api.post(`Partner/${partner_id}/${endPoint}?language=vi`, data)
}

export const editShift = payload => {
  const partner_id = infoToken.partner_id
  const { data } = payload
  return api.put(`Partner/${partner_id}/${endPoint}?language=vi`, data)
}

export const deleteShift = payload => {
  const partner_id = infoToken.partner_id
  const { shift_id } = payload
  return api.delete(`Partner/${partner_id}/${endPoint}/${shift_id}?language=vi`)
}
/**
 * get list shift calendar of user
 * @param {*} payload
 */
export const getListCalendarOfUser = payload => {
  const { user_id, from_date, to_date } = payload
  return api.get(`Calendar/User/${user_id}`,
    {
      params: {
        language: "vi",
        from_date,
        to_date
      }
    }
  )
}

export const updateOverShift= payload => {
  const { partner_id } = infoToken
  const { data, overtime_shift_id } = payload;
  return api.put(
    `Partner/${partner_id}/OvertimeShift/${overtime_shift_id}?language=vi`, data
  );
}

export const updateTakeLeaveShift= payload => {
  const { partner_id } = infoToken
  const { data, take_leave_id } = payload;
  return api.put(
    `Partner/${partner_id}/TakeLeave/${take_leave_id}?language=vi`, data
  );
}
