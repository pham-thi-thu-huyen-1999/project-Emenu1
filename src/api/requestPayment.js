import api from "../services/api";
import common from '../utils/common';
import { get } from "../services/localStorage";

const endPoint = "PaymentRequest";
const infoToken = common.decodeToken(get('accessToken'));

export const getListReqPayment = payload => {
  let { page, limit, params } = payload;
  const { partner_id } = infoToken;
  return api.get(`/Partner/${partner_id}/${endPoint}?language=vi`,
    {
      params: {
        page,
        limit,
        ...params
      }
    }
  )
}

export const getTotalListReqPayment = payload => {
  const { partner_id } = infoToken;
  return api.get(`/Partner/${partner_id}/${endPoint}?language=vi`)
}
/**
 * get request payment by order_id
 * @param {*} params
 */
export const getDetailReqPaymentById = params => {
  const { order_id, payment_request_id } = params
  return api.get(`/Order/${order_id}/${endPoint}/${payment_request_id}?language=vi`)
}

/**
 * cancel request payment
 */
export const deleteReqPayment = params => {
  const { order_id, payment_request_id } = params
  return api.delete(`/Order/${order_id}/${endPoint}/${payment_request_id}?language=vi`)
}
/**
 * get detail provisional votes
 * @param {*} payload
 */
export const getDetailProvisionalVotes = params => {
  const { order_id, payment_request_id, payment_request_detail_id } = params;
  return api.get(`/Order/${order_id}/${endPoint}/${payment_request_id}/PaymentRequestDetail/${payment_request_detail_id}?language=vi`)
}
/**
 * post provisional vote
 * @param {*} params
 */
export const saveProvisionalVotes = params => {
  const { order_id, payment_request_id, data } = params;
  return api.post(`/Order/${order_id}/${endPoint}/${payment_request_id}/PaymentRequestDetail`, data)
}

/**
 * update qty item in order
 */

export const updateAmountItemOfOrder = params => {
  const { order_id, order_item_id, data } = params;
  return api.put(`/Order/${order_id}/OrderItem/${order_item_id}`, data)
}
/**
 * update status item in order
 * @param {*} params
 */
export const updateStatusItemOfOrder = params => {
  const { order_id, order_item_id, data } = params;
  return api.put(`/Order/${order_id}/OrderItem/${order_item_id}/completed`, data)
}
/**
 * cancel item order
 * @param {} params
 */
export const cancelFoodOrder = params => {
  const { order_id, order_item_id, data } = params;
  return api.put(`/Order/${order_id}/OrderItem/${order_item_id}`, data)
}