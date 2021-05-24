import React, { Component } from "react";
import { Input } from "../../../components/common";
import Button from "../../../components/common/Button";
import Validator from "../../../utils/validator";
import Swal from "../../../utils/sweetalert2";

export default class PopoupChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: "",
      confirmPassword: "",
      errors: {},
    };
    const { t } = this.props;
    const rules = [
      {
        field: "newPassword",
        method: "isEmpty",
        validWhen: false,
        message: t("user.request_password_not_empty"),
      },
      {
        field: "confirmPassword",
        method: "isEmpty",
        validWhen: false,
        message: t("user.request_password_confirm_not_empty"),
      },
    ];
    this.validator = new Validator(rules);
  }

  changePassword = () => {
    const { t, selectedUser } = this.props;
    const {
      newPassword,
      confirmPassword
    } = this.state;
    const data = {
      password: newPassword,
      user_id: selectedUser.id,
    };
    if (
      Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object &&
      newPassword === confirmPassword
    ) {
      const { t } = this.props;
      Swal.fire({
        title: t("user.noti"),
        text: t("user.noti_change_password"),
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: t("user.yes"),
        cancelButtonText: t("user.cancel"),
      }).then((result) => {
        if (result.value) {
          this.props.actions.changePassword({
            data,
            callback_success: this.showOk,
            callback_fail: this.showErr
          });
          this.props.hide();
        }
      })
    } else {
      if (confirmPassword !== "" && newPassword !== confirmPassword) {
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
  };
  showAlert = () => {
    const { t } = this.props;
    Swal.fire({
      title: t("user.noti"),
      text: t("user.noti_change_password"),
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: t("user.yes"),
      cancelButtonText: t("user.cancel"),
    }).then((result) => {
      if (result.value) {
        this.changePassword();
      }
    })
  }
  showOk = () => {
    const { t } = this.props;
    Swal.fire({
      icon: 'success',
      text: t("user.change_password_success"),
      title: t("user.noti")
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
    const { hide, t } = this.props;
    const { errors } = this.state;
    return (
      <section>
        <h3 className="text-center">
          {t("user.change_password")}
        </h3>
        <div className="content-pass">
          <div className="e-row field-pass e-flex item-center">
            <div className="e-col-3">
              <label>
                {t("user.new_pass")} <span>*</span>
              </label></div>
            <div className="e-col-9" >
              <Input
                type="password"
                onChange={(e) =>
                  this.setState({
                    newPassword: e.target.value,
                    errors: { newPassword: "" },
                  })
                }
              ></Input>
              {errors.newPassword ? (
                <div className="validation">
                  {errors.newPassword}
                </div>
              ) : null}
            </div>
          </div>

          <div className="e-row field-pass e-flex item-center" >
            <div className="e-col-3"><label>{t("user.new_pass_again")}<span>*</span></label></div>
            <div className="e-col-9">
              <Input
                type="password"
                onChange={(e) =>
                  this.setState({
                    confirmPassword: e.target.value,
                    errors: { confirmPassword: "" },
                  })
                }
              ></Input>
              {errors.confirmPassword ? (
                <div className="validation">
                  {errors.confirmPassword}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <aside
          className="acts grp-btns text-right"
          style={{ textAlign: "center" }}
        >
          <Button type="s3" style={{ marginRight: 5 }}
            onClick={() => { this.props.hide() }}>
            {t("user.back")}
          </Button>

          <Button
            onClick={this.changePassword}
          >
            {t("user.save")}
          </Button>
        </aside>
      </section>

    );
  }
}




