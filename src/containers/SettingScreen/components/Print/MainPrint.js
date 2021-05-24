import React from "react";
import "./printStyle.scss";
import { SelectBox, Dialog } from "../../../../components/common";
import Button from "./../../../../components/common/Button";
import Swal from '../../../../utils/sweetalert2';
import { history } from "../../../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltLeft,
  faAngleDown,
  faSearch,
  faCog,
  faPrint,
  faSave
} from "@fortawesome/free-solid-svg-icons";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PopupSettingCasher from './PopupSettingCasher';
import PopupSettingBar from './PopupSettingBar';
import PopupSettingBep from './PopupSettingBep';
import CompPrintBillCasher from './CompPrintBillCasher';
import CompPrintBillBepBar from './CompPrintBillBepBar';
import ReactToPrint from 'react-to-print';
import { withNamespaces } from "react-i18next";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";

import * as paymentActions from "../../../PaymentManagement/actions";
import { PaymentReducerName } from "../../../PaymentManagement/reducers";

import * as userActions from "../../../UserManagement/actions";
import { userReducerName } from "../../../UserManagement/reducers";

import * as areaActions from "../../../AreaManagement/actions";
import { AreaReducerName } from "../../../AreaManagement/reducers";

import * as action from "../../actions";
import { name } from "../../reducers";

// import find from 'local-devices';

