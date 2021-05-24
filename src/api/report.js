import api from "../services/api";
import common from '../utils/common';
import { get } from "../services/localStorage";

const endPoint = "/Report";
let infoToken = common.decodeToken(get('accessToken'));
let partner_id = infoToken.partner_id;

export const getReportOverview = payload => {
  return api.get(`${endPoint}?language=vi&partner_id=${partner_id}`);
};

export const getGuestTableByDate = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  const { from_date, to_date } = payload
  return api.get(
    `${endPoint}/GuestTableByDate`,
    {
      params: {
        language: "vi",
        partner_id: `${infoToken.partner_id}`,
        from_date,
        to_date,
      }
    }
  )
};

export const getGuestTableByCurrentDate = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  return api.get(
    `${endPoint}/GuestTableByCurrentDate`,
    {
      params: {
        language: "vi",
        partner_id: `${infoToken.partner_id}`,
      }
    }
  )
};

export const getRevenueByDate = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  const { from_date, to_date } = payload
  return api.get(
    `${endPoint}/RevenueByDate`,
    {
      params: {
        language: "vi",
        partner_id: `${infoToken.partner_id}`,
        from_date,
        to_date,
      }
    }
  )
};

export const getRevenueTopFoodByDate = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  const { from_date, to_date } = payload
  return api.get(
    `${endPoint}/RevenueTopFoodByDate`,
    {
      params: {
        language: "vi",
        partner_id: `${infoToken.partner_id}`,
        from_date,
        to_date,
      }
    }
  )
};

export const getRevenueTopDrinkByDate = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  const { from_date, to_date } = payload
  return api.get(
    `${endPoint}/RevenueTopDrinkByDate`,
    {
      params: {
        language: "vi",
        partner_id: `${infoToken.partner_id}`,
        from_date,
        to_date,
      }
    }
  )
};

export const getTotalStaffWokingByDate = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  const { from_date, to_date } = payload
  return api.get(
    `${endPoint}/TotalStaffWokingByDate`,
    {
      params: {
        language: "vi",
        partner_id: `${infoToken.partner_id}`,
        from_date,
        to_date,
      }
    }
  )
};

export const getTotalStaffWokingByWeek = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  const { from_date, to_date } = payload
  return api.get(
    `${endPoint}/TotalStaffWokingByWeek`,
    {
      params: {
        language: "vi",
        partner_id: `${infoToken.partner_id}`,
        from_date,
        to_date,
      }
    }
  )
};

export const getRevenueByMonth = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  const { from_date, to_date } = payload
  return api.get(
    `${endPoint}/RevenueByMonth`,
    {
      params: {
        language: "vi",
        partner_id: `${infoToken.partner_id}`,
        from_date,
        to_date,
      }
    }
  )
};

export const getRevenueByYear = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  const { from_date, to_date } = payload
  return api.get(
    `${endPoint}/RevenueByYear`,
    {
      params: {
        language: "vi",
        partner_id: `${infoToken.partner_id}`,
        from_date,
        to_date,
      }
    }
  )
};