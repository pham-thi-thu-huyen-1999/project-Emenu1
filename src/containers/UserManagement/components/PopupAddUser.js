import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown, faCalendarAlt, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import Validator from "../../../utils/validator";
// import DatePicker from "react-datepicker";
import "../UserManagement.scss";
import Swal from '../../../../src/utils/sweetalert2';
import "./style.scss"
import {
  Input, CheckBox, RadioList,
  Button, CropImage, SelectBox
} from "../../../components/common"
import common from '../../../utils/common';
import { get } from "../../../services/localStorage";
import DateStart, { registerLocale } from "react-datepicker";
import languageDateVi from "date-fns/locale/vi";
import languageDateEn from "date-fns/locale/en-GB";
import languageDateJa from "date-fns/locale/ja";

export default class PopupAddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSelectBox: false,
      selectStatus: 0,
      selectedGender: 0,
      image: "",
      userName: "",
      password: "",
      confirmPassword: "",
      name: "",
      phoneNumber: "",
      group: "",
      email: "",
      birthday: new Date(),
      address: "",
      errors: {},
      selectedArea: [],
      errorMessage: this.props.errorMessage,
      code: this.props.code,
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
        field: "password",
        method: "isEmpty",
        validWhen: false,
        message: `${t("user.request_password_not_empty")}`
      },
      {
        field: "confirmPassword",
        method: "isEmpty",
        validWhen: false,
        message: `${t("user.request_password_confirm_not_empty")}`
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isLoading && !this.props.errorMessage) {
      this.props.hide();
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.code !== prevState.code) {
      return {
        code: nextProps.code,
      };
    } else return null;
  }

  HandleClickArea = (id) => {
    let { selectedArea } = this.state;
    const indexOfId = selectedArea.indexOf(id);

    if (indexOfId === -1) {
      selectedArea = selectedArea.concat(id);
    } else {
      selectedArea.splice(indexOfId, 1);
    }

    this.setState({ selectedArea });

  };

  handleClick = event => {
    const { target } = event;
    if (this.wrapperRef.current === null) {
      return;
    }
    if (
      !this.wrapperRef.current.contains(target) &&
      target.outerHTML.slice(12, 33) !== "react-datepicker__day"
    ) {
      this.props.hide();
    }
  };

  handleGenderChange = changeEvent => {
    const { t } = this.props;
    this.setState({
      selectedGender: changeEvent.target.value === `${t("user.male")}` ? true : false
    });
  };

  handleOptionChange = changeEvent => {
    this.setState({
      selectStatus: changeEvent.target.value
    });
  };

  onAddUser = async () => {
    const { t } = this.props;
    const {
      userName,
      phoneNumber,
      group,
      selectStatus,
      email,
      birthday,
      selectedGender,
      address,
      name,
      password,
      selectedArea,
      code
    } = this.state;

    let infoToken = common.decodeToken(get('accessToken'));
    const avatar = await this.cropImage.uploadImage();
    const data = {
      avatar,
      username: code + userName,
      password,
      phone_number: phoneNumber,
      email,
      address1: address,
      address2: "",
      full_name: name,
      gender: selectedGender,
      partner_id: infoToken.partner_id,
      birthday: birthday.toString(),
      group_user_id: group,
      areas: selectedArea,
      status: selectStatus
    };
    this.props.actions.createUser({
      data,
      callSuccess: this.showSuccess,
      callFail: this.showErr,
    });

    this.props.onEventChange();

  };

  showAlert = () => {
    const { t } = this.props;
    const { password, confirmPassword } = this.state;
    if (
      Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object &&
      password === confirmPassword
    ) {
      this.setState({
        errors: {}
      });
      Swal.fire({
        title: t("user.noti"),
        text: t("user.noti_add_user"),
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: t("user.yes"),
        cancelButtonText: t("user.cancel"),
      }).then((result) => {
        if (result.value) {
          this.onAddUser();
        }
      })
    } else {
      if (password !== confirmPassword) {
        this.setState({
          errors: {
            ...this.validator.validate(this.state),
            confirmPassword: `${t("user.request_password_confirm_not_correct")}`
          }
        });
      } else {
        this.setState({
          errors: this.validator.validate(this.state)
        });
      }
    }
  }
  /**
   * Show message success
   */
  showSuccess = () => {
    const { t } = this.props
    Swal.fire({
      title: t("user.noti"),
      icon: 'success',
      text: `${t("user.createSuccess")}`,
      showConfirmButton: true,
    })
  }
  /**
   * Show message fail
   * @param {*} res
   */
  showErr = (res) => {
    const { t } = this.props;
    if (!res.data.error) {
      Swal.fire({
        icon: 'error',
        title: `${t("user.noti")}`,
        text: `${t("user.createFail")}`
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: `${t("user.noti")}`,
        text: res.data.error.internal_message
      })
    }
  }

  render() {
    const { /* hide, */ t, listArea } = this.props;
    let listStatus = [{
      key: 1,
      text: `${t("user.active")}`
    }, {
      key: 0,
      text: `${t("user.inActive")}`
    }];
    const { errors, birthday, selectedArea,
      code, selectedGender, selectStatus } = this.state;
    var listGroupType = [
      { key: 1, text: t("user.male") },
      { key: 2, text: t("user.female") },
    ]
    return (
      <section
        id="popup-add-user"
        className="popup-add-new"
        ref={this.wrapperRef}
      >
        <h3 className="sec-tit text-center">{t("user.popupadduser")}</h3>
        <div className="e-row e-col-12">
          <div className="e-col-3 e-flex item-center content-center">
            <div className="user-image-container flex-view middle e-m-0">
              <CropImage
                ref={element => (this.cropImage = element)}
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
                <div className="lbl e-col-3 e-flex item-center">{t("user.name")}</div>
                <div className="val-wrap e-col-9">
                  <Input
                    type="text"
                    defaultValue=""
                    onChange={e => {
                      if (e.target.value === "") {
                        this.setState({
                          name: e.target.value, errors: {
                            ...errors, name: e.target.value === ""
                              ? (this.validator.validate(this.state).name
                                ? this.validator.validate(this.state).name
                                : t("user.request_name_not_empty")) : null
                          }
                        })
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
                <div className="lbl e-col-3 e-flex item-center">{t("user.phone")}</div>
                <div className="val-wrap e-col-9">
                  <Input
                    type="number"
                    defaultValue=""
                    onKeyDown={evt =>
                      evt.key === "e" && evt.preventDefault()
                    }
                    onChange={e => {
                      if (e.target.value === "") {
                        this.setState({
                          phoneNumber: e.target.value,
                          errors: {
                            ...errors, phoneNumber: e.target.value === ""
                              ? (this.validator.validate(this.state).phoneNumber
                                ? this.validator.validate(this.state).phoneNumber
                                : t("user.request_phone_not_empty")) : null
                          }
                        })
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
                <div className="lbl e-col-3 e-flex item-center">{t("user.email")}</div>
                <div className="val-wrap e-col-9">
                  <Input
                    type="text"
                    defaultValue=""
                    onChange={e => {
                      if (e.target.value === "") {
                        this.setState({
                          email: e.target.value,
                          errors: {
                            ...errors, email: e.target.value === ""
                              ? t("user.request_email_not_empty") : null
                          }
                        })
                      } else {
                        delete errors.email;
                        this.setState({ email: e.target.value, errors: { ...errors } })
                      }
                    }}
                  />
                </div>
              </div>
              <div className="e-col-12 e-row e-m-top-10 e-flex item-center">
                <div className="e-col-3">{t("user.createShift.status")}</div>
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
            <div className="e-col-6 e-row e-p-left-15">
              <div className="e-col-12 e-row">
                <div className="lbl e-col-3 e-flex item-center">{t("user.birthday")}</div>
                <div className="e-col-9">
                  <div className="position-relative">
                    <DateStart
                      className="emenu-input"
                      selected={birthday}
                      onChange={(date) => this.setState({ birthday: date })}
                      dateFormat="dd / MM / yyyy "
                      locale="languageDate"
                    />
                    <span className="icon" style={{ top: "15px" }}>
                      <FontAwesomeIcon icon={faCalendarAlt} />
                    </span>
                  </div>
                </div>
              </div>
              <div className="e-col-12 e-row e-flex item-center e-m-top-10"
                style={{height: "50px"}}
              >
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
              <div className="e-col-12 e-row e-m-top-10 e-flex item-center e-m-bottom-10">
                <div className="lbl e-col-3 e-flex item-center">{t("user.group")}</div>
                <div className="val-wrap e-col-9">
                  <SelectBox
                    className="search-catogory"
                    onChange={group => {
                      if (group === "") {
                        this.setState({
                          group,
                          errors: {
                            ...errors,
                            group: group === ""
                              ? t("user.chooseGroup") : null
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
                  {errors.group ? (
                    <div
                      className="validation"
                      style={{ display: "block" }}
                    >
                      {errors.group}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="e-col-12 e-row" style={{height: "50px"}}>
              </div>
            </div>
            <div className="e-col-12 e-flex e-m-top-10 field-address">
              <div className="lbl e-flex item-center title-address">{t("user.address")}</div>
              <div className="val-wrap e-col-11 address-add">
                <Input
                  name="Text1"
                  onChange={e =>
                    this.setState({ address: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="e-col-12 e-row">
          <div className="e-col-6">
            <div className="from-user-right">
              <div className="pwd">
                <ul className="form-fields fl width100">
                  <li className="it flex-view middle">
                    <div className="lbl">{t("user.username")}</div>
                    <div className="val-wrap">
                      <div className="input-box">
                        <input
                          style={{
                            paddingLeft: "6em",
                          }}
                          type="text"
                          defaultValue=""
                          onChange={e => {
                            if (e.target.value === "") {
                              this.setState({ userName: e.target.value, errors: { ...errors, userName: e.target.value === "" ? (this.validator.validate(this.state).userName ? this.validator.validate(this.state).userName : t("user.request_username_is_not_empty")) : null } })
                            } else {
                              delete errors.userName;
                              this.setState({ userName: e.target.value, errors: { ...errors } })
                            }
                          }}
                        /><span className="unit_span">{code}</span>
                      </div>
                      {errors.userName ? (
                        <div className="validation">{errors.userName}</div>
                      ) : null}
                    </div>
                  </li>
                  <li className="it flex-view middle">
                    <div className="lbl">{t("user.password")}</div>
                    <div className="val-wrap">
                      <input
                        type="password"
                        defaultValue=""
                        onChange={e => {
                          if (e.target.value === "") {
                            this.setState({ password: e.target.value, errors: { ...errors, password: e.target.value === "" ? (this.validator.validate(this.state).password ? this.validator.validate(this.state).password : t("user.request_password_not_empty")) : null } })
                          } else {
                            delete errors.password;
                            this.setState({ password: e.target.value, errors: { ...errors } })
                          }
                        }}
                      />
                      {errors.password ? (
                        <div className="validation">{errors.password}</div>
                      ) : null}
                    </div>
                  </li>
                  <li className="it flex-view middle">
                    <div className="lbl">{t("user.confPass")}</div>
                    <div className="val-wrap">
                      <input
                        type="password"
                        defaultValue=""
                        onChange={e => {
                          if (e.target.value === "") {
                            this.setState({ confirmPassword: e.target.value, errors: { ...errors, confirmPassword: e.target.value === "" ? (this.validator.validate(this.state).confirmPassword ? this.validator.validate(this.state).confirmPassword : t("user.request_password_confirm_not_empty")) : null } })
                          } else {
                            delete errors.confirmPassword;
                            this.setState({ confirmPassword: e.target.value, errors: { ...errors } })
                          }
                        }}

                      />
                      {errors.confirmPassword ? (
                        <div className="validation">
                          {errors.confirmPassword}
                        </div>
                      ) : null}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="e-col-6 area-add-user">
            <h4 className="e-m-20 e-flex content-center">{t("user.in_charge_of_area")}</h4>
            <div className="popup-add-employee-to-shift__content e-row e-col-12 e-flex item-center">
              {listArea.map((area, i) => (
                <div className="e-col-3 area-name e-flex content-center" key={i}>
                  <CheckBox
                    name={area.id}
                    label={area.name}
                    checked={selectedArea.indexOf(area.id) !== -1}
                    onChange={() => this.HandleClickArea(area.id)}
                  />
                  <br /> <br />
                </div>
              ))}
            </div>
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
      </section>
    );
  }
}
