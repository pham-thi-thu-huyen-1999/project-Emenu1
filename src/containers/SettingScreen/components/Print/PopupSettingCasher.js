import React from "react";
import { Dialog, Button, NumberRange, SelectBox, CheckBox } from "../../../../components/common";
import Swal from "./../../../../utils/sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faSearch,
  faPrint,
  faSave
} from "@fortawesome/free-solid-svg-icons";
import CompPrintBillCasher from './CompPrintBillCasher';
import ReactToPrint from 'react-to-print';

export default class PopupSettingCasher extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isCheckBox: {
        //Object checked checkbox content
        isShowRestaurant: props.isCheckBox.isShowRestaurant ? props.isCheckBox.isShowRestaurant : true,
        isShowStaffWaiter: props.isCheckBox.isShowStaffWaiter ? props.isCheckBox.isShowStaffWaiter : true,
        isShowStaffCasher: props.isCheckBox.isShowStaffCasher ? props.isCheckBox.isShowStaffCasher : true,
        isShowDate: props.isCheckBox.isShowDate ? props.isCheckBox.isShowDate : true,
        isShowTableNumber: props.isCheckBox.isShowTableNumber ? props.isCheckBox.isShowTableNumber : true,
        isShowNoBill: props.isCheckBox.isShowNoBill ? props.isCheckBox.isShowNoBill : true,
        //value margin amount
        leTrai: props.isCheckBox.leTrai ? props.isCheckBox.leTrai : 1,
        lePhai: props.isCheckBox.lePhai ? props.isCheckBox.lePhai : 1,
        leTren: props.isCheckBox.leTren ? props.isCheckBox.leTren : 1,
        leDuoi: props.isCheckBox.leDuoi ? props.isCheckBox.leDuoi : 1,
        soLuongLien: props.isCheckBox.soLuongLien ? props.isCheckBox.soLuongLien : 1,
        //value Selected
        connectPrint: props.isCheckBox.connectPrint ? props.isCheckBox.connectPrint : {},
        devicePrint: props.isCheckBox.devicePrint ? props.isCheckBox.devicePrint : {},
        pageSizePrint: props.isCheckBox.pageSizePrint ? props.isCheckBox.pageSizePrint : {}
      },
      showPopupScanDevice: false,
      infoPartner: this.props.infoPartner ? this.props.infoPartner : {}
    };

  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.infoPartner !== prevState.infoPartner) {
      return { infoPartner: nextProps.infoPartner };
    }
    else return null;
  }

  addDishCategory = () => {
    const {
      nameCategoryDish,
      descCategoryDish, position
    } = this.state;
    const data = {
      name: nameCategoryDish,
      description: descCategoryDish,
      status: 1,
      position
    };

    this.props.actions.createCategoryItem({
      data,
      callback_success: this.showOk,
      callback_fail: this.showErr
    });
    this.props.hide();
  }
  showAlert = () => {
    const t = this.props.t;
    if (
      Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object
    ) {
      Swal.fire({
        title: t("categoryDish.swalTitle"),
        text: t("categoryDish.swalAddCategoryDish"),
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: t("categoryDish.swalAgree"),
        cancelButtonText: t("categoryDish.swalCancel"),
      }).then((result) => {
        if (result.value) {
          this.addDishCategory();
        }
      })
    } else {
      this.setState({
        errors: this.validator.validate(this.state)
      });
    }
  }
  showOk = () => {
    const t = this.props.t;
    Swal.fire({
      icon: 'success',
      text: t("categoryDish.swalAddSuccess"),
      title: t("categoryDish.swalTitle")
    })
  }

  showErr = () => {
    const t = this.props.t;
    Swal.fire({
      icon: 'error',
      title: t("categoryDish.swalTitle"),
      text: t("categoryDish.swalAddFail"),
    })
  }

  onChange = async(e) => {
    await this.setState({ isCheckBox: { ...this.state.isCheckBox, ...e } });
    await this.props.onChange(this.state.isCheckBox);
  }
  render() {
    const { infoAreaSelected, pageStyle, isCheckBox, listDevice, show, hide, t } = this.props;
    const { showPopupScanDevice, infoPartner } = this.state;

    const listConnect = [
      {
        key: 1,
        text: "Máy in LAN Phổ biến"
      },
      {
        key: 2,
        text: "Máy in USB Phổ biến"
      },
      {
        key: 3,
        text: "Máy in Wifi Phổ biến"
      },
      {
        key: 4,
        text: "Máy in Bluetooth Phổ biến"
      }
    ];
    const listPaper = [
      {
        key: 1,
        text: "Giấy in cuộn 80mm"
      },
      {
        key: 2,
        text: "Giấy in cuộn 56mm"
      }
    ];
    const orderDetailTemp = {
      order_no: "123",
      table: {
        name: "10"
      },
      order_users: [],
      order_status: { id: 2 },
      order_items: [
        {
          item_name: "Mon A",
          qty: 0,
          price: 100000,
          total_money: 0,
          unit_item: "KG"
        },
        {
          item_name: "Mon B",
          qty: 0,
          price: 200000,
          total_money: 0,
          unit_item: "LON"
        },
        {
          item_name: "Mon C",
          qty: 0,
          price: 300000,
          total_money: 0,
          unit_item: "CHAI"
        }
      ]
    };

    return (
      <>
        <Dialog
          innerClass="max-width-scan-device-setting-casher"
          show={show}
          close={hide}
        >
          <h2
            className="main-lbl text-center title-scan-device"
          >
            {t("menu.area")} {infoAreaSelected.nameArea}
        </h2>
          <div className="setting-casher">
            <fieldset className="">
              <legend className="title-setting-cahser">{t("settingPrint.infoGeneral")}</legend>
              <div className="e-row">
                <div className="e-col-5 connect">
                  <div className="title-connect">
                    {t("settingPrint.connect")}
                </div>
                  <div className="select-casher">
                    <SelectBox
                      className="search-catogory"
                      onChange={(selected, connectPrint) => this.onChange({
                        connectPrint
                      })}
                      value_copy={isCheckBox && isCheckBox.connectPrint ? isCheckBox.connectPrint.text : this.state.isCheckBox.connectPrint.text}
                      dataSource={listConnect}
                      blank={t("settingPrint.connectChoose")}
                    >
                      <div className="icon-angle-dow">
                        <FontAwesomeIcon
                          icon={faAngleDown}
                        /></div>
                    </SelectBox>
                  </div>
                </div>
                <div className="e-col-6 device e-m-left-20">
                  <div className="title-connect">
                    {t("settingPrint.device")}
                </div>
                  <div className="select-casher">
                    <SelectBox
                      className="search-catogory"
                      onChange={(selected, devicePrint) => this.onChange({
                        devicePrint
                      })}
                      value_copy={isCheckBox && isCheckBox.devicePrint ? isCheckBox.devicePrint.text : this.state.isCheckBox.devicePrint.text }
                      dataSource={listDevice}
                      blank={t("settingPrint.deviceChoose")}
                    >
                      <div className="icon-angle-dow">
                        <FontAwesomeIcon
                          icon={faAngleDown}
                        /></div>
                    </SelectBox>
                  </div>
                  <div className="btn-group e-m-left-10">
                    <Button
                      className="height-btn-table e-m-right-5"
                      type="s5"
                      onClick={() => { this.setState({ showPopupScanDevice: true }) }}
                    >
                      <FontAwesomeIcon icon={faSearch} />{" "}
                      {t("settingPrint.scan")}
                  </Button>
                  </div>
                </div>
              </div>

              <div className="e-row e-m-top-15">
                <div className="e-col-5 connect">
                  <div className="title-connect">
                    {t("settingPrint.paperSize")}
                </div>
                  <div className="select-casher">
                    <SelectBox
                      className="search-catogory"
                      onChange={(selected, pageSizePrint) => this.onChange({
                        pageSizePrint
                      })}
                      value_copy={isCheckBox && isCheckBox.pageSizePrint ? isCheckBox.pageSizePrint.text : this.state.isCheckBox.pageSizePrint.text}
                      dataSource={listPaper}
                      blank={t("settingPrint.paperSizeChoose")}
                    >
                      <div className="icon-angle-dow">
                        <FontAwesomeIcon
                          icon={faAngleDown}
                        /></div>
                    </SelectBox>
                  </div>
                </div>
                <div className="e-col-6 device e-m-left-20">
                  <div className="title-connect">
                    {t("settingPrint.numberOfJoint")}
                </div>
                  <div className="select-casher">
                    <NumberRange
                      defaultValue={isCheckBox.soLuongLien}
                      max={100}
                      onChange={soLuongLien => { this.onChange({ soLuongLien }) }}
                    />
                  </div>
                </div>
              </div>

              <div className="e-row e-m-top-15">
                <div className="e-col-5 connect">
                  <div className="title-connect">
                    {t("settingPrint.marginLeft")}
                </div>
                  <div className="select-casher">
                    <NumberRange
                      defaultValue={isCheckBox.leTrai}
                      max={100}
                      /* onChange={(leTrai) => { this.setState({ isCheckBox: { ...isCheckBox, leTrai: leTrai } }); this.props.onChange(isCheckBox) }} */
                      onChange={leTrai => { this.onChange({leTrai})}}
                    />{" "}px
                  </div>
                </div>
                <div className="e-col-6 device e-m-left-20">
                  <div className="title-connect">
                    {t("settingPrint.marginRight")}
                </div>
                  <div className="select-casher">
                    <NumberRange
                      defaultValue={isCheckBox.lePhai}
                      max={100}
                      onChange={lePhai => { this.onChange({ lePhai })}}
                    />{" "}px
                  </div>
                </div>
              </div>

              <div className="e-row e-m-top-15">
                <div className="e-col-5 connect">
                  <div className="title-connect">
                    {t("settingPrint.marginTop")}
                </div>
                  <div className="select-casher">
                    <NumberRange
                      defaultValue={isCheckBox.leTren}
                      max={100}
                      onChange={leTren => { this.onChange({ leTren }) }}
                    />{" "}px
                  </div>
                </div>
                <div className="e-col-6 device e-m-left-20">
                  <div className="title-connect">
                    {t("settingPrint.marginBottom")}
                </div>
                  <div className="select-casher">
                    <NumberRange
                      defaultValue={isCheckBox.leDuoi}
                      max={100}
                      onChange={leDuoi => { this.onChange({ leDuoi }) }}
                    />{" "}px
                  </div>
                </div>
              </div>
            </fieldset>

            <fieldset className="">
              <legend className="title-setting-cahser-content">{t("settingPrint.content")}</legend>
              <div className="e-m-left-10">
                <div className="e-row e-col-12 e-flex item-center">
                  <div className="e-col-4 area-name e-flex">
                    <CheckBox
                      name="" //area_id
                      label={t("settingPrint.showInfoRestaurant")} //area_name
                      checked={isCheckBox.isShowRestaurant}
                      onChange={(isShowRestaurant) => this.onChange({isShowRestaurant})}
                    />
                    <br /> <br />
                  </div>
                  <div className="e-col-4 area-name e-flex">
                    <CheckBox
                      name="" //area_id
                      label={t("settingPrint.ShowServeStaff")} //area_name
                      checked={isCheckBox.isShowStaffWaiter}
                      onChange={(isShowStaffWaiter) => this.onChange({ isShowStaffWaiter })}
                    />
                    <br /> <br />
                  </div>
                  <div className="e-col-4 area-name e-flex">
                    <CheckBox
                      name="" //area_id
                      label={t("settingPrint.ShowInfoCasher")} //area_name
                      checked={isCheckBox.isShowStaffCasher}
                      onChange={(isShowStaffCasher) => this.onChange({ isShowStaffCasher })}
                    />
                    <br /> <br />
                  </div>
                </div>
                <div className="e-row e-col-12 e-flex item-center e-m-top-10">
                    <div className="e-col-4 area-name e-flex">
                      <CheckBox
                        name="" //area_id
                        label={t("settingPrint.showDate")} //area_name
                        checked={isCheckBox.isShowDate}
                        onChange={(isShowDate) => this.onChange({ isShowDate })}
                      />
                      <br /> <br />
                    </div>

                    <div className="e-col-4 area-name e-flex">
                      <CheckBox
                        name="" //area_id
                        label={t("settingPrint.showNumTable")} //area_name
                        checked={isCheckBox.isShowTableNumber}
                        onChange={(isShowTableNumber) => this.onChange({ isShowTableNumber })}
                      />
                      <br /> <br />
                    </div>
                    <div className="e-col-4 area-name e-flex">
                      <CheckBox
                        name="" //area_id
                        label={t("settingPrint.showNoBill")} //area_name
                        checked={isCheckBox.isShowNoBill}
                        onChange={(isShowNoBill) => this.onChange({ isShowNoBill })}
                      />
                      <br /> <br />
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
          <div className="button-action-print e-m-top-15 height-btn-table" style={{ textAlign: "right" }}>
            <Button
              className="height-btn-table e-m-right-5 height-btn-table-print-test"
              type="s5"
            >
              <ReactToPrint
                trigger={() => {
                  return <div className="reactToPrint">
                    <a href="#"><FontAwesomeIcon icon={faPrint} />{" "}{t("settingPrint.printTemp")}</a>
                  </div>
                }}
                content={() => this.componentRef}
                pageStyle={pageStyle}
              />
              <CompPrintBillCasher orderDetail={orderDetailTemp} infoAreaSelected={infoAreaSelected} infoPartner={infoPartner} t={t} ref={el => (this.componentRef = el)} isCheckBox={isCheckBox}/>
            </Button>
            <Button onClick={this.props.onSaveChangePrintBill}>
              <FontAwesomeIcon icon={faSave} />{" "}
              {t("setting.save")}
            </Button>
          </div>
        </Dialog>
        <Dialog
          innerClass="max-width-scan-device"
          show={showPopupScanDevice}
          close={() => { this.setState({ showPopupScanDevice: false }) }}
        >
          <h2
            className="main-lbl text-center title-scan-device"
          >
            {t("settingPrint.scaning")}
        </h2>
          <div className="content-scan-device">
            <div className="e-m-top-10">
              {t("settingPrint.scaningSumary")}
          </div>
            <div className="e-m-top-10 e-m-left-160">
              <div>XP-80C XPrinter 1</div>
              <hr />
              <div>XP-80C XPrinter 2</div>
              <hr />
              <div>XP-80C XPrinter 3</div>
              <hr />
              <div>...</div>
            </div>
          </div>
        </Dialog>
      </>

    );
  }
}




