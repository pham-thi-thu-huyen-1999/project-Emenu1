import React, { Component } from "react";
import Swals from "../../../utils/sweetalert2";
import { ImageLoading } from "../../../components/common";
export default class FooterRestaurant extends Component {
  state = {};
  getDataFromParam = (url, name, type) => {
    let result = type === 'array' ? [] : '';
    const params = url.substr(1).split("&");
    params.forEach((item) => {
      const key = item.split("=")[0];
      const value = item.split("=")[1];
      if (key === name && type === 'array') {
        result = [...result, decodeURIComponent(value)];
      } else if (key === name) {
        result = decodeURIComponent(value);
      }
    });
    return result;
  }
  componentDidMount() {
    let { search } = this.props.location;
    const table_id = this.getDataFromParam(search, "tid", "")
    if (table_id) {
      const data = {
        table_id
      }
      this.props.actions.getTableById({ data })
    }
  }
  showSuccess = () => {
    const { t } = this.props
    Swals.fire({
      icon: 'success',
      title: `${t("detailRestaurant.callStaffSuccess")}!`,
      text: `${t("detailRestaurant.pleaseWating")}!`,
      showConfirmButton: true,
    })
  }
  showErr = () => {
    const { t } = this.props
    Swals.fire({
      icon: 'error',
      title: `${t("dishManagaments.error")}!`,
      text: `${t("dishManagaments.requCheckAgain")}!`
    })
  }
  onCallStaff = () => {
    const { t } = this.props;
    Swals.fire({
      title: `${t("detailRestaurant.youSure")}?`,
      text: `${t("detailRestaurant.confirmCallStaff")}`,
      icon: "question",
      showCancelButton: true,
      cancelButtonText: `${t("bookingTables.no")}`,
      confirmButtonText: `${t("bookingTables.yes")}`
    }).then(async (result) => {
      if (result.value) {
        const { tableDetail } = this.props;
        let { search } = this.props.location;
        const partner_id = this.getDataFromParam(search, "ri", "")
        const table_id = this.getDataFromParam(search, "tid", "")
        if (table_id) {
          const data = {
            "title": "Gọi nhân viên",
            "content": `${tableDetail.name} đang gọi nhân viên`,
            "action": "call_staff",
            "type_notification": "3",
            "link": "",
            "body_data": "{}",
            "partner_id": partner_id,
            "table_id": tableDetail.id,
            "area_id": tableDetail.area.id,
            "topic": `area_${tableDetail.area.id}`,
            "list_user_push_noti": [
            ]
          }
          this.props.actions.callStaff({
            data,
            callSuccess: this.showSuccess,
            callFail: this.showErr
          })
        } else {
          const { t } = this.props
          Swals.fire({
            icon: 'error',
            title: `${t("detailRestaurant.notDeterminedLocalTable")}!`,
            text: `${t("dishManagaments.requCheckAgain")}!`
          })
        }
      }
    })
  }
  render() {
    const { t } = this.props;
    return (
      <aside className="footer-res">
        <div className="footer-res__ads">
          <div className="footer-res__ads-text">
            <div className="text-question">
              {t("detailRestaurant.showMenuDifferentRes")}
            </div>
            <div className="text-question">
              {t("detailRestaurant.orderDishByPhone")}
            </div>
            <div className="download">
              <div className="download-title-now">
                {t("detailRestaurant.dowloadNow")}
              </div>
              <ImageLoading innerClass="logo" src={require("./../../../images/logo-omenu.png")} />
              <div className="group-download">
                <ImageLoading innerClass="google-download" src={require("./../../../images/google-play.png")} />
                <ImageLoading innerClass="appstore-download" src={require("./../../../images/apple-store.png")} />
              </div>
            </div>
          </div>
          <ImageLoading innerClass="footer-res__ads-image" src={require("./../../../images/ohaza_device.png")} />
        </div>
        <div className="footer-text-callstaff e-flex">
          <div className="content-text-left">
            <div className="footer-res__buy">
              {t("detailRestaurant.doYouWantManagementConvenientAndExactly")}
            </div>
            <div className="footer-res__link">
              {t("detailRestaurant.showInstructionAndSignUp")}
            </div>
          </div>
          <div className="content-call-staff-right">
            <div className="hotline-phone-ring-wrap">
              <div className="hotline-phone-ring">
                <div className="hotline-phone-ring-circle">
                </div>
                <div className="hotline-phone-ring-circle-fill"></div>
                <div className="hotline-phone-ring-img-circle">
                  <button className="pps-btn-img"
                    onClick={() => this.onCallStaff()}>
                    <img src={require("./../../../images/call.png")} />
                  </button>
                </div>
              </div>
              <div className="hotline-bar">
                <button className="text-hotline"
                  onClick={() => this.onCallStaff()}
                >{t("detailRestaurant.callStaff")}</button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
  }
}
