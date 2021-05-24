import api_v1_1 from "../services/api_v1_1";
import common from '../utils/common';
import { get } from "../services/localStorage";
const endPoint = "/Notification";

export const getListNotifications = (payload) => {
  let infoToken = common.decodeToken(get('accessToken'));
  return api_v1_1.get(`${endPoint}`, {
    params: {
      user_id: `${infoToken.partner_id}`,
      language: "vi",
      status_action: 0,
      status: 0,
      action: "call_staff",
      topic: `area_${payload.topic}`
    }
  }
  )
};

export const getNotifications = (payload) => {
  const { index } = payload;
  let infoToken = common.decodeToken(get('accessToken'));
  return api_v1_1.get(`${endPoint}`, {
    params: {
      user_id: `${infoToken.partner_id}`,
      language: "vi",
      status_action: 0,
      // status: 0,
      // action: "call_staff",
      topic: `area_${payload.topic}`,
      index,
      page_size: 20
    }
  }
  )
};

/**
 * Get list notis by params
 */
export const getListNotiByParams = (payload) => {
  let infoToken = common.decodeToken(get('accessToken'));
  let { index, page_size } = payload.data;
  return api_v1_1.get(`${endPoint}`, {
    params: {
      user_id: `${infoToken.partner_id}`,
      language: "vi",
      status: 0,
      index: index || 0,
      page_size: page_size || 10,

    }
  }
  )
};

/**
 * Subcriber to topic
 * @param {*} payload
 */
export const subcriberToTopic = async (payload) => {
  const { device_id, data } = payload;
  return await api_v1_1.post(`${endPoint}/SubTopic?device_id=${device_id}`, data);
};

export const updateActionStatus = (payload) => {
  const { notification_id, status_action } = payload;
  return api_v1_1.put(`${endPoint}/${notification_id}/ChangeActionStatus?language=vi&status_action=${status_action}&is_topic=true`);
};

export const addNofitication = (payload) => {
  const { data } = payload;
  return api_v1_1.post(`${endPoint}?language=vi`, data);
}

export const updateStatusRead = params => {
  const { notification_id, status } = params;
  return api_v1_1.put(`${endPoint}/${notification_id}/ChangeStatus?language=vi&status=${status}&is_topic=false`);
}

export const getTotalNotiUnread = params => {
  return api_v1_1.get(`${endPoint}/CountUnread?language=vi`);
}

export const unSubcriberToTopic = async (payload) => {
  const { device_id, data } = payload;
  return await api_v1_1.post(`${endPoint}/UnSubTopic?device_id=${device_id}`, data);
};

export const subcriberToTopicByUser = async (payload) => {
  const { device_id, data, user_id } = payload;
  return await api_v1_1.post(`${endPoint}/User/${user_id}/SubTopic?device_id=${device_id}`, data);
};

export const unSubcriberToTopicByUser = async (payload) => {
  const { device_id, data, user_id } = payload;
  return await api_v1_1.post(`${endPoint}/User/${user_id}/UnSubTopic?device_id=${device_id}`, data);
};

export const deleteNoti = async (payload) => {
  const { notification_id } = payload;
  return await api_v1_1.delete(`${endPoint}/${notification_id}`);
};