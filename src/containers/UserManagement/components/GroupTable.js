import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimesCircle,
  faUsers,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import TableData from '../../../components/common/TableData';
import {
  Input,
  Button,
  CheckBox,
  PopupConfirm,
} from "../../../components/common";
import Swal from '../../../../src/utils/sweetalert2';

export default class GroupTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indexSlide: 0,
      showPopupConfirm: false,
      valSearch: "",
      index_group_checked: 0,
      infoGroup: this.props.infoGroup
    };
  }
  next = () => {
    this.slider.slickNext();
  };

  previous = () => {
    this.slider.slickPrev();
  };

  handleClickOk = selectedGroup => {
    const { actions } = this.props;
    const data = { group_id: selectedGroup.id };
    actions.deleteGroupUser({
      data,
      callSuccess: this.showSuccess,
      callFail: this.showErr
    });
  };
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
  showDeleteGroupUser = groupUser => {
    const { t } = this.props;
    Swal.fire({
      title: t("user.noti"),
      text: t("user.noti_sure"),
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: t("user.yes"),
      cancelButtonText: t("user.cancel"),
    }).then((result) => {
      if (result.value) {
        this.handleClickOk(groupUser);
      }
    })
  }

  componentDidMount() {
    this.props.actions.getRoleById({
      data: { group_id: this.props.groupUser[0].id }
    });
  }
  render() {
    const {
      currentGroup,
      isChange,
      showPopupAddGroup,
      changeCurrentGroup,
      showPopupEditGroup,
      changeRole,
      onSaveRole,
      t,
      groupUser,
      newRoleList
    } = this.props;
    const { showPopupConfirm, valSearch,
    } = this.state;
    const TABLE_SETTING = {
      heads: [
        {
          width: "10%",
          text: t("user.no"),
        },
        {
          width: "90%",
          text: t("user.nameGroup"),
        },
      ],
      columns: [
        {
          key: "id",
          width: "10%",
          render: (item, i) => {
            return <div
              key={i}
              onClick={() => {
                if (currentGroup === i) return;
                const data = { group_id: item.id };
                this.props.actions.getRoleById({ data });
                changeCurrentGroup(i);
                this.setState({
                  index_group_checked: i
                });
              }}
            >
              {i + 1}
            </div>
          },
        },
        {
          key: "name",
          width: "90%",
          render: (item, i) => {
            return <div
              key={i}
              onClick={() => {
                if (currentGroup === i) return;
                const data = { group_id: item.id };
                this.props.actions.getRoleById({ data });
                changeCurrentGroup(i);
                this.setState({
                  index_group_checked: i
                });
              }}
            >
              {item.name}
            </div>
          },
        },
        {
          key: "acts",
          width: "",
          actions: [(item, i) => (
            <>
              <div
                className="s-btn s1 edit-btn"
                style={{ marginRight: 10 }}
                onClick={showPopupEditGroup}
              >
                <FontAwesomeIcon icon={faPencilAlt} className="e-m-right-5" />
                {t("user.edit")}
              </div>
              <div
                className="s-btn s2 delete-btn"
                onClick={() => this.showDeleteGroupUser(item)}
              >
                <FontAwesomeIcon icon={faTimesCircle} className="e-m-right-5" />
                {t("user.delete")}
              </div>
            </>
          )],
        },
      ],
    };
    return (
      <>
        <aside className="top-acts flex-view middle" style={{ marginTop: 15 }}>
          <div className="searchgr-btn-add">
            <Input
              className="input-search-gr"
              placeholder={t("user.searchgroup")}
              onChange={(e) => {
                this.setState({ valSearch: e.target.value });
              }}
            />
            <Button onClick={showPopupAddGroup} style={{ marginBottom: "-20px" }}>
              <FontAwesomeIcon
                icon={faUsers}
                style={{
                  fontSize: 20,
                  verticalAlign: "middle",
                }}
              />{" "}
              {t("user.add")}{" "}
            </Button>
          </div>
        </aside>
        <div className="e-col-12 e-row" style={{ height: "100%" }}>
          <div className="e-col-6" style={{ height: "calc(100% - 70px)" }}>
            <TableData
              option={TABLE_SETTING}
              dataSources={
                valSearch ?
                  groupUser.filter((group) => {
                    return (
                      group.name.normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().indexOf(valSearch.normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()) !== -1
                    );
                  })
                  : groupUser
              }
              className="GroupTable"
              textNotiNoData={t("promotions.textNotiNoData")}
              innerClass="tr-td-table-data-user-management"
              group_selected={this.state.index_group_checked}
            >
            </TableData>
          </div>
          <div className="e-col-6 content-func">
            <div className="tbl-group-list set-scrolling-tbl">
              <span className="acts">
                {t("user.feature")}
              </span>
            </div>
            <div className="content-tblgroup">
              {groupUser.length && currentGroup < groupUser.length ? (
                <div className="feature">
                  <div className="name-func">
                    {groupUser[currentGroup].name}
                  </div>
                  <div className="list-managa-func">

                    {this.props.roleList.map((role, i) => {
                      let x = false;
                      for (let i = 0; i < newRoleList.length; i++) {
                        if (newRoleList[i].role_id === role.id) {
                          x = true;
                        }
                      }
                      return (
                        <div key={i} className="role-item">
                          <CheckBox
                            name={role.name + role.id}
                            label={role.name}
                            checked={x}
                            onChange={(e) => {
                              changeRole(e, role);
                            }}
                          />
                          <br />
                        </div>
                      );
                    })}
                  </div>
                  <div className="btn-save-role e-flex item-center content-end e-m-right-5">
                    {isChange ? (
                      <Button
                        onClick={onSaveRole}
                      >
                        {t("user.save")}
                      </Button>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <PopupConfirm
          t={t}
          show={showPopupConfirm}
          close={() => this.setState({ showPopupConfirm: false })}
          content={t("user.confirm_change_role")}
          confirm={() => {
            onSaveRole();
          }}
        />
      </>
    );
  }
}
