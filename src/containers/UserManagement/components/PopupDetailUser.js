import React, { Component } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faImage, faSortDown } from "@fortawesome/free-solid-svg-icons";

export default class PopupEditUser extends Component {
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
  handleClick = event => {
    const { target } = event;
    if (this.wrapperRef.current === null) {
      return;
    }
    if (!this.wrapperRef.current.contains(target)) {
      this.props.hide();
    }
  };

  render() {
    const { hide, selectedUser, t } = this.props;
    return (
      <div className="popup mfp-container mfp-s-ready mfp-inline-holder">
        <div className="mfp-content">
          <section
            id="popup-detail-user"
            className="popup-box popup-add-new"
            ref={this.wrapperRef}
          >
            <h3
              className=" text-center"
              style={{ fontSize: 35, color: "#F27B26" }}
            >
              {selectedUser.full_name}
              <div style={{ color: "black", fontSize: 24 }}>
                {selectedUser.group_user_id
                  ? this.props.groupUser.find(
                    group => group.id === selectedUser.group_user_id
                  ) ? this.props.groupUser.find(
                    group => group.id === selectedUser.group_user_id
                  ).name : ""
                  : ""}
              </div>
            </h3>
            <aside className="flex-view">
              <img
                src={
                  selectedUser.avatar
                    ? selectedUser.avatar
                    : require("../images/user.png")
                }
                alt=""
                style={{ height: 190, width: "auto", borderRadius: 10 }}
              />
              <div style={{ flex: 1, marginLeft: 25 }}>
                <div className="it">
                  {t("user.username")}: <span>{selectedUser.username}</span>
                </div>
                <div className="it">
                  {t("user.email")}: <span>{selectedUser.email}</span>
                </div>
                <div className="it">
                  {t("user.phone")}: <span>{selectedUser.phone_number}</span>
                </div>
                <div className="it">
                  {t("user.gender")}:{" "}
                  <span>{selectedUser.gender == null ? "N/A" : (selectedUser.gender === 1? t("user.male") : t("user.female"))}</span>
                </div>
                <div className="it">
                  {t("user.birthday")}: <span>{selectedUser.birthday ? selectedUser.birthday.slice(0, 10) : ""}</span>
                </div>
              </div>
            </aside>
            <aside className="inner clear" style={{ marginTop: 10 }}>
              <div className="it">
                {t("user.address")}: <span>{selectedUser.address1}</span>
              </div>
              <div className="it">
                {t("user.day_create_at")}: <span>{selectedUser.created_at.slice(0, 10)}</span>
              </div>
              {/* <div className="it">
              {t("user.login_recently")}:{" "}
                <span>{selectedUser.updated_at.slice(0, 10)}</span>
              </div> */}
            </aside>
            <aside className="acts grp-btns flex-view middle">
              <div style={{ width: 141 }}></div>
              <div>
                {t("user.status")}:{" "}
                <span style={{ color: selectedUser.status ? "#00BFF3" : "red" }}>
                  {selectedUser.status ? t("user.activ") : t("user.notActiv")}
                </span>
              </div>
              <div className="back-btn cursor-pointer" onClick={hide}>
                <img src="/images/back-btn.png" alt="" />
              </div>
            </aside>
          </section>
        </div>
      </div>
    );
  }
}
