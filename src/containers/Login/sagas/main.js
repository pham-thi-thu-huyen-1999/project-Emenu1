import { all, call, put, takeEvery } from "redux-saga/effects";
import { push } from "connected-react-router";
import * as actions from "../actions";
import { save, get } from "../../../services/localStorage";
import * as apiAccount from "../../../api/account";
import * as apiNotification from "../../../api/notification";
import * as apiCalendar from "../../../api/calendar";
import * as apiPartner from "../../../api/partner";
import jwtDecode from "jwt-decode";
import audio from "../../../utils/audio";
import moment from "moment";
import common from "../../../utils/common";
import _ from "lodash";
import * as CONSTS from "../constants";
import { TEMP_CONTRACT } from "../../../consts/settings/partnerContract";
import { v1 as uuidv1 } from 'uuid';
import { getPartnerSetting } from "../../../api/partnerSetting";
// import {isMobile} from 'react-device-detect';

function* handleLogIn(action) {
  try {
    let deviceId = get("deviceId");
    let is_deviceId_exist = deviceId ? true : false;
    if(!is_deviceId_exist) deviceId = uuidv1()
    let deviceInfo = {
      fingerprint: '',
      browser_type: 'Web',
      browser_version: '87.0.4280.88',
      user_agent: '',
      platform_name : 'Web',
      platform_version: '87.0.4280.88',
      name: '',
      marketing_name: '',
      brand: '',
      manufacturer: '',
      model: '',
      board_name: '',
      serial_number: '',
      native_id: deviceId,
      firmware_fingerprint: '',
      resolution: '',
      carrier: '',
      last_ip: '',
      last_location: '',
      last_connected_at: '',
      last_app_version: ''
    }
    const res = yield call(apiAccount.login, action.payload, (new Buffer(JSON.stringify(deviceInfo)).toString('base64')));
    const { token, refreshToken, device_id } = res.data.data;
    const user_id = common.decodeToken(token).sub;
    const roles = common.decodeToken(token).role;
    if (
      jwtDecode(token).role.indexOf("staff") === -1 &&
      jwtDecode(token).role.indexOf("admin") === -1 &&
      jwtDecode(token).role.indexOf("user") === -1  &&
      jwtDecode(token).role.indexOf("master") === -1
    ) {
      yield put(actions.loginFail("Bạn không có quyền truy cập "));
      return;
    }
    //save device Id
    if(!is_deviceId_exist) save("deviceId", deviceId);

    // Save device info id
    save("device_info_id", device_id);

    // Update info device
    yield call(apiAccount.updateDevice, {
                user_id: user_id,
                device_id: device_id,
                data: {
                    device_id: device_id,
                    token_fcm: get('fb_token')
                }
              });

    // Save access token
    save("accessToken", token);
    
    /**
     * subscribe all topic after login success
     */
    const resInfoStaff = yield call(apiAccount.getAccountInfoStaff, { id: user_id });
    if (resInfoStaff.data
      && resInfoStaff.data.data
      && resInfoStaff.data.data.UserAreas.length > 0) {
      let { UserAreas } = resInfoStaff.data.data
      yield all(UserAreas.map((item) => {
        const subtop = {
          device_id: deviceId,
          data: {
            topic: `area_${item.area_id}`
          }
        }
        return call(apiNotification.subcriberToTopic, subtop);
      }))
    }
    if (action.payload.savelogin) {
      save("refreshToken", refreshToken);
    }
    yield put(actions.loginSuccess(res.data));
    const parnerSetting = yield call(getPartnerSetting);
    save("parnerSetting", parnerSetting.data.data);
    save("is_table", parnerSetting.data.data.is_table);
    const hasCheckIn = parnerSetting.data.data.is_checkin_out;
    yield save("is_checkin_out", hasCheckIn);
    // Save audio setting
    audio.updateAudioLocal(parnerSetting.data.data.is_sound_on);
    // check resraurant is contract restaurant
    const resPartner = yield call(apiPartner.getPartnerById, action.payload);
    let constractType = "";
    let constractTime = "";
    if (resPartner && resPartner.data && resPartner.data.data) {
      constractType = resPartner.data.data.contract_type_id;
      constractTime = resPartner.data.data.contract_end_time;
    }

    if (constractType === TEMP_CONTRACT || moment.utc(new Date()).isAfter(new Date(constractTime))) {
      // is constract restaurant
      yield save("is_checkin_out", false);
      yield save("checkIn", CONSTS.CONTRACT);
      window.location = "/menu";
      // yield put(push("/"));
      //window.location = "/";
      return;
    } else {
      // isn't constract restaurant
      // Nếu là role master thì không cần checkin
      if (roles.includes(CONSTS.MASTER_ROLE)) {
        yield save("checkIn", CONSTS.CHECKED_IN);
        window.location = "/";
        return;
      }
      // Check restaurant turn on checkin_out
      if (!hasCheckIn) {
        // restaurant turned off feature checkin_out
        window.location = "/"
        return;
      }
      // Get calendar of user at today
      const todayTime = moment(new Date()).format("DD-MM-YYYY");
      const dataCalendarOfUser = {
        data: {
          userId: user_id,
          fromDate: todayTime,
          toDate: todayTime,
        },
      };
      const resCalendarUser = yield call(apiCalendar.getCalendarOfUser, dataCalendarOfUser.data);

      // Check status check in of user
      if (resCalendarUser && resCalendarUser.data && resCalendarUser.data.data) {
        const calendarOfUser = resCalendarUser.data.data;
        if (calendarOfUser && calendarOfUser[0].shifts && calendarOfUser[0].shifts.length === 0) {
          // Have no shifts at today
          save("checkIn", CONSTS.NOT_YET_CHECK_IN);
          // yield put(push("/checkin"));
          window.location = "/checkin";
        } else if (calendarOfUser && calendarOfUser[0].shifts && calendarOfUser[0].shifts.length !== 0) {
          // Have shift at today

          // Format time to double type : hh.mm => 11h30p => 11.30
          let currentTime = _.toNumber(
            _.split(moment().format("LTS"), ":", 2).join(".")
          );
          let tempCalendar = calendarOfUser[0].shifts.map((shift) => {
            return {
              id: shift.id,
              startTime: _.toNumber(_.split(shift.start_time, ":", 2).join(".")),
              endTime: _.toNumber(_.split(shift.end_time, ":", 2).join(".")),
            };
          });

          // Find shift is in working time or shift have start time next to
          let shiftId = "";
          let minDist = 24;
          for (const shift of tempCalendar) {
            if (currentTime >= shift.startTime && currentTime <= shift.endTime) {
              shiftId = shift.id;
              break;
            }
            let dist = shift.startTime - currentTime;
            if (dist > 0 && dist < minDist) {
              minDist = dist;
              shiftId = shift.id;
            }
          }
          if (shiftId !== "") {
            const params = {
              check_in_out_at: todayTime,
              shift_id: shiftId,
            };
            const resStatusCheckin = yield call(apiPartner.getStatusCheckIn, {
              user_id,
              params,
            });
            if (
              resStatusCheckin &&
              resStatusCheckin.data &&
              resStatusCheckin.data.data
            ) {
              const { status } = resStatusCheckin.data.data;
              if (status === CONSTS.NOT_YET_CHECK_IN) {
                // Case not yet check in
                yield save("checkIn", CONSTS.NOT_YET_CHECK_IN);
                window.location = "/checkin";
                // yield put(push("/checkin"));
              } else {
                // Case checked in
                //yield put(push("/"));
                yield save("checkIn", CONSTS.CHECKED_IN);
                window.location = "/";
                return;
              }
            } else {
              // Case error data when get status
              // yield put(push("/checkin"));
              yield save("checkIn", CONSTS.NOT_YET_CHECK_IN);
              window.location = "/checkin";
            }
          } else {
            // no shift to check in
            // yield put(push("/checkin"));
            yield save("checkIn", CONSTS.NOT_YET_CHECK_IN);
            window.location = "/checkin";
          }
        } else {
          // get calendar of user error
          // yield put(push("/checkin"));
          yield save("checkIn", CONSTS.NOT_YET_CHECK_IN);
          window.location = "/checkin";
        }
      }
    }
  } catch (err) {
    if (err.response) {
      yield put(actions.loginFail(err.response.data.error.internal_message));
    } else {
      yield put(actions.loginFail("Network error"));
    }
  }
}
//////////////////////////////////////////////////////
// attach to Watcher
function* logIn() {
  yield takeEvery(actions.login, handleLogIn);
}
export default [logIn];
