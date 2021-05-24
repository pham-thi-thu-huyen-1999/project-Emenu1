import React, { Component } from "react";
import Swal from '../../../../src/utils/sweetalert2';
import { Input, CheckBox, Button, Dialog } from "../../../components/common";
import Validator from "../../../utils/validator";
import './style.scss';

export default class PopupDishDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameGroup: "",
      selected: [],
      errors: {},
      noti_errors_no_check: ""
    };
    this.wrapperRef = React.createRef();
    const { t } = this.props;
    const rules = [
      {
        field: "nameGroup",
        method: "isEmpty",
        validWhen: false,
        message: t("user.permission"),
      },
    ];
    this.validator = new Validator(rules);
  }
  componentDidMount() {
    document.addEventListener("click", this.handleClick);
  }

  componentWillUnmount() {
    // important
    document.removeEventListener("click", this.handleClick);
  }
  handleClick = (event) => {
    const { target } = event;
    if (this.wrapperRef.current === null) {
      return;
    }
    if (!this.wrapperRef.current.contains(target)) {
      this.props.hide();
    }
  };

  HandleClickRole = (role) => {
    let { selected } = this.state;
    const indexRole = selected.indexOf(role);

    if (indexRole === -1) {
      selected = selected.concat(role);
    } else {
      selected.splice(indexRole, 1);
    }
    this.setState({ selected });
  };

  onAddGroup = () => {
    const { nameGroup, selected } = this.state;
    const { hide, actions } = this.props;
    let arrRoleId = [];
    selected.forEach((role) => {
      arrRoleId.push({ role_id: role.id });
    });
    const data = { name: nameGroup, description: "", arrRoleId };

    actions.addGroupUser({ data, callSuccess: this.showSuccess, callFail: this.showErr });
    hide();

  };

  showAlert = () => {
    const { t } = this.props;
    let check_noti = false;
    if (this.state.selected.length == 0) {
      this.setState({
        noti_errors_no_check: "Vui lòng chọn chức năng",
      });
      check_noti = false;
    } else {
      this.setState({
        noti_errors_no_check: "",
      });
      check_noti = true;
    }
    if (
      Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object && check_noti === true
    ) {
      Swal.fire({
        title: t("user.noti"),
        text: t("user.noti_sure"),
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: t("user.yes"),
        cancelButtonText: t("user.cancel"),
      }).then((result) => {
        if (result.value) {
          this.onAddGroup();
        }
      })
    } else {
      this.setState({
        errors: this.validator.validate(this.state),
      });
    }
  }

  showSuccess = () => {
    const { t } = this.props;
    Swal.fire({
      title: t("user.noti"),
      icon: 'success',
      text: t("user.success"),
      showConfirmButton: true,
    })
  }

  showErr = (res) => {
    const { t } = this.props;
    if (!res.data.error) {
      Swal.fire({
        icon: 'error',
        title: `${t("user.noti")}`,
        text: `${t("user.error")}`
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
    const { show, hide, t } = this.props;
    const { selected, errors, noti_errors_no_check } = this.state;
    return (

      <Dialog show={show} close={hide} innerClass="max-width-popup-add-group">
        <h3 className="main-lbl text-center title-add-gr">{t("user.add_group")}</h3>
        <aside className="inner-cont">
          <div className="field-add-gr">
            <div className="title-field-add-gr">
              <span style={{ fontSize: 18 }}>{t("user.nameGroup")}
                <span className="text-red">*</span></span></div>
            <div className="flex">
              <Input
                className=""
                onChange={(e) => {
                  this.setState({ nameGroup: e.target.value });
                }}
              />
              {errors.nameGroup ? (
                <div className="validation e-m-top-10">
                  {errors.nameGroup}
                </div>
              ) : null}
            </div>
          </div>
          <div className="field-select-func e-flex" style={{ marginTop: 15 }}>
            <div className="title-func"><span style={{ fontSize: 18 }}>{t("user.feature")}
              <span className="text-red">*</span></span></div>
            <div className="list-func">
              <div className="content-list-func">
                {this.props.roleList.map((role, i) => (
                  <div className="func-item" key={i}>
                    <CheckBox
                      name={role.name + 1}
                      label={role.name}
                      checked={selected.indexOf(role) !== -1}
                      onChange={() => this.HandleClickRole(role)}
                    />
                  </div>
                ))}
              </div>
              {noti_errors_no_check != "" ? (
                <div className="validation">
                  {noti_errors_no_check}
                </div>
              ) : null}
            </div>
          </div>
        </aside>
        <aside className="acts grp-btns text-right">
          <Button type="s3" style={{ marginRight: 5 }} onClick={() => { this.props.hide() }}>
            {t("user.back")}
          </Button>

          <Button
            onClick={this.showAlert}
          >
            {t("user.save")}
          </Button>
        </aside>
      </Dialog >
    );
  }
}
