import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSearch,
  faPencilAlt,
  faTimesCircle,
  faCheckCircle,
  faSyncAlt,
  faKey
} from "@fortawesome/free-solid-svg-icons";
import TableData from '../../../components/common/TableData';
import Swal from '../../../../src/utils/sweetalert2';

import { Input, Button, Dialog } from "../../../components/common";
import PopupCreateShift from "./CreateShift/PopupCreateShift";
import moment from "moment";

export default class UserTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indexSlide: 0,
      showPopupCreateShift: false,
      dateNow: new Date(),
      userDetail: {},
      page: this.props.page,
      userList: this.props.userListMain,
    };
  }
  next = () => {
    this.slider.slickNext();
  };

  previous = () => {
    this.slider.slickPrev();
  };

  onChooseItem = (item, i) => {
    this.props.actions.getAccountInfoStaff({ id: (item.id ? item.id : item.staff_id), callback: this.props.selectedUser });
  }

  createShift = (user) => {
    const overtime_at = moment(this.state.date).format("DD-MM-YYYY")
    this.props.actions.getListOverShift({
      user_id: user.id, params: {
        overtime_at
      }
    });
    this.props.actions.getListWeekdayShift({
      user_id: user.id,
      callBack: this.setState({ showPopupCreateShift: true, userDetail: user })
    });
  }

  loadMore = () => {
    const { page, indexUser } = this.props;
    if (page !== 0) {
      this.props.actions.getUserList({ index: indexUser })
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps.userListMain) !== JSON.stringify(prevState.userList)
      || nextProps.page !== prevState.page
    ) {
      return {
        userList: nextProps.userListMain,
        page: nextProps.page
      }
    }
    return null;
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
        title: `${t("user.noti")}`,
        icon: 'error',
        text: res.data.error.internal_message
      })
    }
  }

  showConfirmDeleteUser = (user) => {
    const { t } = this.props;
    Swal.fire({
      title: `${t("user.noti")}`,
      text: `${t("user.popupdeluser")}`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: `${t("user.yes")}`,
      cancelButtonText: `${t("user.cancel")}`,
    }).then((result) => {
      if (result.value) {
        this.props.actions.deleteUser({
          data: {
            user_id: user.id,
            status: 0,
          },
          callSuccess: this.showSuccess,
          callFail: this.showErr
        });
      }
    })
  }
  showConfirmRestoreUser = (user) => {
    const { t } = this.props;
    Swal.fire({
      title: `${t("user.noti")}`,
      text: `${t("user.popupRestoreuser")}`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: `${t("user.yes")}`,
      cancelButtonText: `${t("user.cancel")}`,
    }).then((result) => {
      if (result.value) {
        this.props.actions.deleteUser({
          data: {
            user_id: user.id,
            status: 1,
          },
          callSuccess: this.showSuccess,
          callFail: this.showErr
        });
      }
    })

  }
  onDeleteUser = user => {
    if (user.status) {
      this.showConfirmDeleteUser(user);
    } else {
      this.showConfirmRestoreUser(user);
    }
    this.props.onEventChange();
  }

  componentDidMount() {
    this.props.actions.getListShift();
    this.props.actions.getListDay();
  }
  render() {

    const { t, groupUser } = this.props;

    const TABLE_SETTING = {
      heads: [
        {
          width: "5%",
          text: t("user.no"),
        },
        {
          width: "15%",
          text: t("user.image"),
        },
        {
          width: "38%",
          text: t("user.name"),
        },
        {
          width: "15%",
          text: t("user.phone"),
        },
        {
          width: "15%",
          text: t("user.status"),
        },
        {
          width: "28%",
          text: t("user.group"),
        },
      ],
      columns: [
        {
          key: "id",
          width: "5%",
          render: (item, index) => {
            return index + 1;
          },
        },
        {
          key: "avatar",
          width: "15%",
          render: (item, index) => {
            return (
              <img
                src={item.user_type === 3 ? require("../../../images/avatar.png")
                  : item.avatar
                    ? item.avatar
                    : require("../../../images/avatar.png")
                }
                alt=""
                style={{
                  maxWidth: 50,
                  borderRadius: "50%",
                  marginBottom: -8,
                }}
              ></img>
            )
          },
        },
        {
          key: "name",
          width: "38%",
          render: (item, i) => {
            return <div className="name" onClick={() => { this.onChooseItem({ ...item, i }); showPopupDetailUser({ ...item }) }}>
              {item.full_name}
            </div>

          },

        },
        {
          key: "phone_number",
          width: "15%",
        },
        {
          key: "status",
          width: "15%",
          render: (item, index) => {

            return <div>
              {item.status ? (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  color="#00BFF3"
                  style={{
                    fontSize: 30,
                    verticalAlign: "middle",
                  }}
                />
              ) : (
                  <FontAwesomeIcon
                    icon={faTimesCircle}
                    color="red"
                    style={{
                      fontSize: 30,
                      verticalAlign: "middle",
                    }}
                  />
                )}
            </div>

          },
        },
        {
          key: "group",
          width: "28%",
          render: (item, i) => {
            return <div>
              {groupUser.find(
                (group) => group.id === item.group_user_id
              )
                ? groupUser.find(
                  (group) => group.id === item.group_user_id
                ).name
                : "Không"}
            </div>
          },
        },
        {
          key: "acts",
          width: "",
          actions: [(item, i) => (
            <>
              {item.status ? (
                <div className="grp-btns flex-view middle e-m-right-5">
                  <Button type="s1" className="e-m-left-5" onClick={() => { this.onChooseItem({ ...item, i }); showPopupChangePassword() }}>
                    <FontAwesomeIcon icon={faKey} />{" "}
                    {t("user.change_password")}
                  </Button>
                  {
                    this.props.infoPar.contract_type_id === 1 ? "" :
                      <Button onClick={() => {
                        this.createShift(item)
                      }}
                        className="btn-create-shift e-flex item-center e-m-left-5"
                      >
                        <span className="icon-create-shift">
                          <img src="/images/tao-ca.png" /></span>
                        <span>{t("user.createShift.createShift")}</span>
                      </Button>
                  }
                  <Button className="e-m-left-5" type="s1" onClick={() => { this.onChooseItem({ ...item, i }); showPopupEditUser() }}>
                    <FontAwesomeIcon icon={faPencilAlt} />{" "}
                    {t("user.edit")}
                  </Button>
                  <Button type="s2" className="e-m-left-5" onClick={() => this.onDeleteUser(item)}>
                    <FontAwesomeIcon icon={faTimesCircle} />{" "}
                    {t("user.delete")}
                  </Button>
                </div>
              ) : (
                  <div className="grp-btns flex-view middle e-m-right-5">
                    <Button onClick={() => this.onDeleteUser(item)}>
                      <FontAwesomeIcon icon={faSyncAlt} /> {t("user.restore")}
                    </Button>
                  </div>
                )}
            </>
          )],
        },
      ],
    };

    const { showPopupCreateShift, userList } = this.state;
    const {
      searching,
      filter,
      changeSearchInput,
      onSearching,
      showPopupAddUser,
      showPopupEditUser,
      showPopupChangePassword,
      showPopupDetailUser,
    } = this.props;
    const { ...rest } = this.props;
    const userListCurrent = searching.length !== 0 && this.props.state === false ? filter : userList;
    return (
      <>
        <aside className="top-acts flex-view middle search-add-btn">
          <div className="flex-view search-btn-search">
            <Input
              placeholder={t("user.searchuser")}
              onChange={(e) => {
                changeSearchInput(e);
              }}
              className="e-m-right-10"
            />
            <Button onClick={onSearching}>
              {t("user.search")}{" "}
              <FontAwesomeIcon
                icon={faSearch}
                style={{
                  fontSize: 20,
                  verticalAlign: "middle",
                }}
              />
            </Button>
          </div>
          <div className="btn-add e-flex content-end item-center">
            <Button onClick={showPopupAddUser}>
              <FontAwesomeIcon
                icon={faUser}
                style={{ fontSize: 20, verticalAlign: "middle" }}
              />{" "}
              {t("user.add")}
            </Button>
          </div>
        </aside>
        <div className="list-tbl-data-users">
          <TableData
            option={TABLE_SETTING}
            dataSources={userListCurrent}
            className="UserTable"
            onMore={this.loadMore}
            textNotiNoData={t("promotions.textNotiNoData")}
          >
          </TableData>
        </div>
        <Dialog
          show={showPopupCreateShift}
          close={() => this.setState({ showPopupCreateShift: false })}>
          <PopupCreateShift
            userDetail={this.state.userDetail}
            hide={() => this.setState({ showPopupCreateShift: false })}
            {...rest}
          />
        </Dialog>
        {/* <Dialog
          show={showPopupCreateShift}
          close={() => this.setState({ showPopupCreateShift: false })}>
          <PopupCreateShift
            userDetail={this.state.userDetail}
            hide={() => this.setState({ showPopupCreateShift: false })}
            {...rest}
          />
        </Dialog> */}
        {/* </aside> */}
      </>
    );
  }
}
