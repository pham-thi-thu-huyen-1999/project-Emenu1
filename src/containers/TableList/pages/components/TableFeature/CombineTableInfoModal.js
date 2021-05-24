import React, { Component } from "react";
import Styles from "../../../scss/TableList.module.scss";
import _ from "lodash";
import * as actions from "../../../actions";
import * as areaActions from "../../../../AreaManagement/actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { TableListReducerName } from "../../../reducers";
import { AreaReducerName } from "../../../../AreaManagement/reducers";
import TABLE_CONST from "../../TableContants";
import { seperateTable } from "../../../../../api/table";
import Swal from "../../../../../utils/sweetalert2";
class CombineTableInfoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTables: [],
      combinedTables: [],
      currentTable: Object
    };
  }

  componentDidMount() {
    this.getCombinedTable();
  }

  /**
   * Get combined table
   */
  getCombinedTable = () => {
    let combinedTables = [...this.props.combinedTables];
    if (!_.isEmpty(combinedTables)) {
      let currentTable = this.props.selectedInUseTable || this.props.selectedQRCodeTable;
      combinedTables.push(currentTable);
      this.setState({
        combinedTables: combinedTables,
        currentTable: currentTable
      });
    }
  };

  /**
   * Close modal
   */
  closeModal = async () => {
    await this.props.tableActions.deselectInUseTableFeature();
    this.props.closeModal();
  };

  /**
   * Handle choose table
   */
  handleChooseTable = (tableId) => {
    if (this.isAbleToChooseTable(tableId)) {
      let tableIds = [...this.state.selectedTables];
      if (!tableIds.includes(tableId)) {
        tableIds.push(tableId);
      } else {
        tableIds = tableIds.filter((loopId) => loopId !== tableId);
      }
      this.setState({
        selectedTables: tableIds,
      });
    }
  };

  /**
   * Is table active
   */
  isTableChoosen = (tableId) => {
    return this.state.selectedTables.includes(tableId);
  };

  /**
   * Render tables
   */
  renderTables = () => {
    if (_.isEmpty(this.state.combinedTables)) {
      return <div className={Styles["empty-combine-table"]}>
        {this.props.trans("table_list:combine_info.empty_data")}
      </div>
    } else {
      return this.state.combinedTables.map((table) => {
        let tableId = table.id || table.table_join_id;
        return (
          <div
            key={tableId}
            className={`${Styles["table-item"]} ${
              this.isTableChoosen(tableId) ? Styles["active"] : ""
            }`}
            onClick={this.handleChooseTable.bind(this, tableId)}
          >
            <div className={Styles["table-item-title"]}>
              <span>{table.name || table.table_join_name}</span>
              <span style={{ color: "#5E6775" }}>
                {`${table.seat_number} ${this.props.trans("table_list:chair")}`}
              </span>
            </div>
            <div className={Styles["table-item-info"]}>
              <div className={Styles["icon-container"]}>
                <img
                  alt={""}
                  src={this.getBackgroundImage(table)}
                  style={{ minHeight: "100px", maxHeight: "145px" }}
                />
              </div>
            </div>
          </div>
        );
      });
    }
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
      iconNameSplit[2] = table.seat_number;
      iconNameSplit[1] = tableStatusColor;
      tableIconSplit[tableIconSplit.length - 1] =
        iconNameSplit.join("_") + fileType;
      return tableIconSplit.join("/");
    }
  };

  /**
   * Is Choose table enable
   */
  isAbleToChooseTable = (tableId) => {
    if(this.state.currentTable.id===tableId) return false
    return true;
    // return this.props.selectedFeature === "SEPERATE_TABLE";
  }

  /**
   * Render title
   */
  renderTitle = () => {
    let title = this.props.trans("table_list:combine_info.title_info");
    if (this.props.selectedFeature === "SEPERATE_TABLE") {
      title = this.props.trans("table_list:combine_info.title_seperate");
    }
    return title;
  };

  /**
   * Confirm select table
   */
  confirmSelectTable = () => {
    if (!_.isEmpty(this.state.selectedTables)) {
      this.separateTables(this.state.selectedTables)
    }
  };

  /**
   * Separate table
   */
  separateTables = (selectedTables) => {
    Swal.fire({
      icon: "warning",
      title: this.props.trans("table_list:modal_swal.sure"),
      text: this.props.trans("table_list:modal_swal.separate_table_message"),
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: this.props.trans("table_list:modal_swal.ok"),
      cancelButtonText: this.props.trans("table_list:modal_swal.cancel"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // TODO: Wait correct API
          // const data = await seperateTable({ join_tables: selectedTables, table_id: this.props.selectedInUseTable.id })
          // if (data) {
          //   Swal.fire({
          //     icon: "success",
          //     title: this.props.trans("table_list:modal_swal.done"),
          //     text: this.props.trans("table_list:modal_swal.separate_table_success_message"),
          //     showConfirmButton: true,
          //   }).then(async (result) => {
          //     this.props.tableActions.getListTable({area_id: this.props.selectedArea.id})
          //     this.closeModal();
          //   });
          // }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: this.props.trans("table_list:modal_swal.error"),
            text: this.props.trans("table_list:modal_swal.separate_table_fail_message"),
            showConfirmButton: true,
          })
        }
      }
    });
  }

  render() {
    return (
      <div
        className={`mfp-content ${Styles["modal-wrapper"]}`}
        style={{ width: "712px", height: "630px" }}
      >
        <div
          className={Styles["button-close"]}
          onClick={this.closeModal.bind(this)}
        ></div>
        <div className={Styles["modal-header-title"]}>
          <span>{this.renderTitle()}</span>
        </div>
        <div
          className={`${Styles["modal-content-wrapper"]}`}
          style={{ height: "100%", maxHeight: "calc(100% - 110px)" }}
        >
          {this.renderTables()}
        </div>
        <div className={Styles["modal-action-buttons"]}>
          <button
            onClick={this.closeModal.bind(this)}
            className={`${Styles["button"]} ${this.isAbleToChooseTable() ? Styles["cancel"] : null}`}
            type="button"
          >
            {this.isAbleToChooseTable()
              ? this.props.trans("table_list:back")
              : this.props.trans("table_list:ok")}
          </button>
          {this.isAbleToChooseTable() ? (
            <button
              className={Styles["button"]}
              type="button"
              onClick={this.confirmSelectTable.bind(this)}
            >
              {this.props.trans("table_list:choose")}
            </button>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state[TableListReducerName],
    ...state[AreaReducerName]
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    tableActions: bindActionCreators({ ...actions }, dispatch),
    areaActions: bindActionCreators({ ...areaActions }, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CombineTableInfoModal);
