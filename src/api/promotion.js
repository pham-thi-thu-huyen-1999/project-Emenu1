import api from "../services/api";
import common from '../utils/common';
import { get } from "../services/localStorage";
const endPoint = "Promotion";

const infoToken = common.decodeToken(get('accessToken'));
export const getPromotionList = (payload) => {
  const { page, limit, params } = payload;
  return api.get(`/Admin/${endPoint}`, {
    params: {
      language: "vi",
      parner_id: infoToken.parner_id,
      page,
      limit,
      ...params
    }
  });
};

export const getPromotionBillDetailById = (payload) => {
  const { data } = payload;
  return api.get(
    `/Admin/${endPoint}/${data.promotion_id}/PromotionBillDetail?language=vi`
  );
};
export const getPromotionItemDetailById = (payload) => {
  const { data } = payload;
  return api.get(
    `/Admin/${endPoint}/${data.promotion_id}/PromotionItem?language=vi`
  );
};

export const getPromotionComboItemDetailById = (payload) => {
  const { data } = payload;
  return api.get(
    `/Admin/${endPoint}/${data.promotion_id}/PromotionComboItem?language=vi`
  );
};

export const getPromotionVoucherDetailById = (payload) => {
  const { data } = payload;
  return api.get(
    `/Admin/${endPoint}/${data.promotion_id}/PromotionVoucherDetail?language=vi`
  );
};

export const createPromotionBillDetail = (payload) => {
  const { data } = payload;
  return api.post(`/Admin/${endPoint}/PromotionBillDetail?language=vi`, data);
};

export const createPromotionItemDetail = (payload) => {
  const { data } = payload;
  return api.post(`/Admin/${endPoint}/PromotionItem?language=vi`, data);
};

export const createPromotionComboDetail = (payload) => {
  const { data } = payload;
  return api.post(`/Admin/${endPoint}/PromotionComboItem?language=vi`, data);
};
/**
 * create promotion voucher
 * @param {} payload
 */
export const createPromotionVoucherDetail = (payload) => {
  const { data } = payload;
  return api.post(`/Admin/${endPoint}/PromotionVoucherDetail?language=vi`, data);
};

export const editPromotionItemDetail = (payload) => {
  const { data, id } = payload;
  return api.put(
    `/Admin/${endPoint}/${id}/PromotionItem?language=vi`,
    data
  );
};

export const editPromotionBillDetail = (payload) => {
  const { data, id } = payload;
  return api.put(
    `/Admin/${endPoint}/${id}/PromotionBillDetail?language=vi`,
    data
  );
};

export const editPromotionComboItemDetail = (payload) => {
  const { data, id } = payload;
  return api.put(
    `/Admin/${endPoint}/${id}/PromotionComboItem?language=vi`,
    data
  );
};

export const editPromotionVoucherDetail = (payload) => {
  const { data, id } = payload;
  return api.put(
    `/Admin/${endPoint}/${id}/PromotionVoucherDetail?language=vi`,
    data
  );
};

export const deletePromotion = (payload) => {
  const { data } = payload;
  const url = ["/Admin", endPoint, data.promotion_id].join("/");
  return api.delete(url, data);
};
/**
 * get list promotion discount
 * @param {*} payload
 */
export const getListPromotionDiscount = payload => {
  return api.get(`/Admin/${endPoint}/PromotionType?language=vi`)
}

export const getListPromotionBySearch = payload => {
  const { params } = payload
  return api.get(`/Admin/${endPoint}`,
    {
      params: {
        parner_id: infoToken.parner_id,
        language: "vi",
        name_search: params.name_search,
        is_active: params.is_active
      }
    })
}

/**
 * get promotion combo item
 */

export const getPromotionComboItem = () => {
  return api.get(`${endPoint}/PromotionComboItem?partner_id=${infoToken.parner_id}&language=vi`)
}


/**
 * get promotion item
 */

export const getPromotionItem = () => {
  return api.get(`${endPoint}/PromotionItem?partner_id=${infoToken.partner_id}&language=vi`)
}
