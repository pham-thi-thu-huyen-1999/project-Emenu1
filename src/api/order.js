import api from "../services/api";
import common from '../utils/common';
import { get } from "../services/localStorage";

const endPoint = "/Order";
const endPointItem = "/Item";
const endPointComboItem = "/ComboItem";
const endPoint_AccountInfo = "/Account/Info";

const language = get("lng") || "vi";


export const getOrder = (payload) => {
  let infoToken = common.decodeToken(get('accessToken'));
  return api.get(
    `${endPoint}?language=${language}&partner_id=${infoToken.partner_id}&table_id=${payload !== undefined && payload.table_id !== "" ? payload.table_id : ""
    }`
  );
};

// Lấy thông tin order theo order_id
export const getDishByOrder = (payload) => {
  const { data } = payload;
  let orderId = data.orderId ? data.orderId : "";
  return api.get(`${endPoint}/${orderId}`)
}

export const tableListByArea = (payload) => {
  let infoToken = common.decodeToken(get('accessToken'));
  // const { data } = payload;
  return api.get(`${endPoint}/Table?language=vi&partner_id=${infoToken.partner_id}`);
};

export const getJoinTableList = (payload) => {
  return api.get(`${endPoint}/JoinTable?language=vi`);
};

export const getAccountInfo = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  return api.get(`${endPoint_AccountInfo}?language=vi`);
};

export const JoinTable = (params) => {
  let infoToken = common.decodeToken(get('accessToken'));
  return api.post(
    `${endPoint}/TableJoin?language=vi&partner_id=${infoToken.partner_id}`,
    params
  );
};

export const getItemList = () => {
  let infoToken = common.decodeToken(get('accessToken'));
  return api.get(`${endPoint}/Item?partner_id=${infoToken.partner_id}`);
};


export const getComboItemList = payload => {
  const { partner_id } = payload
  let infoToken = common.decodeToken(get('accessToken'));
  return api.get(`Order/ComboItem?partner_id=${partner_id ? partner_id : infoToken.partner_id}&language=vi&page=1&limit=100`);
};

export const getComboItemListOnly = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  return api.get(`Order/ComboItem?partner_id=${infoToken.partner_id}&language=vi&page=1&limit=100`);
};

// export const getCategoryItemList = payload => {
//   return api.get(`CategoryItem?language=vi`);
// }

export const getPartnerSetting = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  const { partner_id } = payload
  return api.get(
    `/Partner/${partner_id ? partner_id : infoToken.partner_id}/PartnerSetting?language=vi`
  );
};

// export const getOrderForm = () => {
//   //return api.get(`${endPoint}?language=vi&table=""&partner_id=${partner_id}`);
//   return api.get(`${endPoint}/OrderItem?language=vi&table=""&partner_id=${infoToken.partner_id}`);
// };

// export const getOrderForm = payload => {
//   const { page, limit } = payload;
//   console.log("api Order",page,limit)
//   return api.get(
//       `${endPoint}/OrderItem`,
//       {
//           params: {
//               table: "",
//               language: "vi",
//               partner_id: `${infoToken.partner_id}`,
//               page,
//               limit
//           }
//       }
//   )
// };

export const getOrderForm = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  const { page, limit, order_no, customer_name, customer_tel, order_status_id } = payload;
  console.log("id status", order_status_id)
  return api.get(
    `${endPoint}`,
    {
      params: {
        language: "vi",
        partner_id: `${infoToken.partner_id}`,
        page: page ? page : 1,
        limit: limit ? limit : 10,
        order_no: order_no ? order_no : "",
        customer_name: customer_name ? customer_name : "",
        customer_tel: customer_tel ? customer_tel : "",
        order_status_id: order_status_id ? order_status_id : "",
        is_takeaway: true
      }
    }
  )
};

export const getOrderItemById = (payload) => {
  const { id } = payload;
  return api.get(`${endPoint}/${id}?language=vi`);
};

export const paymentOrder = (payload) => {
  const { id, data } = payload;
  return api.post(`${endPoint}/${id}/Payment?language=vi`, data);
};

export const createOrder = (payload) => {
  const { data } = payload;
  return api.post(`${endPoint}?language=vi`, { ...data });
};

export const cancelOrder = (payload) => {
  const { data } = payload;
  const url = [endPoint, data.order_id, "canceled"].join("/");
  return api.put(url, { reason: data.reason });
};

export const rollbackOrder = (payload) => {
  const { order_id } = payload;
  const url = [endPoint, order_id, "rollback"].join("/");
  return api.put(url);
};

export const getOrderDetailById = ({ order_id }) => {
  return api.get(
    `${endPoint}/${order_id}`
  );
};

