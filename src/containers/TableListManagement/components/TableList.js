import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTimesCircle, faCopy
} from "@fortawesome/free-solid-svg-icons";
import { Button, TableData } from "../../../components/common";
import Swal from "../../../utils/sweetalert2";
import { LANGUAGES } from "../../../consts/constants";
import * as CONSTS from "./../constants";

export default class TableList extends Component {
  state = {
    inFoTable: null,
    page: this.props.page,
    tableList: this.props.tableList,
    current: 1
  };



  /**
   * Show popup edit
   */
  handleClickEditTable = (table, isEdit) => {
    this.props.onEdit(table, isEdit);
  };


  /**
   * Show popup delete talbe
   */
  handleClickDeleteTable = (table) => {
    this.setState({
      showPopupDeletetbl: true,
      inFoTable: table,
    });
  };

  /**
   * Delete table
   */
  onDeleteTable = (table) => {
    const { t, searchByArea, searchByName } = this.props
    Swal.fire({
      icon: "warning",
      title: `${t("tableManagament.notification")}`,
      text: `${t("tableManagament.popupDelete")}`,
      showCancelButton: true,
      confirmButtonText: `${t("tableManagament.agree")}`,
      cancelButtonText: `${t("tableManagament.cancel")}`,
    }).then((result) => {
      if (result.value) {
        this.props.actions.deleteTable({ table_id: table.id, searchByArea, searchByName, deleteSuccess: this.deleteSuccess });
      }
    });
  };

  /**
   * Delete table success
   */
  deleteSuccess = () => {
    const { t } = this.props
    Swal.fire({
      icon: "success",
      title: `${t("tableManagament.deleteSuccess")}!`,
      showConfirmButton: true
    });
  }

  loadMore = (data) => {
    const { page } = this.state;
    const { limitPage, isSearching } = this.props
    if (isSearching) {
      if (page <= limitPage) {
        const { searchByName, searchByArea } = this.props;
        this.props.actions.searchTable({
          searchByName,
          searchByArea,
          page: page,
          limit: CONSTS.LIMIT
        });
      }
    } else {
      if (page <= limitPage) {
        this.props.actions.getTableList({ page: page, limit: CONSTS.LIMIT })
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps.tableList) !== JSON.stringify(prevState.tableList)
      || nextProps.page !== prevState.page
    ) {
      return {
        tableList: nextProps.tableList,
        page: nextProps.page
      }
    }
    return null;
  }


  render() {

    const { t } = this.props;
    const { tableList } = this.state;
    const TABLE_SETTING = {
      heads: [
        {
          text: t("tableManagament.no"),
          width: "5%",
        },
        {
          text: t("tableManagament.tableImage"),
          width: "15%",
        },
        {
          text: t("tableManagament.tableName"),
          width: "20%",
        },
        {
          text: t("tableManagament.tblType"),
          width: "10%",
        },
        {
          text: t("tableManagament.quantityChair"),
          width: "15%",
        },
        {
          text: t("tableManagament.area"),
          width: "15%",
        },
        {
          text: t("tableManagament.status"),
          width: "15%",
        },
      ],
      columns: [
        {
          key: "id",
          width: "5%",
          className: "no",
          render: (item, index) => {
            return index + 1;
          },
        },
        {
          key: "image",
          width: "15%",
          className: "image",
          render: (item, index) => {
            return item.image ? (
              <img
                key={index}
                className="image-icon-table"
                src={item.image}
                alt="link not found"
              />
            ) : (
                <img
                  key={index}
                  className="image-icon-table"
                  src={require("./../../../images/omenu_logo.png")}
                  alt="link not found"
                />
              );
          },
        },
        {
          key: "name",
          width: "20%",
          className: "name",
        },
        {
          key: "table_type",
          width: "10%",
          className: "type",
          render: (item, index) => {

            if (item.table_type !== undefined) {
              if (t("currentLang") === LANGUAGES.vietnam) {
                return item.table_type.name_vn
              } else if (t("currentLang") === LANGUAGES.english) {
                return item.table_type.name_en
              } else {
                return (item.table_type.name_jp)
              }
            }

          }
        },
        {
          key: "seat_number",
          width: "15%",
          className: "quantity-chair",
        },
        {
          key: "area_name",
          width: "15%",
          className: "area",
          render: (item, index) => {
            return item.area ? item.area.name : ''
          }
        },
        {
          key: "is_active",
          width: "15%",
          className: "status",
          render: (item, index) => {
            return item.is_active ? `${t("tableManagament.use")}` : `${t("tableManagament.notUse")}`
          },
          actions: [
            (table) => (
              <Button
                className="height-width-btn e-m-right-5"
                type="s1"
                onClick={(e) => this.handleClickEditTable(table, true)}
              >
                <div className="margin-bottom-20"><FontAwesomeIcon icon={faPencilAlt} /> <span>{t("tableManagament.edit")}</span></div>
              </Button>
            ),
            (table) => (
              <Button
                className="height-width-btn e-m-right-5"
                type="s2"
                onClick={(e) => this.onDeleteTable(table)}
              >
                <div className="margin-bottom-20"><FontAwesomeIcon icon={faTimesCircle} />
                <span style={{ marginLeft: "5px" }}>{t("tableManagament.delete")}</span></div>
              </Button>
            ),
            (table) => (
              <Button
                className="height-width-btn e-m-right-5"
                type="s4"
                onClick={(e) => this.handleClickEditTable(table, false)}
              >
                <div className="margin-bottom-20">
                <FontAwesomeIcon icon={faCopy} />
                  <span style={{ marginLeft: "5px" }}>{t("tableManagament.copy")}</span></div>
              </Button>
            ),
          ],
        },
      ],
    };
    return (
      <aside className={`content-table-list set-scrolling-tbl grey70 ${tableList && tableList.length !== 0 ? "table-list" : ""}`}>
        <TableData
          option={TABLE_SETTING}
          dataSources={tableList}
          onMore={this.loadMore}
          textNotiNoData={`${t("tableManagament.noData")}`}
        ></TableData>
      </aside>
    );
  }
}
