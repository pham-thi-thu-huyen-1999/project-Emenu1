import React, { Component } from 'react';
import Styles from '../../scss/TableList.module.scss';
import GridLayout from 'react-grid-layout';
import _ from 'lodash';
import TABLE_CONST from '../TableContants';
import * as actions from "../../actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux"
import { TableListReducerName } from "../../reducers";
import { AreaReducerName } from "../../../AreaManagement/reducers";
import VipIconSource from "../../../../images/tbl-type.png";
import VipTableGrid from "./VipTableGrid";
import Swal from "../../../../utils/sweetalert2";
import { TEMP_CONTRACT } from "../../../../consts/settings/partnerContract"
import { Button } from "../../../../components/common";
import { STATUS_ACTION_CONFIRM, STATUS_ACTION_CANCEL, TYPE_NOTI, STATUS_CONFIRM } from "../../../../consts/settings/notification";
import { remove } from "../../../../services/localStorage";
class TableGridContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentItemResize: {},
      tableLayoutData: [],
      subIconLayoutdata: [],
      vipTableLayoutData: [],
      // tableIdSelectdNoti: null,
      // showNotiList: false,
    };
    this.areaWrapper = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { newWidth, listTable, selectedInUseTable, listSubIcon, listVipTable } = this.props;
    if (prevProps.newWidth !== newWidth) {
      this.areaWrapper.current.style.width = newWidth + "px";
    }
    if (prevProps.listTable !== listTable) {
      this.generateTableLayoutData(listTable);
    }
    if (prevProps.listSubIcon !== listSubIcon) {
      this.generateSubIconLayoutData(listSubIcon);
    }
    if (prevProps.listVipTable !== listVipTable) {
      this.generateVipTableLayoutData(listVipTable)
    }
    if (prevProps.selectedInUseTable !== selectedInUseTable) {
      this.props.tableActions.getTableOrders({
        table_id: selectedInUseTable ? selectedInUseTable.id : null,
      });
    }
  }

  /**
   * Generate table layout data
   */
  generateTableLayoutData = (listTable) => {
    let { resolutionRatio } = this.props;
    if (_.isEmpty(resolutionRatio)) {
      resolutionRatio = 1;
    }
    let tableLayoutData = [];
    if (!_.isEmpty(listTable)) {
      listTable.map((table_info) => {
        if (table_info) {
          return tableLayoutData.push({
            i: table_info.table_id,
            h: table_info.height * resolutionRatio,
            w: table_info.width * resolutionRatio,
            x: table_info.point_x,
            y: table_info.point_y,
            static: true
          });
        } else {
          return null;
        }
      });
    }
    this.setState({
      tableLayoutData: tableLayoutData,
    });
  };

  /**
   * Generate table layout data
   */
  generateSubIconLayoutData = (subIcons) => {
    let { resolutionRatio } = this.props;
    if (_.isEmpty(resolutionRatio)) {
      resolutionRatio = 1;
    }
    let subIconLayoutData = [];
    if (!_.isEmpty(subIcons)) {
      subIcons.map((icon) => {
        return subIconLayoutData.push({
          i: icon.id,
          h: icon.height * resolutionRatio,
          w: icon.width * resolutionRatio,
          x: icon.point_x,
          y: icon.point_y,
          static: true,
        });
      });
    }
    this.setState({
      subIconLayoutdata: subIconLayoutData,
    });
  };
  /**
     * Generate Vip table layout data
     */
  generateVipTableLayoutData = (vipTable) => {
    let { resolutionRatio } = this.props;
    if (_.isEmpty(resolutionRatio)) {
      resolutionRatio = 1;
    }
    let vipTableLayoutData = [];
    if (!_.isEmpty(vipTable)) {
      vipTable.map((vipTable) => {
        return vipTableLayoutData.push({
          i: vipTable.id,
          h: vipTable.height * resolutionRatio,
          w: vipTable.width * resolutionRatio,
          x: vipTable.point_x,
          y: vipTable.point_y,
          static: true,
        });
      });
    }
    this.setState({
      vipTableLayoutData: vipTableLayoutData,
    });
  };





  /**
   * Handle choose table
   */
  handleChooseTable = (table) => {
    const { trans, partner_Info, selectedArea } = this.props;
    const area_id = selectedArea.id;
    remove("table-number");
    remove("table-id");
    remove("check-table");
    remove("quantity-combo");
    remove("order-id");
    remove("is-list");
    remove("check-sign-up-combo");
    remove("ordered-no-price");
    remove("is-price");
    remove("is-list");
    remove("vi-tri-combo");
    if (this.props.isCombineTableModeOn) {
      if (!table.is_table_join) {
        if (table.status === TABLE_CONST.TABLE_STATUS_EMPTY) {
          if (_.isEmpty(this.props.selectedFeature) || this.props.selectedFeature === "ADD_TABLE") {
            if (this.isCombinedTable(table.id)) {
              this.props.tableActions.removeCombineTable({ tableId: table.id });
            } else {
              this.props.tableActions.addCombineTable({ table: table });
            }
          }
          if (this.props.selectedFeature === "CHANGE_TABLE") {
            if (this.isCombinedTable(table.id)) {
              this.props.tableActions.removeCombineTable({ tableId: table.id });
            } else {
              if (_.isEmpty(this.props.combineTable)) {
                this.props.tableActions.addCombineTable({ table: table });
              }
            }
          }
        }
        if (
          table.status === TABLE_CONST.TABLE_STATUS_IN_USE &&
          this.props.selectedFeature === "COMBINE_TABLE" &&
          this.props.selectedInUseTable.id !== table.id
        ) {
          if (this.isCombinedTable(table.id)) {
            this.props.tableActions.removeCombineTable({ tableId: table.id });
          } else {
            this.props.tableActions.addCombineTable({ table: table });
          }
        }
      }
    } else {
      if (partner_Info.contract_type_id === TEMP_CONTRACT) {
        if (table.status === TABLE_CONST.TABLE_STATUS_IN_USE) {
          Swal.fire({
            title: `${trans("categoryDish.swalTitle")}!`,
            text: `${trans("table_list:modal_swal.confirm_change_table_status_empty")}?`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: trans("categoryDish.swalAgree"),
            cancelButtonText: trans("categoryDish.swalCancel"),
          }).then((result) => {
            if (result.value) {
              this.props.tableActions.updateStatusTable({
                status: 1, table_id: table.id, area_id,
                updateStatusTblEmptySuccess: this.showupdateStatusTblEmptySuccess,
                updateStatusTblEmptyFail: this.showupdateStatusTblEmptyFail
              })
            }
            this.props.tableActions.selectInUseTable({ table: table });
          })
        } else {
          Swal.fire({
            title: `${trans("categoryDish.swalTitle")}!`,
            text: `${trans("table_list:modal_swal.confirm_change_table_status_used")}?`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: trans("categoryDish.swalAgree"),
            cancelButtonText: trans("categoryDish.swalCancel"),
          }).then((result) => {
            if (result.value) {
              this.props.tableActions.updateStatusTable({
                status: 0, table_id: table.id,
                area_id,
                updateStatusTblEmptySuccess: this.showupdateStatusTblEmptySuccess,
                updateStatusTblEmptyFail: this.showupdateStatusTblEmptyFail
              })
            }
            this.props.tableActions.selectQRCodeTable({ table: table });
          })
        }
        this.props.tableActions.getCombinedTable({ table_id: table.id })
      }
      else {
        if (table.status === TABLE_CONST.TABLE_STATUS_IN_USE) {
          this.props.tableActions.selectInUseTable({ table: table });
        } else {
          this.props.tableActions.selectQRCodeTable({ table: table });
        }
        this.props.tableActions.getCombinedTable({ table_id: table.id })
      }
      this.props.tableActions.getCombinedTable({ table_id: table.id })
    }
  };

  /**
   * Check if table in combine table list
   */
  isCombinedTable = (tableId) => {
    let isCombined = false;
    if (this.props.combineTable && !_.isEmpty(this.props.combineTable)) {
      for (let i = 0; i < this.props.combineTable.length; i++) {
        if (this.props.combineTable[i].id === tableId) {
          isCombined = true;
          break;
        }
      }
    }
    return isCombined;
  };

  /**
   * Get table icon
   */
  getBackgroundImage = (table) => {
    let tableStatusColor = "gray";
    let iconName = "";
    let fileType = ".svg";
    if (table.status === TABLE_CONST.TABLE_STATUS_IN_USE) {
      tableStatusColor = "blue";
    }
    if (table.image) {
      let tableIconSplit = table.image.split("/");
      iconName = tableIconSplit[tableIconSplit.length - 1];
      if (iconName.includes(".svg")) {
        iconName = iconName.slice(0, -4);
      }

      let iconNameSplit = iconName.split('_')
      iconNameSplit[1] = tableStatusColor
      tableIconSplit[tableIconSplit.length - 1] = iconNameSplit.join('_') + fileType;
      return `url(${tableIconSplit.join('/')})`
    }
  };

  getNotiforTable = (tableId) => {
    const notiElementHeader = document.querySelector("#header__noti-icon");
    if (notiElementHeader) {
      notiElementHeader.click();
    }
    this.props.tableActions.removeNotiForTable(tableId);
  }

  /**
  * Render icon khi bàn có noti
  */
  renderIconNoti = (actionOfNoti, tableId) => {

    let url = require("./../../../../images/NotiTableIcon/nottifications.png");
    switch (actionOfNoti) {
      case TABLE_CONST.NOTI_ACTION_CALL_STAFF:
        url = require("./../../../../images/NotiTableIcon/call-staff.png")
        break;
      case TABLE_CONST.NOTI_ACTION_CALL_PAYMENT:
        url = require("./../../../../images/NotiTableIcon/call-payment.png")
        break;
    }

    return (
      <div id="icon-noti-table-list" className={Styles["noti-icon"]} onClick={(event) => {
        event.stopPropagation();
        this.getNotiforTable(tableId)

      }}>
        <img src={url} style={{ width: "30px" }} alt="" />
      </div>
    )
  };

  /**
   * Render tables
   */
  renderTables = () => {
    return this.props.listTable.map((table_info) => {
      let quaOrderIsPayment = 0;
      if (table_info.table.orders.length > 0) {
        table_info.table.orders.map(orderItem => {
          if (orderItem.order_status.id === 2) {
            quaOrderIsPayment = quaOrderIsPayment + 1;
          }
          return quaOrderIsPayment
        });
      }
      return (
        <div
          className={`${Styles["table-base"]} ${this.isCombinedTable(table_info.table_id) ? Styles["is-combined"] : ""
            }`}
          key={table_info.table_id}
          onClick={this.handleChooseTable.bind(this, table_info.table)}
          style={{ backgroundImage: this.getBackgroundImage(table_info.table) }}
        >
          <span className={`${Styles["lable-paid"]}`}>
            {table_info.table.orders.length === quaOrderIsPayment && table_info.table.status !== 0 ? "Đã thanh toán" : ""}</span>
          Bàn {table_info.table.name}
          <br />
          {`${table_info.table.seat_number} ${this.props.trans("table_list:chair")}`}
          {TABLE_CONST.TABLE_TYPE_VALUE.VIP === table_info.table.table_type_id ? (
            <div className={Styles["vip"]}>
              <img src={VipIconSource} style={{ width: "30px" }} alt="" />
            </div>
          ) : null}
          {this.props.iconNotiTalbe[`${table_info.table_id}`] ? this.renderIconNoti(this.props.iconNotiTalbe[table_info.table_id], table_info.table_id) : null}
          {/* {this.props.notiListForTable && this.props.notiListForTable.length > 0 && table_info.table_id === this.state.tableIdSelectdNoti ? this.renderListNoTiForTable() : null} */}
          {table_info.table.is_table_join ? (
            <span
              className={`icon-users ${Styles["icon-users-custom"]}`}
            ></span>
          ) : null}
        </div>
      );
    });
  };
  /**
     * Render list sub icon
     */
  renderVipTables = () => {
    let { ...rest } = this.props
    return this.props.listVipTable.map((vipTable, index) => {
      return (
        <div
          className={Styles["sub-icon-base"]}
          key={vipTable.id}
        >
          <div className={Styles["e-name-room"]}>
            <div className={Styles["name-wrapper"]}>
              <span>{vipTable.name ? vipTable.name : "Phòng VIP"}</span>
            </div>
          </div>
          <VipTableGrid
            width={(this.props.newWidth / (100 * this.props.areaRatio)) * vipTable.width - 10}
            height={(this.props.newHeight / 100) * vipTable.height - 10}
            isCombinedTable={this.isCombinedTable}
            handleChooseTable={this.handleChooseTable}
            getBackgroundImage={this.getBackgroundImage}
            currentVipRoom={vipTable}
            {...rest}
          />
        </div>
      );
    })
  }


  /**
   * Render list sub icon
   */
  renderListSubIcon = () => {
    return this.props.listSubIcon.map((subIcon) => {
      return (
        <div
          className={Styles["sub-icon-base"]}
          key={subIcon.id}
          style={{ backgroundImage: `url(${subIcon.icon})` }}
        ></div>
      );
    });
  };

  render() {
    return (
      <GridLayout
        layout={this.state.tableLayoutData.concat(this.state.subIconLayoutdata, this.state.vipTableLayoutData)}
        width={this.props.newWidth}
        className={Styles["layout-custom"]}
        autoSize={true}
        rowHeight={this.props.newHeight / 100}
        cols={100 * this.props.areaRatio}
        maxRows={100}
        containerPadding={[0, 0]}
        margin={[0, 0]}
        isDraggable={true}
        isResizable={true}
        compactType={null}
        useCSSTransforms={true}
        preventCollision={true}
        style={{minHeight: this.props.newHeight }}
        innerRef={this.areaWrapper}
      >
        {this.renderTables()}
        {this.renderListSubIcon()}
        {this.renderVipTables()}
      </GridLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state[TableListReducerName],
    ...state[AreaReducerName],
  }
}
const mapDispatchToProps = dispatch => {
  return {
    tableActions: bindActionCreators({ ...actions }, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableGridContainer);