import React, { Component } from "react";
import Styles from "../../scss/TableList.module.scss";
import _ from 'lodash';
import * as actions from "../../actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux"
import { TableListReducerName } from "../../reducers";
import Swal from "../../../../utils/sweetalert2";
import TABLE_CONST from "../TableContants";
import VipIconSource from "../../../../images/tbl-type.png";

class CombineTablePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedArea: null,
    };
  }
  /**
   * On remove combined table
   */
  onRemoveCombineTable = (table) => {
    this.props.tableActions.removeCombineTable({ tableId: table.id });
  };
  /**
   * Render combined table list
   */
  randerCombinedTable = () => {
    const { combineTable } = this.props;
    if (combineTable) {
      return combineTable.map((table) => {
        return (
          <div
            onClick={this.onRemoveCombineTable.bind(this, table)}
            key={table.id}
            className={Styles["table-item"]}
          >
            <div className={Styles["table-info"]}>
              {table.name}
              <br />
              {`${table.seat_number} ${this.props.trans("table_list:chair")}`}
              {TABLE_CONST.TABLE_TYPE_VALUE.VIP === table.table_type_id ? (
                <div className={Styles["vip"]} style={{position: 'absolute', top: '20px', left: '25px'}}>
                  <img src={VipIconSource} style={{width: '30px'}} alt="" />
                </div>
              ) : null}
              {TABLE_CONST.TABLE_JOINED === table.is_table_join ? (
                <span
                  className={`icon-users ${Styles["icon-users-custom"]}`}
                ></span>
              ) : null}
            </div>
            <img style={{minWidth: '130px'}} src={this.getBackgroundImage(table)} alt={table.id} />
          </div>
        );
      });
    }
    return null;
  };
  /**
   * On combine cancel
   */
  onCloseCombinePanel = () => {
    this.props.tableActions.removeCombineTable({ table_id: null });
    if (this.props.selectedFeature) {
      this.props.tableActions.deselectInUseTableFeature();
    }
    if (this.props.selectedInUseTable) {
      this.props.tableActions.deselectInUseTable();
    }
    this.props.toggleCombineTableMode();
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

      let iconNameSplit = iconName.split("_");
      iconNameSplit[1] = tableStatusColor;
      tableIconSplit[tableIconSplit.length - 1] =
        iconNameSplit.join("_") + fileType;
      return tableIconSplit.join("/")
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
  }

  /**
   * On confirm
   */
  onCombinedConfirm = () => {
    const tables = this.props.combineTable;
    let isValid = true;
    let combineList = [];
    let targetId = tables[0] ? tables[0].id : null;
    let message = this.props.trans("table_list:modal_swal.combine_table_message");
    if (!_.isEmpty(this.props.combineTable)) {
      let index = 0;
      if (!this.props.selectedFeature) {
        if (this.props.combineTable.length <= 1 ) {
          isValid = false;
        }
        index = 1;
      } else {
        if (this.props.selectedFeature === 'ADD_TABLE') {
          targetId = this.props.selectedInUseTable.id
          message = this.props.trans("table_list:modal_swal.add_table_message");
        }
        if (this.props.selectedFeature === 'COMBINE_TABLE') {
          targetId = this.props.selectedInUseTable.id
          message = this.props.trans("table_list:modal_swal.combine_table_in_use_message");
        }
      }

      for (index; index < tables.length; index++) {
        combineList.push({
          table_join_id: tables[index].id,
        });
      }
    } else {
      isValid = false
    }

    if (isValid) {
      Swal.fire({
        icon: "warning",
        title: this.props.trans("table_list:modal_swal.sure"),
        text: message,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: this.props.trans("table_list:modal_swal.ok"),
        cancelButtonText: this.props.trans("table_list:modal_swal.cancel"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.props.tableActions.combineTable({
            table_id: targetId,
            join_tables: combineList,
            onCombineSuccess: this.onCombineSuccess,
            onCombineFailure: this.onCombineFailure,
          });
        }
      });
    }
  };

  /**
   * On combine success
   */
  onCombineSuccess = () => {
    let message = this.props.trans("table_list:combine_success_message")
    if (this.props.selectedFeature === "ADD_TABLE") {
      message = this.props.trans("table_list:modal_swal.add_table_success_message")
    }
    if (this.props.selectedFeature === "COMBINE_TABLE") {
      message = this.props.trans("table_list:modal_swal.combine_table_in_use_success_message")
    }
    Swal.fire({
      icon: "success",
      title: this.props.trans("table_list:modal_swal.done"),
      text: message,
      showConfirmButton: true,
    }).then(async (result) => {
      const { selectedArea } = this.props
      if (selectedArea) {
        this.props.tableActions.getListTable({area_id: selectedArea.id})
      }
      this.onCloseCombinePanel();
    });
  };

  /**
   * On combine fail
   */
  onCombineFailure = () => {
    let message = this.props.trans("table_list:combine_error_message")
    if (this.props.selectedFeature === "ADD_TABLE") {
      message = this.props.trans("table_list:modal_swal.add_table_fail_message")
    }
    if (this.props.selectedFeature === "COMBINE_TABLE") {
      message = this.props.trans("table_list:modal_swal.combine_table_in_use_fail_message")
    }
    Swal.fire({
      icon: "error",
      title: this.props.trans("table_list:modal_swal.error"),
      text: message,
      showConfirmButton: true,
    });
  };

  /**
   * Render panel title
   */
  renderPanelTitle = (selectedFeature) => {
    let title = this.props.trans("table_list:combine_table_list_title")
    if (selectedFeature === 'ADD_TABLE') {
      title = this.props.trans('table_list:add_table_list_title')
    } else if (selectedFeature === 'CHANGE_TABLE') {
      title = this.props.trans('table_list:change_table_title')
    } else if (selectedFeature === 'COMBINE_TABLE') {
      title = this.props.trans('table_list:add_in_use_table_title')
    }

    return title;
  }

  render() {
    const { trans, selectedFeature } = this.props;
    return (
      <div className={Styles["combine-table-panel"]}>
        <div className={Styles["header"]}>
          {
            this.renderPanelTitle(selectedFeature)
          }
        </div>
        <div className={Styles["combine-table-list"]}>
          {this.randerCombinedTable()}
        </div>
        <div className={Styles["combine-table-action"]}>
          <button
            className={`${Styles["button"]} ${Styles["cancel"]}`}
            onClick={this.onCloseCombinePanel.bind(this)}
            type="button"
          >
            {trans("table_list:combine_table_cancel")}
          </button>
          <button
            className={Styles["button"]}
            onClick={this.onCombinedConfirm.bind(this)}
            type="button"
          >
            {trans("table_list:combine_table_save")}
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state[TableListReducerName],
  }
}
const mapDispatchToProps = dispatch => {
  return {
    tableActions: bindActionCreators({...actions}, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CombineTablePanel);
