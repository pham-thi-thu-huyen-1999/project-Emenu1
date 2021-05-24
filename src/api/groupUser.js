import api from "../services/api";
import { partner_id } from "../consts/constants";
const endPoint = "/GroupUser";

export const getGroupUser = (payload) => {
  return api.get(`${endPoint}?language=vi&partner_id=${partner_id}`);
};

export const listRoleByGropID = (payload) => {
  const { data } = payload;
  return api.get(`${endPoint}/${data.group_id}/Role?language=vi&index=0&page_size=-1`);
};

export const addGroupUser = (payload) => {
  const { data } = payload;
  return api.post(`${endPoint}?language=vi`, data);
};

export const updateGroupUserRole = (payload) => {
  const { data } = payload;
  return api.put(
    `${endPoint}/${data.group_user_id}/Role?language=vi`,
    data.arrRoleId
  );
};

export const editGroupUser = (payload) => {
  const { data } = payload;
  return api.put(`${endPoint}/${data.group_id}?language=vi`, data);
};

export const deleteGroupUser = (payload) => {
  const { data } = payload;
  return api.delete(`${endPoint}/${data.group_id}?language=vi`);
};