class MainPrint extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      showPopupScanDevice: false, //popup show quet cac thiet bi in
      //popup setting cac may in
      showPopupSettingCasher: false,
      showPopupSettingBar: false,
      showPopupSettingBep: false,
      errors: {},
      infoAreaSelected: {
        nameArea: "",
        idArea: ""
      },
      page: 1, //page de biet la dang o page nao TN:1 or Bep:2 or Bar:3
      //Tuy Chinh Thu Ngan
      isCheckBoxCasher: {}, //Thu Ngan
      isCheckBoxBar: {}, //Bar
      isCheckBoxBep: {} //Bep
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    //const { t } = this.props;
    //Khoi tao state cho thu ngan, bep, bar
    if (JSON.stringify(prevState.isCheckBoxCasher) === JSON.stringify({}) && nextProps.listArea.length !== 0) {
      let itemCasher = {
        //Object checked checkbox content
        isShowRestaurant: true,
        isShowStaffWaiter: true,
        isShowStaffCasher: true,
        isShowDate: true,
        isShowTableNumber: true,
        isShowNoBill: true,
        //value margin
        leTrai: 1,
        lePhai: 1,
        leTren: 1,
        leDuoi: 1,
        soLuongLien: 1,
        //value Selected
        connectPrint: {
          key: 1,
          text: "Máy in LAN Phổ biến"},
        devicePrint: {
          key: 1,
          text: "XP-80C"
        },
        pageSizePrint: {
          key: 1,
          text: "Giấy in cuộn 80mm"}
      };
      let isCheckBoxCasherTemp = {...prevState.isCheckBoxCasher};
      nextProps.listArea.map((area,index) => {
        isCheckBoxCasherTemp[area.id] = { ...itemCasher };
      })

      let itemBep = {
        selectedType: { key: 1, text: nextProps.t("settingPrint.printAllSameOne") },
        //Object checked checkbox content
        isShowStaffWaiter: true,
        isShowDateOrder: true,
        isShowTableNumber: true,
        isShowQuantityCustomer: true,
        //value margin amount
        leTrai: 1,
        lePhai: 1,
        leTren: 1,
        leDuoi: 1,
        soLuongLien: 1,
        //value Selected
        connectPrint: {
          key: 1,
          text: "Máy in LAN Phổ biến"},
        devicePrint: {
          key: 1,
          text: "XP-80C"
        },
        pageSizePrint: {
          key: 1,
          text: "Giấy in cuộn 80mm"}
      };
      let isCheckBoxBepTemp = { ...prevState.isCheckBoxBep };
      nextProps.listArea.map((area, index) => {
        isCheckBoxBepTemp[area.id] = { ...itemBep };
      })

      let itemBar = {
        selectedType: { key: 1, text: nextProps.t("settingPrint.printAllSameOne") },
        //Object checked checkbox content
        isShowStaffWaiter: true,
        isShowDateOrder: true,
        isShowTableNumber: true,
        isShowQuantityCustomer: true,
        //value margin amount
        leTrai: 1,
        lePhai: 1,
        leTren: 1,
        leDuoi: 1,
        soLuongLien: 1,
        //value Selected
        connectPrint: {
          key: 1,
          text: "Máy in LAN Phổ biến"},
        devicePrint: {
          key: 1,
          text: "XP-80C"
        },
        pageSizePrint: {
          key: 1,
          text: "Giấy in cuộn 80mm"}
      };
      let isCheckBoxBarTemp = { ...prevState.isCheckBoxBar };
      nextProps.listArea.map((area, index) => {
        isCheckBoxBarTemp[area.id] = { ...itemBar };
      })
      return {
        isCheckBoxCasher: isCheckBoxCasherTemp,
        isCheckBoxBep: isCheckBoxBepTemp,
        isCheckBoxBar: isCheckBoxBarTemp,


      };
    }
    return null;
  }

  showSuccess = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'success',
      title: t("tableManagament.notification"),
      text: t("settingPrint.savePrintSuccess"),
      showConfirmButton: true
    })
  }
  showErr = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'error',
      title: t("tableManagament.notification"),
      text: t("settingPrint.savePrintFail")
    })
  }

  /*
    *Func create print bill
  */
  onSaveChangePrintBill = () => {
    const { isCheckBoxCasher, infoAreaSelected } = this.state;
    const { t } = this.props
    const data = {
      printer_name: isCheckBoxCasher[infoAreaSelected.idArea].devicePrint.text ? isCheckBoxCasher[infoAreaSelected.idArea].devicePrint.text : "XP-80C" ,
      logo_path: "",
      header: "",
      footer: "",
      title: "",
      is_print_logo: true,
      left_margin: isCheckBoxCasher[infoAreaSelected.idArea].leTrai,
      right_margin: isCheckBoxCasher[infoAreaSelected.idArea].lePhai,
      top_margin: isCheckBoxCasher[infoAreaSelected.idArea].leTren,
      bottom_margin: isCheckBoxCasher[infoAreaSelected.idArea].leDuoi,
      num_of_copies: isCheckBoxCasher[infoAreaSelected.idArea].soLuongLien,
      paper_size: isCheckBoxCasher[infoAreaSelected.idArea].pageSizePrint.key,
      connect_type: isCheckBoxCasher[infoAreaSelected.idArea].connectPrint.key,
      is_show_partner: isCheckBoxCasher[infoAreaSelected.idArea].isShowRestaurant,
      is_show_date: isCheckBoxCasher[infoAreaSelected.idArea].leTrai,
      is_show_service_staff: isCheckBoxCasher[infoAreaSelected.idArea].isShowStaffWaiter,
      is_show_cashier: isCheckBoxCasher[infoAreaSelected.idArea].isShowStaffCasher,
      is_show_table: isCheckBoxCasher[infoAreaSelected.idArea].isShowTableNumber,
      is_show_bill_no: isCheckBoxCasher[infoAreaSelected.idArea].isShowNoBill,
      area_id: infoAreaSelected.idArea
      /* is_show_checkin: isCheckBoxCasher[infoAreaSelected.idArea].is_show_checkin,
      is_show_checkout: isCheckBoxCasher[infoAreaSelected.idArea].is_show_checkout, --TODO */
    };
    Swal.fire({
      title: `${t("setting.tax.youSure")}?`,
      text: t("settingPrint.askSureYes"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `${t("setting.yes")}`,
      cancelButtonText: `${t("setting.no")}`,
    }).then((result) => {
      if (result.value) {
        this.props.actions.createPrinterBill({
          data,
          callback_success: this.showSuccess,
          callback_fail: this.showErr
        })
      }
    })
  }

  onSaveChangePrintBep = () => {
    const { isCheckBoxBep, infoAreaSelected } = this.state;
    const { t } = this.props
    const data = {
      is_bar: true,
      printer_name: isCheckBoxBep[infoAreaSelected.idArea].devicePrint.text ? isCheckBoxBep[infoAreaSelected.idArea].devicePrint.text : "XP-80C" ,
      logo_path: "",
      header: "",
      footer: "",
      title: "",
      is_print_logo: true,
      left_margin: isCheckBoxBep[infoAreaSelected.idArea].leTrai,
      right_margin: isCheckBoxBep[infoAreaSelected.idArea].lePhai,
      top_margin: isCheckBoxBep[infoAreaSelected.idArea].leTren,
      bottom_margin: isCheckBoxBep[infoAreaSelected.idArea].leDuoi,
      num_of_copies: isCheckBoxBep[infoAreaSelected.idArea].soLuongLien,
      paper_size: isCheckBoxBep[infoAreaSelected.idArea].pageSizePrint.key,
      is_show_guest_number: isCheckBoxBep[infoAreaSelected.idArea].isShowQuantityCustomer,
      is_show_table: isCheckBoxBep[infoAreaSelected.idArea].isShowTableNumber,
      is_show_service_staff: isCheckBoxBep[infoAreaSelected.idArea].isShowStaffWaiter,
      is_show_order_date: isCheckBoxBep[infoAreaSelected.idArea].isShowDateOrder,
      connect_type: isCheckBoxBep[infoAreaSelected.idArea].connectPrint.key,
      print_type: isCheckBoxBep[infoAreaSelected.idArea].selectedType.key,
      area_id: infoAreaSelected.idArea
    };
    Swal.fire({
      title: `${t("setting.tax.youSure")}?`,
      text: t("settingPrint.askSureYes"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `${t("setting.yes")}`,
      cancelButtonText: `${t("setting.no")}`,
    }).then((result) => {
      if (result.value) {
        this.props.actions.createPrinterChickenBar({
          data,
          callback_success: this.showSuccess,
          callback_fail: this.showErr
        })
      }
    })
  }

  onSaveChangePrintBar = () => {
    const { isCheckBoxBar, infoAreaSelected } = this.state;
    const { t } = this.props
    const data = {
      is_bar: true,
      printer_name: isCheckBoxBar[infoAreaSelected.idArea].devicePrint.text ? isCheckBoxBar[infoAreaSelected.idArea].devicePrint.text : "XP-80C" ,
      logo_path: "",
      header: "",
      footer: "",
      title: "",
      is_print_logo: true,
      left_margin: isCheckBoxBar[infoAreaSelected.idArea].leTrai,
      right_margin: isCheckBoxBar[infoAreaSelected.idArea].lePhai,
      top_margin: isCheckBoxBar[infoAreaSelected.idArea].leTren,
      bottom_margin: isCheckBoxBar[infoAreaSelected.idArea].leDuoi,
      num_of_copies: isCheckBoxBar[infoAreaSelected.idArea].soLuongLien,
      paper_size: isCheckBoxBar[infoAreaSelected.idArea].pageSizePrint.key,
      is_show_guest_number: isCheckBoxBar[infoAreaSelected.idArea].leTrai,
      is_show_table: isCheckBoxBar[infoAreaSelected.idArea].isShowTableNumber,
      is_show_service_staff: isCheckBoxBar[infoAreaSelected.idArea].isShowStaffWaiter,
      is_show_order_date: isCheckBoxBar[infoAreaSelected.idArea].isShowDateOrder,
      connect_type: isCheckBoxBar[infoAreaSelected.idArea].connectPrint.key,
      print_type: isCheckBoxBar[infoAreaSelected.idArea].selectedType.key,
      area_id: infoAreaSelected.idArea,
    };
    Swal.fire({
      title: `${t("setting.tax.youSure")}?`,
      text: t("settingPrint.askSureYes"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `${t("setting.yes")}`,
      cancelButtonText: `${t("setting.no")}`,
    }).then((result) => {
      if (result.value) {
        this.props.actions.createPrinterChickenBar({
          data,
          callback_success: this.showSuccess,
          callback_fail: this.showErr
        })
      }
    })
  }

  /*
    *Func dong bo du lieu trong popup setting device trong va ngoai
  */
  onChangeIsCheckBoxCasher = (isCheckBoxCasherInner) => {
    const { infoAreaSelected, isCheckBoxCasher } = this.state;
    let isCheckBoxCasherTemp1 = { ...isCheckBoxCasher };
    isCheckBoxCasherTemp1[infoAreaSelected.idArea] = { ...isCheckBoxCasherInner };
    this.setState({ isCheckBoxCasher: isCheckBoxCasherTemp1 });
  }

  onChangeIsCheckBoxBep = (isCheckBoxBepInner) => {
    const { infoAreaSelected, isCheckBoxBep } = this.state;
    let isCheckBoxBepTemp1 = { ...isCheckBoxBep };
    isCheckBoxBepTemp1[infoAreaSelected.idArea] = { ...isCheckBoxBepInner };
    this.setState({ isCheckBoxBep: isCheckBoxBepTemp1 });
  }

  onChangeIsCheckBoxBar = (isCheckBoxBarInner) => {
    const { infoAreaSelected, isCheckBoxBar } = this.state;
    let isCheckBoxBarTemp1 = { ...isCheckBoxBar };
    isCheckBoxBarTemp1[infoAreaSelected.idArea] = { ...isCheckBoxBarInner };
    this.setState({ isCheckBoxBar: isCheckBoxBarTemp1 });
  }

  componentDidMount() {
    /* let infoToken = common.decodeToken(get("accessToken")); */
    this.props.paymentActions.getInfoPartner();
    this.props.userActions.getAccountInfo();
    this.props.areaActions.getListArea();
    this.props.actions.getPrinterBillList();
    this.props.actions.getPrinterChickenBarList();
  }

  /*
    *Func update select box device trong va ngoai
  */
  onChangeSelectBoxDeviceBep = (selected, device, item) => {
    const {isCheckBoxBep} = this.state;
    let isCheckBoxBepTemp = {...isCheckBoxBep};
    isCheckBoxBepTemp[item.id].devicePrint = device;
    this.setState({
      isCheckBoxBep: isCheckBoxBepTemp
    });
  }

  onChangeSelectBoxDeviceBar = (selected, device, item) => {
    const {isCheckBoxBar} = this.state;
    let isCheckBoxBarTemp = {...isCheckBoxBar};
    isCheckBoxBarTemp[item.id].devicePrint = device;
    this.setState({
      isCheckBoxBar: isCheckBoxBarTemp
    });
  }

  onChangeSelectBoxDeviceCasher = (selected, device, item) => {
    const { isCheckBoxCasher } = this.state;
    let isCheckBoxCasherTemp = { ...isCheckBoxCasher };
    isCheckBoxCasherTemp[item.id].devicePrint = device;
    this.setState({
      isCheckBoxCasher: isCheckBoxCasherTemp
    });
  }

  /*
  *Func update page tabs va thong tin cua tung khu vuc
  */
  onChangeSetValueAreaPrintTempCasher = async(nameAreaCasher, idAreaCasher) => {
    const { infoAreaSelected } = this.state;
    await this.setState({ page: 1, infoAreaSelected: { ...infoAreaSelected, nameArea: nameAreaCasher, idArea: idAreaCasher} });
  }

  onChangeSetValueAreaPrintTempBep = async(nameArea, idArea) => {
    const { infoAreaSelected } = this.state;
    await this.setState({ page: 2, infoAreaSelected: {...infoAreaSelected, nameArea, idArea} });
  }

  onChangeSetValueAreaPrintTempBar = async (nameArea, idArea) => {
    const { infoAreaSelected } = this.state;
    await this.setState({ page: 3, infoAreaSelected: { ...infoAreaSelected, nameArea, idArea } });
  }

  // onTestScanDevice = () => {
  //   find('192.168.0.1').then(devices => {
  //     console.log(devices);
  //     alert(devices);
  //   })
  // }

  render() {
    const { listArea, infoPartner, userInfo, t, ...rest } = this.props;
    const listDevice = [
      {
        key: 1,
        text: "XP-80C"
      },
      {
        key: 2,
        text: "XP-80A"
      }
    ];
    const { tabIndex, page, isCheckBoxCasher, isCheckBoxBep, isCheckBoxBar, infoAreaSelected, showPopupScanDevice, showPopupSettingCasher, showPopupSettingBep, showPopupSettingBar, errors } = this.state;
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
    let pageStyle = "";
    if(page === 1)
    {
      if (isCheckBoxCasher && infoAreaSelected && infoAreaSelected.idArea)
      {
        pageStyle = `
        @page {
          size: auto;
          margin: ${isCheckBoxCasher[infoAreaSelected.idArea].leTren}px ${isCheckBoxCasher[infoAreaSelected.idArea].lePhai}px ${isCheckBoxCasher[infoAreaSelected.idArea].leDuoi}px ${isCheckBoxCasher[infoAreaSelected.idArea].leTrai}px !important;
        }

        @media all {
          .pagebreak {
            display: none;
          }
        }

        @media print {
          .pagebreak {
            page-break-before: auto;
          }
        }
      `;
      }
    } else if(page === 2)
    {
      if (isCheckBoxBep && infoAreaSelected && infoAreaSelected.idArea) {
        pageStyle = `
        @page {
          size: auto;
          margin: ${isCheckBoxBep[infoAreaSelected.idArea].leTren}px ${isCheckBoxBep[infoAreaSelected.idArea].lePhai}px ${isCheckBoxBep[infoAreaSelected.idArea].leDuoi}px ${isCheckBoxBep[infoAreaSelected.idArea].leTrai}px !important;
        }

        @media all {
          .pagebreak {
            display: none;
          }
        }

        @media print {
          .pagebreak {
            page-break-before: auto;
          }
        }
      `;
      }
    }else {
      if (isCheckBoxBar && infoAreaSelected && infoAreaSelected.idArea) {
        pageStyle = `
        @page {
          size: auto;
          margin: ${isCheckBoxBar[infoAreaSelected.idArea].leTren}px ${isCheckBoxBar[infoAreaSelected.idArea].lePhai}px ${isCheckBoxBar[infoAreaSelected.idArea].leDuoi}px ${isCheckBoxBar[infoAreaSelected.idArea].leTrai}px !important;
        }

        @media all {
          .pagebreak {
            display: none;
          }
        }

        @media print {
          .pagebreak {
            page-break-before: auto;
          }
        }
      `;
      }
    };
    return (
      <>
        <div className="print">
          <div className="title-setting e-flex content-center item-center">
            <div className="btn-back">
              <Button className="s3"
                onClick={() => { history.push("/menu") }}>
                <FontAwesomeIcon icon={faLongArrowAltLeft} />
                <span className="e-m-left-5">{t("textCommon.back")}</span>
              </Button>
              {/* <Button onClick={this.onTestScanDevice}>
                Test
              </Button> */}
            </div>
            <h3 className="title-print">{t("setting.print.print")}</h3>
          </div>
          <div className="pr-content">
            <div className="clear print-content">
              <Tabs
                selectedIndex={tabIndex}
                className="tabs-group"
                onSelect={(tabIndex) => {this.setState({ tabIndex, page: tabIndex + 1 })}}
              >
                <TabList className="tab-list e-p-left-0">
                  <Tab>{t("settingPrint.casher")}</Tab>
                  <Tab>{t("settingPrint.bep")}</Tab>
                  <Tab>{t("settingPrint.bar")}</Tab>
                </TabList>
                {/* Cho thu ngan */}
                <TabPanel className={`e-m-top-10 overflow-area ${tabIndex === 0 ? "display-block-tabs" : "display-none-tabs"}`}>
                  {
                    listArea && listArea.length > 0 ?
                      (listArea.map((item, index) => {
                        return <fieldset className="area-group" key={index}>
                          <legend className="title-area">{t("menu.area")} {item.name}</legend>
                          <div className="content-area">
                            <div className="title-group">
                              {t("settingPrint.device")}
                            </div>
                            <div className="select-group">
                              <SelectBox
                                className="search-catogory"
                                onChange={(selected, device) => this.onChangeSelectBoxDeviceCasher(selected, device, item)}
                                value_copy={isCheckBoxCasher && isCheckBoxCasher[item.id].devicePrint && isCheckBoxCasher[item.id].devicePrint.text ? isCheckBoxCasher[item.id].devicePrint.text : ""}
                                dataSource={listDevice}
                                blank={t("settingPrint.deviceChoose")}
                              >
                                <div className="icon-angle-dow">
                                  <FontAwesomeIcon
                                    icon={faAngleDown}
                                  /></div>
                              </SelectBox>
                            </div>
                            <div className="btn-group e-m-top-5">
                              <Button
                                className="height-btn-table e-m-right-5"
                                type="s5"
                                onClick={() => { this.setState({ showPopupScanDevice: true }) }}
                              >
                                <FontAwesomeIcon icon={faSearch} />{" "}
                                {t("settingPrint.scan")}
                              </Button>
                              <Button
                                className="height-btn-table e-m-right-5"
                                type="s5"
                                onClick={() => { this.setState({ showPopupSettingCasher: true, infoAreaSelected: {...infoAreaSelected, nameArea: item.name, idArea: item.id},page: 1 }) }}
                              >
                                <FontAwesomeIcon icon={faCog} />{" "}
                                {t("settingPrint.custom")}
                            </Button>
                              <Button
                                className="height-btn-table e-m-right-5 height-btn-table-print-test"
                                type="s5"
                                onClick={() => this.onChangeSetValueAreaPrintTempCasher(item.name,item.id)}
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
                                <CompPrintBillCasher isCheckBox={isCheckBoxCasher[infoAreaSelected.idArea]} infoAreaSelected={infoAreaSelected} orderDetail={orderDetailTemp} infoPartner={infoPartner} t={t} ref={el => (this.componentRef = el)} />
                              </Button>
                            </div>
                          </div>
                        </fieldset>
                      })) : null
                  }

                </TabPanel>
                {/* Cho bep */}
                <TabPanel className={`e-m-top-10 overflow-area ${tabIndex === 1 ? "display-block-tabs" : "display-none-tabs"}`}>
                  {
                    listArea && listArea.length > 0 ?
                      (listArea.map((item, index) => {
                        return <fieldset className="area-group" key={index}>
                          <legend className="title-area">{t("menu.area")} {item.name}</legend>
                          <div className="content-area">
                            <div className="title-group">
                              {t("settingPrint.device")}
                            </div>
                            <div className="select-group">
                              <SelectBox
                                className="search-catogory"
                                onChange={(selected, device) => this.onChangeSelectBoxDeviceBep(selected, device, item)}
                                value_copy={isCheckBoxBep && isCheckBoxBep[item.id].devicePrint && isCheckBoxBep[item.id].devicePrint.text ? isCheckBoxBep[item.id].devicePrint.text : ""}
                                dataSource={listDevice}
                                blank="Chọn thiết bị..."
                              >
                                <div className="icon-angle-dow">
                                  <FontAwesomeIcon
                                    icon={faAngleDown}
                                  /></div>
                              </SelectBox>
                            </div>
                            <div className="btn-group e-m-top-5">
                              <Button
                                className="height-btn-table e-m-right-5"
                                type="s5"
                                onClick={() => { this.setState({ showPopupScanDevice: true }) }}
                              >
                                <FontAwesomeIcon icon={faSearch} />{" "}
                                {t("settingPrint.scan")}
                              </Button>
                              <Button
                                className="height-btn-table e-m-right-5"
                                type="s5"
                                onClick={() => { this.setState({ showPopupSettingBep: true, infoAreaSelected: { ...infoAreaSelected, nameArea: item.name, idArea: item.id }, page: 2 }) }}
                              >
                                <FontAwesomeIcon icon={faCog} />{" "}
                              {t("settingPrint.custom")}
                            </Button>
                              <Button
                                className="height-btn-table e-m-right-5 height-btn-table-print-test"
                                type="s5"
                                onClick={() => this.onChangeSetValueAreaPrintTempBep(item.name, item.id)}
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
                                <CompPrintBillBepBar isCheckBox={isCheckBoxBep[infoAreaSelected.idArea]} infoAreaSelected={infoAreaSelected} orderDetail={orderDetailTemp} infoPartner={infoPartner} t={t} ref={el => (this.componentRef = el)} />
                              </Button>
                            </div>
                          </div>
                        </fieldset>
                      })) : null
                  }
                </TabPanel>
                {/* Cho bar */}
                <TabPanel className={`e-m-top-10 overflow-area ${tabIndex === 2 ? "display-block-tabs" : "display-none-tabs"}`}>
                  {
                    listArea && listArea.length > 0 ?
                      (listArea.map((item, index) => {
                        return <fieldset className="area-group" key={index}>
                          <legend className="title-area">{t("menu.area")} {item.name}</legend>
                          <div className="content-area">
                            <div className="title-group">
                              {t("settingPrint.device")}
                            </div>
                            <div className="select-group">
                              <SelectBox
                                className="search-catogory"
                                onChange={(selected, device) => this.onChangeSelectBoxDeviceBar(selected, device, item)}
                                value_copy={isCheckBoxBar && isCheckBoxBar[item.id].devicePrint && isCheckBoxBar[item.id].devicePrint.text ? isCheckBoxBar[item.id].devicePrint.text : ""}
                                dataSource={listDevice}
                                blank="Chọn thiết bị..."
                              >
                                <div className="icon-angle-dow">
                                  <FontAwesomeIcon
                                    icon={faAngleDown}
                                  /></div>
                              </SelectBox>
                            </div>
                            <div className="btn-group e-m-top-5">
                              <Button
                                className="height-btn-table e-m-right-5"
                                type="s5"
                                onClick={() => { this.setState({ showPopupScanDevice: true }) }}
                              >
                                <FontAwesomeIcon icon={faSearch} />{" "}
                                {t("settingPrint.scan")}
                              </Button>
                              <Button
                                className="height-btn-table e-m-right-5"
                                type="s5"
                                onClick={() => { this.setState({ showPopupSettingBar: true, infoAreaSelected: { ...infoAreaSelected, nameArea: item.name, idArea: item.id }, page: 3 }) }}
                              >
                                <FontAwesomeIcon icon={faCog} />{" "}
                              {t("settingPrint.custom")}
                            </Button>
                              <Button
                                className="height-btn-table e-m-right-5 height-btn-table-print-test"
                                type="s5"
                                onClick={() => this.onChangeSetValueAreaPrintTempBar(item.name, item.id)}
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
                                <CompPrintBillBepBar isCheckBox={isCheckBoxBar[infoAreaSelected.idArea]} infoAreaSelected={infoAreaSelected} orderDetail={orderDetailTemp} infoPartner={infoPartner} t={t} ref={el => (this.componentRef = el)} />
                              </Button>
                            </div>
                          </div>
                        </fieldset>
                      })) : null
                  }
                </TabPanel>
              </Tabs>
            </div>
            {/* <div className="button-action-print" style={{ textAlign: "right" }}>
              <Button onClick={() => { }}>
                <FontAwesomeIcon icon={faSave} />{" "}
                {t("setting.save")}
              </Button>
            </div> */}
          </div>
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
        </div>
        {showPopupSettingCasher ? (
          <PopupSettingCasher
            hide={() => this.setState({ showPopupSettingCasher: false })}
            show={showPopupSettingCasher}
            infoPartner={infoPartner}
            userInfo={userInfo}
            onChange={this.onChangeIsCheckBoxCasher}
            isCheckBox={page === 1 ? isCheckBoxCasher[infoAreaSelected.idArea] : (page === 2 ? isCheckBoxBep[infoAreaSelected.idArea] : isCheckBoxBar[infoAreaSelected.idArea])}
            listDevice={listDevice}
            pageStyle={pageStyle}
            infoAreaSelected={infoAreaSelected}
            onSaveChangePrintBill={this.onSaveChangePrintBill}
            t={t}
          />
        ) : null}
        {showPopupSettingBep ? (
          <PopupSettingBep
            hide={() => this.setState({ showPopupSettingBep: false })}
            show={showPopupSettingBep}
            infoPartner={infoPartner}
            userInfo={userInfo}
            onChange={this.onChangeIsCheckBoxBep}
            isCheckBox={page === 1 ? isCheckBoxCasher[infoAreaSelected.idArea] : (page === 2 ? isCheckBoxBep[infoAreaSelected.idArea] : isCheckBoxBar[infoAreaSelected.idArea])}
            listDevice={listDevice}
            pageStyle={pageStyle}
            infoAreaSelected={infoAreaSelected}
            onSaveChangePrintBep={this.onSaveChangePrintBep}
            t={t}
          />
        ) : null}
        {showPopupSettingBar ? (
          <PopupSettingBar
            hide={() => this.setState({ showPopupSettingBar: false })}
            show={showPopupSettingBar}
            infoPartner={infoPartner}
            userInfo={userInfo}
            onChange={this.onChangeIsCheckBoxBar}
            isCheckBox={page === 1 ? isCheckBoxCasher[infoAreaSelected.idArea] : (page === 2 ? isCheckBoxBep[infoAreaSelected.idArea] : isCheckBoxBar[infoAreaSelected.idArea])}
            listDevice={listDevice}
            pageStyle={pageStyle}
            infoAreaSelected={infoAreaSelected}
            onSaveChangePrintBar={this.onSaveChangePrintBar}
            t={t}
          />
        ) : null}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state[PaymentReducerName],
    ...state[userReducerName],
    ...state[AreaReducerName],
    ...state[name]
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    paymentActions: bindActionCreators({ ...paymentActions }, dispatch),
    userActions: bindActionCreators({ ...userActions }, dispatch),
    areaActions: bindActionCreators({ ...areaActions }, dispatch),
    actions: bindActionCreators({ ...action }, dispatch)
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(withNamespaces()(MainPrint));
