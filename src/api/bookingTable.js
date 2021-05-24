import api from "../services/api";
import common from '../utils/common';
import { get } from "../services/localStorage";

const endPoint = "/Booking";
const infoToken = common.decodeToken(get('accessToken'));

/**
 * get list booking table
 * @param {*} payload
 */
export const getListBooking = payload => {
  const { status, guest_name,
    phone_number, page_size, index,
    from_date, to_date } = payload;
  let infoToken = common.decodeToken(get('accessToken'));
  return api.get(
    `${endPoint}`,
    {
      params: {
        language: "vi",
        partner_id: infoToken.partner_id,
        page_size,
        status,
        guest_name,
        phone_number,
        index,
        from_date,
        to_date
      }
    }
  )
}

export const getTotalListBooking = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  return api.get(
    `${endPoint}`,
    {
      params: {
        language: "vi",
        partner_id: infoToken.partner_id
      }
    }
  )
}
/**
 * get booking detail
 * @param {*} payload
 */
export const getBookingById = payload => {
  const { booking_id } = payload
  return api.get(`${endPoint}/${booking_id}?language=vi`)
}

/**
 * create booking table
 * @param {*} payload
 */
export const createBookingTable = payload => {
  const { data } = payload
  return api.post(`${endPoint}?language=vi`, data)
}
/**
 * edit booking table
 * @param {*} payload
 */
export const updateBooking = payload => {
  const { data, booking_id } = payload
  return api.put(`${endPoint}/${booking_id}?language=vi`, data)
}

export const updateStatusBooking = payload => {
  const { data, booking_id } = payload
  return api.put(`${endPoint}/${booking_id}/Status?language=vi`, data)
}
/**
 * add table for booking
 * @param {*} payload
 */
export const postTableBooking = payload => {
  const { table_ids, booking_id } = payload
  let data = { table_ids, partner_id: infoToken.partner_id }
  return api.post(`${endPoint}/${booking_id}/BookingTable?language=vi`, data)
}
/**
 * get list table booking
 * @param {*} payload
 */
export const getListTableOfBooking = payload => {
  const { booking_id } = payload
  return api.get(`${endPoint}/${booking_id}/BookingTable?language=vi`)
}