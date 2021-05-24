import api from "../services/api";
import apiv11 from "../services/api_v1_1";
import common from "../utils/common";
import { get } from "../services/localStorage";

const endPoint = "/Partner";
const language = get("lng") || "vi";
const PartnerSetting = "/PartnerSetting";

let infoToken = common.decodeToken(get("accessToken"));

export const updateTakeLeave = (payload) => {
  const { data } = payload;
  return apiv11.post(
    `${endPoint}/${infoToken.partner_id}/TakeLeave?language=vi`,
    data
  );
};

export const getPartnerById = (payload) => {
  let infoToken = common.decodeToken(get("accessToken"));
  return infoToken ? api.get(`${endPoint}/${infoToken.partner_id}?language=vi`) : null;
};

export const getPartnerByIdNoLogin = (payload) => {
  const partnerId = payload;
  return api.get(`${endPoint}/${partnerId}?language=vi`);
};

export const addReplaceShift = (payload) => {
  const { data } = payload;
  return apiv11.post(
    `${endPoint}/${infoToken.partner_id}/ReplaceShift?language=vi`,
    data
  );
};

export const deleteReplaceShift = (payload) => {
  const { data } = payload;
  return apiv11.delete(
    `${endPoint}/${infoToken.partner_id}/ReplaceShift/${data.replace_shift_id}?language=vi`
  );
};

export const deleteOverTimeShiftByEmployee = (payload) => {
  const { data } = payload;
  return apiv11.delete(
    `${endPoint}/${infoToken.partner_id}/OvertimeShift/${data.overtime_shift_id}?language=vi`
  );
};

export const deleteTakeLeaveShiftByEmployee = (payload) => {
  const { data } = payload;
  return apiv11.delete(
    `${endPoint}/${infoToken.partner_id}/TakeLeave/${data.take_leave_id}?language=vi`
  );
};

export const getReplaceShift = (payload) => {
  const { partner_id } = infoToken;
  const { user_id, params } = payload;
  return apiv11.get(`${endPoint}/${partner_id}/ReplaceShift`, {
    params: {
      language: "vi",
      user_id,
      ...params,
    },
  });
};

export const getStatusCheckIn = (payload) => {
  const { partner_id } = infoToken;
  const { user_id, params } = payload;
  return apiv11.get(`/Partner/${partner_id}/CheckInOut/Status`, {
    params: {
      language: "vi",
      user_id,
      ...params,
    },
  });
};


export const getPartnerSetting = (payload) => {
  let infoToken = common.decodeToken(get("accessToken"));
  return infoToken ? api.get(`${endPoint}/${infoToken.partner_id}?language=vi`) : null;
};
