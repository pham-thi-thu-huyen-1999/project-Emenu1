import common from '../utils/common';
import { get } from "../services/localStorage";
let infoToken = common.decodeToken(get('accessToken'));
export const partner_id = `${infoToken.partner_id}`;
export const MSG_NOT_EMPTY_REQUIRED = "Tên danh mục món ăn không được để trống";
//export const baseURL = "https://api-dev.ohazo.net/api/v1.1";
export const baseURL = "https://api-stg.omenu.vn/api/v1.0";
export const baseURLV11 = "https://api-stg.omenu.vn/api/v1.1";
////////////////////Promotion type id //////////////////////////
export const PROMOTION_BILL_TYPE_ID = "205a2845-eab4-4ca3-b6ba-3e2f4b09cf17";
export const PROMOTION_ITEM_TYPE_ID = "218cfd88-f84a-4434-ae45-378ac02948f9";

export const LANGUAGES = {
    english: "en",
    japan: "jp",
    vietnam: "vi"
}

export const HTTP_STATUS_CODES = {
    ok: 200,                // 正常処理
    bad_request: 400,       // タイプミス等、リクエストにエラーがあります
    unauthorized: 401,      // 認証に失敗しました
    forbidden: 403,         // あなたにはアクセス権がありません
    not_found: 404,         // 該当アドレスのページはありません、またはそのサーバーが落ちている
    request_timeout: 408    // リクエストの待ち時間内に反応がなかった
}


export const AUDIO_LOCAL = 'OMENU_AUDIO';

export const REQUEST_PAYMENT_LOCAL = "REQUEST_PAYMENT";

export const LINK_ALLOW = [
  "/add-ot-shift",
  "/work-instead",
  "/take-leave",
  "/calendar-staff",
];
export const Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function(e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64
            } else if (isNaN(i)) {
                a = 64
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
        }
        return t
    },
    decode: function(e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9+/=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r)
            }
            if (a != 64) {
                t = t + String.fromCharCode(i)
            }
        }
        t = Base64._utf8_decode(t);
        return t
    },
    _utf8_encode: function(e) {
        e = e.replace(/rn/g, "n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r)
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t
    },
    _utf8_decode: function(e) {
        let t = "";
        let n = 0;
        let r = 0;
        let c2 = 0;
        let c3 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t
    }
  }
