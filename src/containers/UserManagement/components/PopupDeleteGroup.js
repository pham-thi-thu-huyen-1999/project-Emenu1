import React, { Component } from "react";
import Swal from '../../../../src/utils/sweetalert2';
import Button from "../../../components/common/Button";
export default class PopupDeleteUser extends Component {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
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

  handleClickOk = () => {
    const { hide, selectedGroup, actions } = this.props;
    const data = { group_id: selectedGroup.id };
    actions.deleteGroupUser({ data, callSuccess: this.showSuccess, callFail: this.showErr });
    hide();
  };

  showAlert = () => {
    const {t} = this.props;
    Swal.fire({
      title: t("user.noti"),
      text: t("user.noti_sure"),
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: t("user.yes"),
      cancelButtonText: t("user.cancel"),
    }).then((result) => {
      if (result.value) {
        this.handleClickOk();
      }
    })
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
    const { hide, selectedGroup, t } = this.props;

    return (
      <div className="popup">
        <div
          id="popup-delete-user"
          className="popup-box medium-size left-close-btn text-center"
          ref={this.wrapperRef}
          style={{ top: "25%" }}
        >
          <h3 className="main-tit">{t("user.delete_group")}</h3>
          <h4 className="">{`"${selectedGroup.name}"`}</h4>
          <aside className="msgbox grp-btns">
            {/* <div
              className="main-btn s2 close-popup-btn"
              onClick={hide}
              style={{ marginRight: 5 }}
            >
              {t("user.cancel")}
            </div>
            <div className="main-btn" onClick={this.showAlert}>
              OK
            </div> */}
                <Button type="s3" style={{ marginRight: 5 }} onClick={() => { this.props.hide() }}>
                {t("user.back")}
                </Button>

                <Button
                  onClick={this.showAlert}
                >
                  {t("user.save")}
                </Button>
          </aside>
        </div>
      </div>
    );
  }
}
