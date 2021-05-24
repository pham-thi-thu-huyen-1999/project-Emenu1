import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import stringSimilarity from "string-similarity";
import Swal from "../../../utils/sweetalert2";
import GroupTable from "./GroupTable";
import UserTable from "./UserTable";
import PopupAddUser from "./PopupAddUser";
import PopupDeleteGroup from "./PopupDeleteGroup";
import PopupAddGroup from "./PopupAddGroup";
import PopupEditUser from "./PopupEditUser";
import PopupDetailUser from "./PopupDetailUser";
import PopupEditGroup from "./PopupEditGroup";
import PopupChangePassword from "./PopupChangePassword";
import Loading from "../../../components/common/Loading";
import { Dialog, Button } from "../../../components/common/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";



import * as api from "../../../api/groupUser";
// import { findLastKey } from "lodash";

export default class Main extends Component {
  state = {
    tabIndex: 0,
    currentGroup: 0,
    showPopupAddUser: false,
    showPopupDeleteUser: false,
    showPopupEditUser: false,
    showPopupDetailUser: false,
    showPopupDeleteGroup: false,
    showPopupAddGroup: false,
    showPopupEditGroup: false,
    showPopupChangePassword: false,
    searching: "",
    isChange: false,
    filter: [],
    infoGroup: [],
    newRoleList: [],
    selectedUser: {},
    state: false
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps.infoGroup) !== JSON.stringify(prevState.infoGroup)) {
      return {
        infoGroup: nextProps.infoGroup,
        newRoleList: nextProps.infoGroup.map((item) => {
          return { role_id: item.id ? item.id : null };
        }),
      };
    }
    return null;
  }

  next = () => {
    this.slider.slickNext();
  };

  previous = () => {
    this.slider.slickPrev();
  };

  searching = () => {
    const { searching } = this.state;
    const filter = this.props.userList.filter((user) => {
      return (
        user.full_name.normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().indexOf(searching.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()) !== -1
      );
    });
    this.setState({ filter, state: false });
  };

  changeRole = (e, role) => {
    let { newRoleList } = this.state;

    if (e) {
      newRoleList.push({ role_id: role.id });
    } else {
      for (let i = 0; i < newRoleList.length; i++) {
        if (newRoleList[i].role_id === role.id) {
          newRoleList.splice(i, 1);
        }
      }
    }
    this.setState({ isChange: true });
  };

  showAlert = () => {
    const { t } = this.props;
    Swal.fire({
      title: `${t("user.noti")}`,
      text: `${t("user.noti_save")}`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: `${t("user.yes")}`,
      cancelButtonText: `${t("user.cancel")}`,
    }).then((result) => {
      if (result.value) {
        this.onSaveRole();
        this.showOk();
      }
    })
  }
  showOk = () => {
    const { t } = this.props;
    Swal.fire({
      icon: 'success',
      text: `${t("user.success")}`,
      title: `${t("user.noti")}`
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
        title: `${t("user.error")}`,
        text: res.data.error.internal_message
      })
    }
  }

  onSaveRole = () => {
    const { newRoleList, currentGroup } = this.state;
    const { groupUser } = this.props;
    const data = {
      group_user_id: groupUser[currentGroup].id,
      arrRoleId: newRoleList,
    };
    api.updateGroupUserRole({
      data,
      callSuccess: this.showOk,
      callFail: this.showErr
    });
  };

  onSelectedUser = (user) => {
    this.setState({ selectedUser: user })
  }

  onEventChange = () => {
    if (this.state.searching.length !== 0) {
      this.setState({
        state: true
      })
    }
  }

  render() {
    const {
      showPopupAddUser,
      showPopupEditUser,
      showPopupDetailUser,
      showPopupDeleteGroup,
      showPopupEditGroup,
      showPopupChangePassword,
      showPopupAddGroup,
      currentGroup,
      searching,
      filter,
      isChange,
      newRoleList,
      selectedUser
    } = this.state;
    const { ...rest } = this.props;
    const { t, groupUser } = this.props;
    return (
      <>
        <Loading show={this.props.isLoading} />
        <aside id="manage-user-list">
          <div className="popup-box wrap-user-management">
            <div className="btn-title-back-managa e-flex content-center item-center">
              <div className="btn-back">
                <Button className="s3"
                  onClick={() => { this.props.history.push("/menu"); }}>
                  <FontAwesomeIcon icon={faLongArrowAltLeft} />
                  <span className="e-m-left-5">{t("textCommon.back")}</span>
                </Button>
              </div>
              <h3 className="text-center">{t("user.title")}</h3>
            </div>
            <div className="content-user-list">
              <Tabs
                selectedIndex={this.state.tabIndex}
                onSelect={(tabIndex) => this.setState({ tabIndex })}
                style={{ height: "100%" }}
              >
                <TabList className="tab-list">
                  <Tab>{t("user.user")}</Tab>
                  <Tab>{t("user.decentralization")}</Tab>
                </TabList>
                <TabPanel className="content-usertable">
                  <UserTable
                    selectedUser={user =>
                      this.onSelectedUser(user)
                    }
                    changeSearchInput={(e) =>
                      this.setState({ searching: e.target.value, filter: this.props.userList })
                    }
                    showPopupAddUser={() =>
                      this.setState({ showPopupAddUser: true })
                    }
                    showPopupDetailUser={(user) =>
                      this.setState({ selectedUser: user, showPopupDetailUser: true })
                    }
                    showPopupEditUser={(user) =>
                      this.setState({ selectedUser: user, showPopupEditUser: true })
                    }
                    showPopupChangePassword={() =>
                      this.setState({ showPopupChangePassword: true })
                    }
                    searching={searching}
                    onSearching={this.searching}
                    filter={filter}
                    state={this.state.state}
                    userListMain={this.props.userList}
                    onEventChange={this.onEventChange}
                    {...rest}
                  />
                </TabPanel>
                <TabPanel className="content-user-group">
                  <GroupTable
                    {...rest}
                    currentGroup={currentGroup}
                    isChange={isChange}
                    newRoleList={newRoleList}
                    showPopupAddGroup={() =>
                      this.setState({ showPopupAddGroup: true })
                    }
                    changeCurrentGroup={(i) =>
                      this.setState({
                        currentGroup: i,
                        isChange: false,
                      })
                    }
                    showPopupDeleteGroup={() =>
                      this.setState({ showPopupDeleteGroup: true })
                    }
                    showPopupEditGroup={() =>
                      this.setState({ showPopupEditGroup: true })
                    }
                    changeRole={this.changeRole}
                    onSaveRole={this.showAlert}
                  />
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </aside>
        <Dialog
          show={showPopupAddUser}
          close={() => this.setState({ showPopupAddUser: false })}
          innerClass="popup-add-user"
        >
          <PopupAddUser
            hide={() => this.setState({ showPopupAddUser: false })}
            onEventChange={this.onEventChange}
            t={t}
            {...rest}
          />
        </Dialog>
        <Dialog
          show={showPopupEditUser}
          close={() => this.setState({ showPopupEditUser: false })}
          innerClass="popup-add-user"
        >
          <PopupEditUser
            hide={() => this.setState({ showPopupEditUser: false })}
            onEventChange={this.onEventChange}
            selectedUser={selectedUser}
            t={t}
            {...rest}
          />
        </Dialog>
        {showPopupDetailUser ? (
          <PopupDetailUser
            hide={() => this.setState({ showPopupDetailUser: false })}
            selectedUser={selectedUser}
            t={t}
            {...rest}
          />
        ) : null}

        {showPopupDeleteGroup ? (
          <PopupDeleteGroup
            hide={() => this.setState({ showPopupDeleteGroup: false })}
            selectedGroup={groupUser[currentGroup]}
            onDeleteUser={this.onDeleteGroup}
            t={t}
            {...rest}
          />
        ) : null}
        {showPopupAddGroup ? (
          <PopupAddGroup
            hide={() => this.setState({ showPopupAddGroup: false })}
            show={this.state.showPopupAddGroup}
            t={t}
            {...rest}
          />
        ) : null}
        <Dialog
          show={showPopupChangePassword}
          close={() => this.setState({ showPopupChangePassword: false })}
          innerClass="popup-change-pass-user"
        >
          <PopupChangePassword
            hide={() => this.setState({ showPopupChangePassword: false })}
            selectedUser={this.state.selectedUser}
            t={t}
            {...rest}
          />
        </Dialog>

        <PopupEditGroup
          show={showPopupEditGroup}
          selectedGroup={groupUser[currentGroup]}
          close={() => this.setState({ showPopupEditGroup: false })}
          t={t}
          {...rest}
        />
      </>
    );
  }
}
