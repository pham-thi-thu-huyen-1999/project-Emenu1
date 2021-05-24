import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import Validator from "../../../utils/validator";
import "../UserManagement.scss";
import Swal from '../../../../src/utils/sweetalert2';
import "./style.scss"
import { Input, CheckBox, RadioList, Button, CropImage, SelectBox } from "../../../components/common";
import DateStart, { registerLocale } from "react-datepicker";
import common from '../../../utils/common';
import { get } from "../../../services/localStorage";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import languageDateVi from "date-fns/locale/vi";
import languageDateEn from "date-fns/locale/en-GB";
import languageDateJa from "date-fns/locale/ja";

export default class PopupEditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectStatus: "",
      selectedGender: 1,
      image: "",
      userName: "",
      name: "",
      phoneNumber: "",
      group: "",
      email: "",
      birthday: null,
      address: "",
      selectedArea: [],
      selectedUser: props.selectedUser,
      showSelectBox: false,
      errors: {},
      lstAreaInit: []
    };
    const { t } = this.props;
    const rules = [
      {
        field: "name",
        method: "isEmpty",
        validWhen: false,
        message: `${t("user.request_name_not_empty")}`
      },
      {
        field: "phoneNumber",
        method: "isEmpty",
        validWhen: false,
        message: `${t("user.request_phone_not_empty")}`
      },
      {
        field: "phoneNumber",
        method: "isNumeric",
        validWhen: true,
        message: `${t("user.request_format_phone")}`
      },
      {
        field: "email",
        method: "isEmpty",
        validWhen: false,
        message: `${t("user.request_email_not_empty")}`
      },
      {
        field: "email",
        method: "isEmail",
        validWhen: true,
        message: `${t("user.request_format_email")}`
      },
      {
        field: "userName",
        method: "isEmpty",
        validWhen: false,
        message: `${t("user.request_username_is_not_empty")}`
      },
      {
        field: "group",
        method: "isEmpty",
        validWhen: false,
        message: `${t("user.chooseGroup")}`
      }
    ];
    this.validator = new Validator(rules);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.selectedUser !== prevState.selectedUser) {
      return {
        selectedUser: nextProps.selectedUser,
        selectStatus: nextProps.selectedUser.status,
        selectedGender: nextProps.selectedUser.gender,
        image: nextProps.selectedUser.avatar,
        userName: nextProps.selectedUser.username,
        name: nextProps.selectedUser.full_name,
        phoneNumber: nextProps.selectedUser.phone_number,
        group: nextProps.selectedUser.group_user_id,
        email: nextProps.selectedUser.email,
        birthday: nextProps.selectedUser.birthday ? new Date(nextProps.selectedUser.birthday) : '',
        address: nextProps.selectedUser.address1,
        selectedArea: nextProps.selectedUser.UserAreas.map(area => { return area.area_id }),
        lstAreaInit: nextProps.selectedUser.UserAreas.map(area => { return area.area_id }),
      };

    } else return null;
  }

  handleGenderChange = changeEvent => {
    const { t } = this.props;
    this.setState({
      selectedGender: changeEvent.target.value === t("user.male") ? 1 : 0
    });
  };

  handleOptionChange = changeEvent => {
    this.setState({
      selectStatus: changeEvent.target.value === "active" ? 1 : 0
    });
  };

  showSuccess = () => {
    const { t, hide } = this.props
    Swal.fire({
      title: t("user.noti"),
      icon: 'success',
      text: `${t("user.updateSuccess")}`,
      showConfirmButton: true,
    })
    hide();
  }

  showErr = (res) => {
    const { t } = this.props;
    if (!res.data.error) {
      Swal.fire({
        icon: 'error',
        title: `${t("user.noti")}`,
        text: `${t("user.updateFail")}`
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: `${t("user.noti")}`,
        text: res.data.error.internal_message
      })
    }
  }

  HandleClickArea = (id) => {
    const { selectedArea } = this.state;
    let arrayTemp = [...selectedArea];
    const indexOfId = arrayTemp.indexOf(id);
    if (indexOfId === -1) {
      arrayTemp = arrayTemp.concat(id);
    } else {
      arrayTemp.splice(indexOfId, 1);
    }

    this.setState({ selectedArea: arrayTemp });
  };
  getAreaUnsub = lstAreaSub => {
    const { lstAreaInit } = this.state;
    let lstAreaUnsub = []
    for(let i in lstAreaInit){
      if(lstAreaInit[i] !== lstAreaSub[i]){
        lstAreaUnsub.push(lstAreaInit[i])
      }
    }
    return lstAreaUnsub
  }
  /**
   * Update info user
   */

  onUpdateUser = async () => {
    const {
      image,
      userName,
      phoneNumber,
      group,
      selectStatus,
      email,
      birthday,
      selectedGender,
      address,
      name,
      selectedArea,
      lstAreaInit
    } = this.state;

    // Get info token
    let infoToken = common.decodeToken(get('accessToken'));

    const avatar = await this.cropImage.uploadImage();

    const data = {
      avatar,
      user_id: this.props.selectedUser.id,
      staff_id: this.props.selectedUser.id,
      email,
      full_name: name,
      username: this.props.code + userName.split(this.props.code).join(""),
      gender: selectedGender,
      birthday: birthday.toString(),
      phone_number: phoneNumber,
      address1: address,
      address2: "",
      group_user_id: group,
      areas: selectedArea,
      partner_id: infoToken.partner_id,
      status: selectStatus
    };
    this.getAreaUnsub(selectedArea)
    this.props.actions.editUser({
      data,
      image,
      lstAreaUnsub: this.getAreaUnsub(selectedArea),
      callSuccess: this.showSuccess,
      callFail: this.showErr,
    });

    this.props.actions.getUserList({ index: 0 });
    this.props.onEventChange();

  };

  showAlert = () => {
    const { t } = this.props;
    if (Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object) {

      this.setState({
        errors: {}
      });
      Swal.fire({
        title: t("user.noti"),
        text: t("user.noti_edit_user"),
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: t("user.yes"),
        cancelButtonText: t("user.cancel"),
      }).then((result) => {
        if (result.value) {
          this.onUpdateUser();
        }
      })
    } else {
      this.setState({
        errors: this.validator.validate(this.state),
      });
    }
  }


  /**
   * config language datepicker
   */
  loadConfigDateLanguage = () => {
    const { t } = this.props
    const endCode = t("user.languageDate")
    switch (endCode) {
      case "vi":
        registerLocale("languageDate",  languageDateVi);
        break;
      case "en-GB":
        registerLocale("languageDate",  languageDateEn);
        break;
      case "ja":
        registerLocale("languageDate",  languageDateJa);
        break;
      default:
        break;
      }
  }

  componentDidMount(){
    this.loadConfigDateLanguage()
  }



  /**
   * Show message success
   */

  render() {
    const { t, listArea } = this.props;
    let listStatus = [{
      key: 1,
      text: `${t("user.active")}`
    }, {
      key: 0,
      text: `${t("user.inActive")}`
    }];
    const {
      showSelectBox,
      errors,
      image,
      userName,
      phoneNumber,
      group,
      email,
      birthday,
      address,
      name,
      selectedGender,
      selectedArea,
      selectStatus
    } = this.state;
    var listGroupType = [
      { key: 1, text: t("user.male") },
      { key: 2, text: t("user.female") },
    ]
    return (
      <div
        id="popup-add-user"
        className="popup-add-new"
        ref={this.wrapperRef}
      >
        <h3 className="sec-tit text-center">{t("user.popupedituser")}</h3>
        <div className="e-row e-col-12">
          <div className="e-col-3 e-flex item-center content-center">
            <div className="user-image-container flex-view middle e-m-0">
              <CropImage
                ref={element => (this.cropImage = element)}
                src={image}
                name="image-user"
                textAdd={t("dishManagament.addimg")}
                title={t("dishManagament.editImg")}
                btnChoseFile={t("dishManagament.chooseImg")}
                btnDone={t("dishManagament.swalAgree")}
              />
            </div>
          </div>
          <div className="e-col-9 e-row content-field-add">
            <div className="e-col-6 e-row">
              <div className="e-col-12 e-row">
                <div className="lbl e-col-4 e-flex item-center">{t("user.username")}</div>
                <div className="val-wrap input-box e-col-8">
                  <Input
                    style={{
                      paddingLeft: "6em",
                    }}
                    type="text"
                    value={userName.split(this.props.code).join("")}
                    className="input-user-name"
                    onChange={e => {
                      if (e.target.value === "") {
                        this.setState({ userName: e.target.value, errors: { ...errors, userName: e.target.value === "" ? (this.validator.validate(this.state).userName ? this.validator.validate(this.state).userName : t("user.request_username_is_not_empty")) : null } })
                      } else {
                        delete errors.userName;
                        this.setState({ userName: e.target.value, errors: { ...errors } })
                      }
                    }}
                  /><span className="unit_span_edit">{this.props.code}</span>

                </div>

                {errors.userName ? (
                  <div className="e-col-12 e-row">
                    <div className="e-col-4"></div>
                    <div
                      className="validation e-col-8"
                      style={{ display: "block" }}
                    >
                      {errors.userName}
                    </div>
                  </div>
                ) : null}

              </div>
              <div className="e-col-12 e-row e-m-top-10 e-flex item-center">
                <div className="lbl e-col-4 e-flex item-center">{t("user.name")}</div>
                <div className="val-wrap e-col-8">
                  <Input
                    type="text"
                    value={name ? name : ""}
                    onChange={e => {
                      if (e.target.value === "") {
                        this.setState({ name: e.target.value, errors: { ...errors, name: e.target.value === "" ? (this.validator.validate(this.state).name ? this.validator.validate(this.state).name : t("user.request_name_not_empty")) : null } })
                      } else {
                        delete errors.name;
                        this.setState({ name: e.target.value, errors: { ...errors } })
                      }
                    }}
                  />
                  {errors.name ? (
                    <div
                      className="validation"
                      style={{ display: "block" }}
                    >
                      {errors.name}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="e-col-12 e-row e-m-top-10">
                <div className="lbl e-col-4 e-flex item-center">{t("user.phone")}</div>
                <div className="val-wrap e-col-8">
                  <Input
                    type="text"
                    value={phoneNumber ? phoneNumber : ""}
                    onKeyDown={evt =>
                      evt.key === "e" && evt.preventDefault()
                    }
                    onChange={e => {
                      if (e.target.value === "") {
                        this.setState({ phoneNumber: e.target.value, errors: { ...errors, phoneNumber: e.target.value === "" ? t("user.request_phone_not_empty") : null } })
                      } else {
                        delete errors.phoneNumber;
                        this.setState({ phoneNumber: e.target.value, errors: { ...errors } })
                      }
                    }}
                  />
                  {errors.phoneNumber ? (
                    <div
                      className="validation"
                      style={{ display: "block" }}
                    >
                      {errors.phoneNumber}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="e-col-12 e-row e-m-top-10">
                <div className="lbl e-col-4 e-flex item-center">{t("user.email")}</div>
                <div className="val-wrap e-col-8">
                  <Input
                    type="text"
                    value={email ? email : ""}
                    onChange={e => {
                      if (e.target.value === "") {
                        this.setState({ email: e.target.value, errors: { ...errors, email: e.target.value === "" ? t("user.request_format_email") : null } })
                      } else {
                        delete errors.email;
                        this.setState({ email: e.target.value, errors: { ...errors } })
                      }
                    }}
                  />
                  {errors.email ? (
                    <div
                      className="validation"
                      style={{ display: "block" }}
                    >
                      {errors.email}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="e-col-6 e-row e-p-left-15">
              <div className="e-col-12 e-row e-flex item-center">
                <div className="lbl e-col-3">{t("user.birthday")}</div>
                <div className="e-col-9">
                  <div className="position-relative">
                    <DateStart
                      className="emenu-input"
                      selected={birthday}
                      onChange={birthday => {
                        this.setState({ birthday });
                      }}
                      dateFormat="dd / MM / yyyy "
                      locale="languageDate"
                    />
                    <span className="icon" style={{ top: "15px" }}>
                      <FontAwesomeIcon icon={faCalendarAlt} />
                    </span>
                  </div>
                </div>
              </div>
              <div className="e-col-12 e-row e-flex item-center e-m-top-10" style={{height: "50px"}}>
                <div className="e-col-3">
                  {t("user.gender")}
                </div>
                <div className="e-col-9">
                  <RadioList
                    name="type"
                    dataSource={listGroupType}
                    onChange={selectedGender => this.setState({ selectedGender })}
                    selected={selectedGender}
                  />
                </div>
              </div>
              <div className="e-col-12 e-row e-flex item-center e-m-top-10">
                <div className="lbl e-col-3">{t("user.group")}</div>
                <div className="e-col-9">
                  <SelectBox
                    className="search-catogory"
                    onChange={group => {
                      if (group === "") {
                        this.setState({
                          group,
                          errors: {
                            ...errors,
                            group: group === ""
                              ?  t("user.chooseGroup") : null
                          }
                        })
                      } else {
                        delete errors.group;
                        this.setState({ group, errors: { ...errors } })
                      }
                    }}
                    map={{
                      key: "id",
                      text: "name"
                    }}
                    dataSource={this.props.groupUser}
                    selected={this.state.group}
                    blank={t("user.group")}
                  >
                    <div className="rt">
                      <FontAwesomeIcon
                        style={{ marginTop: -5 }}
                        icon={faSortDown}
                        size="2x"
                        color="#F27922"
                      />
                    </div>
                  </SelectBox>
                </div>
              </div>
              <div></div>
              <div className="e-col-12 e-row e-m-top-10 e-flex item-center">
                <div className="e-col-3 e-flex item-center">{t("user.createShift.status")}</div>
                <div className="e-col-9">
                  <SelectBox
                    className="form-group-search__select-box"
                    onChange={e => this.setState({ selectStatus: e })}
                    value={selectStatus}
                    dataSource={listStatus}
                    selected={selectStatus}
                  >
                    <div className="icon-angle-dow">
                      <FontAwesomeIcon icon={faAngleDown} />
                    </div>
                  </SelectBox>
                </div>
              </div>
            </div>

            <div className="e-col-12 e-row e-m-top-10">
              <div className="lbl e-col-2 e-flex item-center">{t("user.address")}</div>
              <div className="val-wrap e-col-10 address">
                <Input
                  name="Text1"
                  value={address}
                  /* style={{ width: "84%" }} */
                  onChange={e =>
                    this.setState({ address: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="e-col-12 e-row area-edit">
          <h4 className="">{t("user.in_charge_of_area")}</h4>
          <div className="popup-add-employee-to-shift__content e-row e-col-12 e-flex content-center e-p-20">
            {listArea.map((area, i) => (
              <div className="e-col-2 area-name e-flex content-start" key={i}>
                <CheckBox
                  name={area.id}
                  label={area.name}
                  /* checked={selectedArea.some((selected) => selected.area_id === area.id )} */
                  checked={selectedArea.indexOf(area.id) !== -1}
                  onChange={() => this.HandleClickArea(area.id)}
                />
                <br /> <br />
              </div>
            ))}
          </div>
        </div>

        <div className="e-col-12 flex-end e-row">
          <div className="acts grp-btns text-center">
            <Button type="s3" style={{ marginRight: 5 }} onClick={() => { this.props.hide(); this.setState({ errorMessage: "" }) }}>
              {t("user.back")}
            </Button>

            <Button
              className={JSON.stringify(errors) === JSON.stringify({}) ? "" : "disable"}
              onClick={JSON.stringify(errors) === JSON.stringify({}) ? this.showAlert : () => { }}
            >
              {t("user.save")}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