// export const orderPayments = (payload) => {
//   const { data } = payload;
//   const url = [endPoint, data.order_id, "Payment"].join("/");
//   return api.get(url);
// };

export const deliveryConfirm = (payload) => {
  const { id } = payload;
  return api.put(`${endPoint}/${id}/DeliveryConfirm?language=vi`);
};

export const getComboById = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  const { combo_item_id } = payload;
  return api.get(
    `${endPoint}${endPointComboItem}/${combo_item_id}${endPointItem}?partner_id=${infoToken.partner_id}&language=vi`
  );
}

export const getOrderFoodList = (payload) => {
  const { data } = payload;
  let infoToken = common.decodeToken(get('accessToken'));
  let isBar = data.isBar ? data.isBar : false;
  let order_item_status_id = data.order_item_status_id ? data.order_item_status_id : "";
  return api.get(`${endPoint}/KitchenBar`,
    {
      params: {
        language: "vi",
        partner_id: `${infoToken.partner_id}`,
        order_item_status_id,
        is_bar: isBar,
      }
    }
  );
}

export const getOrderGeneral = (payload) => {
  const { data } = payload;
  let infoToken = common.decodeToken(get('accessToken'));
  let isBar = data.isBar ? data.isBar : false;
  return api.get(`${endPoint}/General`,
    {
      params: {
        language: "vi",
        partner_id: `${infoToken.partner_id}`,
        is_bar: isBar,
      }
    }
  );
}

// export const getDishByOrder = (payload) => {
//   const { data } = payload;
//   let orderId = data.orderId ? data.orderId : "";
//   return api.get(`${endPoint}/${orderId}/OrderItem?language=vi`)
// }

export const updateOrderItemIsOff = (payload) => {
  let infoToken = common.decodeToken(get('accessToken'));
  const { data } = payload;
  return api.put(
    `${endPoint}/${data.order_id}/OrderItem/${data.order_item_id}/outoff?language=vi&partner_id=${infoToken.partner_id}`
  );
};

export const updateOrderItemIsCompleted = (payload) => {
  const { data } = payload;
  return api.put(
    `${endPoint}/${data.order_id}/OrderItem/${data.order_item_id}/completed?language=vi`
  );
};

export const updateOrderItemQuantity = (payload) => {
  const { data } = payload;
  return api.put(
    `${endPoint}/${data.order_id}/OrderItem/${data.order_item_id}?language=vi`, data
  );
};


/**
 * get list table follow status.
 * @param {*} payload
 */

export const getTableStatus = payload => {
  let infoToken = common.decodeToken(get('accessToken'));
  const { table_status, area_id } = payload;
  const url = `${endPoint}/Table`
  return api.get(
    url,
    {
      params:
      {
        language: 'vi',
        partner_id: infoToken.partner_id,
        table_status,
        area_id
      }
    }
  )
}

export const getOrderItem = (payload) => {
  let infoToken = common.decodeToken(get('accessToken'));
  return api.get(`${endPoint}/Item?partner_id=${infoToken.partner_id}&language=${language}`);
};

export const getCheckVoucher = (payload) => {
  let infoToken = common.decodeToken(get('accessToken'));
  const { voucher_code } = payload;
  return api.get(`Promotion/CheckVoucher?partner_id=${infoToken.partner_id}&voucher_code=${voucher_code}&language=${language}`);
};

export const checkPayment = ({ order_id, items }) => {
  return api.post(`${endPoint}/${order_id}/CheckPayment`, items);
};

/**
 * get item list of partner no combo.
 */
export const getItemListNoCombo = params => {
  const { partner_id } = params
  return api.get(`${endPoint}/Item?partner_id=${partner_id}`);
};

/**
 * Tao so suat cho order.
 */
export const postOrderItemById = (payload) => {
  const { id, data } = payload;
  return api.post(`${endPoint}/${id}?language=vi`, data);
};

/**
 * Xoa mon an khoi order
 */
export const deleteOrderItemById = (payload) => {
  const { order_id, order_item_id, data } = payload;
  return api.put(`${endPoint}/${order_id}/OrderItem/${order_item_id}/canceled?language=vi`, data);
};

/**
 * Them mon cho suat da duoc dang ky roi.
 */
export const postOrderItemComboById = (payload) => {
  const { order_id, order_combo_item_id, data } = payload;
  return api.post(`${endPoint}/${order_id}/OrderComboItem/${order_combo_item_id}/OrderItem?language=vi`, data);
};

/**
 * Update lai suat co gia
 */
export const updateOrderComboItem = (payload) => {
  const { order_id, order_combo_item_id, data } = payload;
  return api.put(`${endPoint}/${order_id}/OrderComboItem/${order_combo_item_id}?language=vi`, data);
};


