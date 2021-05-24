import React, { Component } from "react";
import { Dialog } from "../../../components/common";
import Swal from '../../../../src/utils/sweetalert2';
import { Input, Button } from "../../../components/common";
import Validator from "../../../utils/validator";

export default class PopupEditGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameGroup: "",
      name: '',
      errors: {},
    };
    const { t } = this.props;
    this.wrapperRef = React.createRef();
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

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.selectedGroup) {
      if (nextProps.selectedGroup.name !== prevState.nameGroup) {
        return {
          nameGroup: nextProps.selectedGroup.name,
          name: nextProps.selectedGroup.name,
        };
      }
    }
    return null;
  }

  onEditGroup = () => {
    const data = {
      name: this.state.name,
      group_id: this.props.selectedGroup.id,
      description: "",
    };
    this.props.actions.editGroupUser({ data, callSuccess: this.showSuccess, callFail: this.showErr });
    this.props.close();
  };

  showAlert = () => {
    const { t } = this.props;
    Swal.fire({
      title: `${t("user.noti")}`,
      text: `${t("user.noti_sure")}`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: `${t("user.yes")}`,
      cancelButtonText: `${t("user.cancel")}`,
    }).then((result) => {
      if (result.value) {
        this.onEditGroup();
      }
    })
  }

  showSuccess = () => {
    const { t } = this.props;
    Swal.fire({
      title: `${t("user.noti")}`,
      icon: 'success',
      text: `${t("user.success")}`,
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
    const { show, close, t } = this.props;
    const { errors, nameGroup } = this.state;
    return (
      <Dialog show={show} close={close} innerClass="Popup-edit-group">
        <h3 className="main-lbl text-center">{t("user.edit_group")}</h3>
        <aside className="inner-cont">
          <div>
            <span style={{ fontSize: 18 }}>{t("user.name_group")}</span>
            <Input
              style={{ width: 550, marginLeft: 25 }}
              defaultValue={nameGroup}
              onChange={(e) => {
                this.setState({ name: e.target.value });
              }}
            />
            {errors.nameGroup ? (
              <div className="validation" style={{ marginLeft: 125 }}>
                {errors.nameGroup}
              </div>
            ) : null}
          </div>
        </aside>
        <aside className="acts grp-btns text-right">
          <Button type="s3" style={{ marginRight: 5 }} onClick={close}>
            {t("user.back")}
          </Button>

          <Button
            onClick={this.showAlert}
          >
            {t("user.save")}
          </Button>
        </aside>
      </Dialog>
    );
  }
}
