import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { name } from "./reducers";
import * as action from "./actions";
import { withNamespaces } from "react-i18next";
import RadioButton from "../../../../components/common/RadioList";
import { Button, SelectBox } from "../../../../components/common/";
import Swal from "./../../../../utils/sweetalert2";
import * as CONSTS from "./constants";
import audio from "../../../../utils/audio";
import { TEMP_CONTRACT } from "../../../../consts/settings/partnerContract";
import moment from "moment";
import { Input } from "../../../../components/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import { history } from "../../../../App";
import { save, get } from "../../../../services/localStorage";
import {
  faSave
} from "@fortawesome/free-solid-svg-icons";
class SettingGenerals extends Component {
  constructor(props) {
    super(props);
    this.props.actions.getPartnerById();
    this.props.actions.getPartnerSetting();
    this.props.actions.getCurrencyUnit();
    this.state = {
      settingGeneralOption: [],
      partnerSetting: {},
      userInfo: {},
      welcome: props.t("setting.general.defaultWelcome"),
      isStatus: null,
      selectedCurrencyID: CONSTS.DEFAUL_CURRENCY_UNIT,
      ISCHECK_ITEM: [
        { key: CONSTS.CHECKED, text: this.props.t("setting.yes") },
        { key: CONSTS.NOT_CHECKED, text: this.props.t("setting.no") },
      ],
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let partnerSetting = nextProps.partnerSetting
      ? nextProps.partnerSetting
      : {};
    let oldPartnerSetting = prevState.partnerSetting
      ? prevState.partnerSetting
      : {};
    if (
      (Object.keys(partnerSetting).length !== 0 &&
        Object.keys(oldPartnerSetting).length === 0) ||
      JSON.stringify(partnerSetting) !== JSON.stringify(oldPartnerSetting)
    ) {
      audio.updateAudioLocal(nextProps.partnerSetting.is_sound_on);
      return {
        partnerSetting: nextProps.partnerSetting,
        userInfo: nextProps.userInfo,
        welcome: nextProps.partnerSetting.welcome,
        selectedCurrencyID: nextProps.partnerSetting.currency_id,
        settingGeneralOption: [
          {
            id: CONSTS.IS_CONFIRM_CHECKIN,
            name: "setting.general.employeeConfirmCheckIn",
            status: nextProps.partnerSetting.is_confirm_checkin
              ? CONSTS.CHECKED
              : CONSTS.NOT_CHECKED,
            isContract: false,
          },
          {
            id: CONSTS.IS_ON_LOCATE,
            name: "setting.general.askGuestsToEnableLocation",
            status: nextProps.partnerSetting.is_on_locate
              ? CONSTS.CHECKED
              : CONSTS.NOT_CHECKED,
            isContract: false,
          },
          {
            id: CONSTS.IS_PRINT_COMPLETE_COOKING,
            name: "setting.general.printDishWhenCookConfirmsFinish",
            status: nextProps.partnerSetting.is_print_complete_cooking
              ? CONSTS.CHECKED
              : CONSTS.NOT_CHECKED,
            isContract: false,
          },
          {
            id: CONSTS.IS_AUDIO,
            name: "setting.general.isAudio",
            status: nextProps.partnerSetting.is_sound_on ? CONSTS.CHECKED : CONSTS.NOT_CHECKED,
            isContract: true,
          },
          {
            id: CONSTS.IS_CALL_EMPLOYEE,
            name: "setting.general.isCallEmployee",
            status: nextProps.partnerSetting.is_call_staff
              ? CONSTS.CHECKED
              : CONSTS.NOT_CHECKED,
            isContract: true,
          },
          {
            id: CONSTS.IS_CHECK_IN_OUT,
            name: "setting.general.isCheckInOut",
            status: nextProps.partnerSetting.is_checkin_out
              ? CONSTS.CHECKED
              : CONSTS.NOT_CHECKED,
            isContract: false,
          },
        ],
      };
    } else return null;
  }

  onSaveSettingGeneral = () => {
    const { settingGeneralOption, selectedCurrencyID } = this.state;
    let is_audio =
      settingGeneralOption[CONSTS.IS_AUDIO].status === CONSTS.CHECKED
        ? true
        : false;
    let data = {
      is_confirm_checkin:
        settingGeneralOption[CONSTS.IS_CONFIRM_CHECKIN].status ===
          CONSTS.CHECKED
          ? true
          : false,
      is_on_locate:
        settingGeneralOption[CONSTS.IS_ON_LOCATE].status === CONSTS.CHECKED
          ? true
          : false,
      is_print_complete_cooking:
        settingGeneralOption[CONSTS.IS_PRINT_COMPLETE_COOKING].status ===
          CONSTS.CHECKED
          ? true
          : false,
      welcome: this.state.welcome,
      is_call_staff:
        settingGeneralOption[CONSTS.IS_CALL_EMPLOYEE].status === CONSTS.CHECKED
          ? true
          : false,
      partner_type: this.state.partnerSetting.partner_type,
      is_checkin_out:
        settingGeneralOption[CONSTS.IS_CHECK_IN_OUT].status === CONSTS.CHECKED
          ? true
          : false,
      is_sound_on: is_audio,
      currency_id: selectedCurrencyID
    };
    this.props.actions.updatePartnerSetting({
      data,
      showSuccess: this.showSuccess,
      showErr: this.showErr,
    });
  };
  showAlert = () => {
    const t = this.props.t;
    Swal.fire({
      title: t("setting.general.swalTitle"),
      text: t("setting.general.swalUpdateSettingGeneral"),
      icon: "info",
      showCancelButton: true,
      confirmButtonText: t("setting.general.swalAgree"),
      cancelButtonText: t("setting.general.swalCancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.onSaveSettingGeneral();
      } else {
        return;
      }
    });
  };
  showSuccess = (data) => {
    const t = this.props.t;
    const hasCheckInOutNew = data.is_checkin_out
    const hasCheckInOutOld = get("is_checkin_out");
    save("is_checkin_out", hasCheckInOutNew);
    //Update audio to local
    audio.updateAudioLocal(data.is_sound_on);
    Swal.fire({
      icon: "success",
      text: t("setting.general.swalUpdateSuccess"),
      title: t("setting.general.swalTitle"),
    });
    if (hasCheckInOutNew === true && hasCheckInOutOld === false) {
      window.location.reload();
    }
  };

  showErr = () => {
    const t = this.props.t;
    Swal.fire({
      icon: "error",
      title: t("setting.general.swalTitle"),
      text: t("setting.general.swalUpdateFail"),
    });
  };

  onChangeValue = (value, index) => {
    const { settingGeneralOption } = this.state;
    settingGeneralOption[index].status = value;
    this.setState({ settingGeneralOption });
  };

  isContract = () => {
    const userInfo = this.state.userInfo;
    return (
      userInfo.contract_type_id === TEMP_CONTRACT ||
      moment.utc(new Date()).isAfter(new Date(userInfo.contract_end_time))
    );
  };
  render() {
    const { ISCHECK_ITEM, userInfo, welcome, selectedCurrencyID } = this.state;
    const { t } = this.props;
    return (
      <div className="promotion general">
        <div className="title-setting e-flex content-center item-center">
          <div className="btn-back">
            <Button className="s3"
              onClick={() => { history.push("/menu") }}>
              <FontAwesomeIcon icon={faLongArrowAltLeft} />
              <span className="e-m-left-5">{t("textCommon.back")}</span>
            </Button>
          </div>
          <h3 className="title">{t("general")}</h3>
        </div>
        <div className="pr-content">
          <div className="general-content general-content-wrap">
          <div className="general-item" >
              <span className="general-item-name">{t("setting.general.unitMoney")}</span>
              <span className="general-item-status setting-general-currency">
                <SelectBox
                  dataSource={this.props.currencyUnitList}
                  map={{ key: 'id', text: 'name_vn' }}
                  selected={selectedCurrencyID}
                  blank="Vui lòng chọn đơn vị tiền tệ"
                  onChange={selectedCurrencyID => {
                    this.setState({ selectedCurrencyID })
                  }}>
                </SelectBox>
              </span>
            </div>
            {userInfo
              ? this.state.settingGeneralOption.map((item, index) =>
                this.isContract() ? (
                  // restaurant is contract
                  item.isContract ? (
                    // get item is contract
                    <div className="general-item" key={index}>
                      <span className="general-item-name">
                        {" "}
                        {t(item.name)}
                      </span>
                      <span className="general-item-status">
                        <RadioButton
                          name={"status" + index}
                          dataSource={ISCHECK_ITEM}
                          onChange={(value) =>
                            this.onChangeValue(value, item.id)
                          }
                          selected={
                            this.state.isStatus === null
                              ? item.status
                              : this.state.isStatus
                          }
                        />
                      </span>
                    </div>
                  ) : null
                ) : (
                    <div className="general-item" key={index}>
                      <span className="general-item-name"> {t(item.name)}</span>
                      <span className="general-item-status">
                        <RadioButton
                          name={"status" + index}
                          dataSource={ISCHECK_ITEM}
                          onChange={(value) =>
                            this.onChangeValue(value, item.id)
                          }
                          selected={
                            this.state.isStatus === null
                              ? item.status
                              : this.state.isStatus
                          }
                        />
                      </span>
                    </div>
                  )
              )
              : null}
            {userInfo && !this.isContract() ? (
              <div className="general-item">
                <span className="general-item-name">
                  {t("setting.general.welcome")}
                </span>
                <span
                  className="general-item-status"
                  style={{ flexBasis: "50%" }}
                >
                  <Input
                    onChange={(e) =>
                      this.setState({
                        welcome: e.target.value,
                      })
                    }
                    value={welcome}
                  ></Input>
                </span>
              </div>
            ) : null}
            
          </div>
          <div className="button-action" style={{ textAlign: "right" }}>
            <Button onClick={() => {
                this.showAlert();
              }}>
              <FontAwesomeIcon icon={faSave} />{" "}
              {t("setting.save")}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state[name],
  };
};
const mapDispatchToProps = (dispatch) => {
  const actions = {
    ...action,
  };
  return { actions: bindActionCreators(actions, dispatch) };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces()(SettingGenerals));
