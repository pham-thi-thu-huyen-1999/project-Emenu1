import React from "react";
import Button from "../../../components/common/Button";
import Dialog from "../../../components/common/Dialog";
import PopupListArea from "./PopupListArea";
import Table from "./Table";
import Swal from '../../../../src/utils/sweetalert2';

export default class SelectTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tableListByStatus: props.tableListByStatus[0],
      tablesByArea: this.props.tablesByArea,
      itemArea: {},
      newListTableCheked: this.props.listTableBooking,
      listTableBooking: this.props.listTableBooking,
      isShowSelectArea: false,
      showPopupListArea: false,
      checked: false,
      indexArea: 0,
      nameArea: props.nameArea
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps.listTableBooking)
      !== JSON.stringify(prevState.listTableBooking)
    ) {
      return {
        listTableBooking: nextProps.listTableBooking
      }
    }
    return null
  }
  componentDidMount() {
    let newListTableCheked = [...this.state.newListTableCheked];
    newListTableCheked = this.props.listTableBooking.map(table => {
      let id = table.id
      return id
    })
    this.setState({
      newListTableCheked
    })
  }
  headerListArea = () => {
    const { t } = this.props
    return (
      <div className="header-popup-select-table e-flex item-center content-center">
        <h2 className="title e-flex content-center item-center"></h2>
      </div>
    )
  }
  /**
   * select area
   * @param {*} selected
   * @param {*} id
   */
  checkedTable = (checked, table) => {
    let newListTableCheked = [...this.state.newListTableCheked]
    if (checked) {
      newListTableCheked.push(table.id)
    }
    else {
      newListTableCheked = this.state.newListTableCheked.filter(item => item !== table.id)
    }

    this.setState({ newListTableCheked })
  }
  saveSelectedTable = () => {
    const { t } = this.props
    Swal.fire({
      title: `${t("bookingTables.sure")}`,
      text: `${t("bookingTables.validConfirmAddTables")}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: `${t("bookingTables.yes")}`,
      cancelButtonText: `${t("bookingTables.no")}`,
    }).then(async (result) => {
      if (result.value) {
        this.props.chooseTable(this.state.newListTableCheked);
        this.props.actions.sortTableBooking({
          table_ids: this.state.newListTableCheked,
          booking_id: this.props.booking.id
        })
        this.props.actions.resetBookingDetail();
        this.props.hide();
      }
    })
  }
  /**
   * change get index area
   */
  openPopupListArea = () => {
    let indexArea = 0;
    if (this.props.tableListByStatus.length) {
      const idArea = this.props.tableListByStatus[0].area_id
      this.props.areaListDetails.map((area, index) => {
        if (area.id === idArea) {
          indexArea = index;
          return index;
        }
      })
      this.setState({ showPopupListArea: true, indexArea });
    }
    else {
      this.setState({ showPopupListArea: true });
    }
  }
  render() {
    const { ...rest } = this.props;
    const { t, tableListByStatus } = this.props;
    const { showPopupListArea, nameArea } = this.state;
    return (
      <div className="list-table-select">
        <div className="btn-select">
          <div className="title-list e-flex content-center">
            <h3>{t("bookingTables.listTable")}</h3>
          </div>
          <div className="btn-choose-area e-flex">
            <div onClick={this.openPopupListArea}>
              <img src="/images/button-chonkhuvuc.png" />
            </div>
            <span className="name-area e-flex item-center">
              {tableListByStatus.length > 0 ?
                tableListByStatus[0].area_name : nameArea}
            </span>
          </div>
        </div>
        {
          Object.keys(this.props.tablesByArea).length > 0 ?
            <>
              <div className="show-list-table">
                <ul className="e-row list-table">
                  {
                    this.props.tablesByArea.map((item, index) => {
                      let checked = this.state.newListTableCheked.includes(item.id)
                      return (
                        <Table
                          table={item}
                          key={index}
                          checked={checked}
                          listTableBooking={this.props.listTableBooking}
                          checkedTable={this.checkedTable}
                          {...rest}
                        />
                      )
                    })
                  }
                </ul>
              </div>
              <hr></hr>
            </>
            : <div className="text-require-selected-area e-flex content-center">
              <span className="">{t("bookingTables.areaNoTableEmpty")}</span>
            </div>
        }
        <div className="btn-dialog-list-table e-m-top-10">
          <div className="e-dialog-footer e-flex content-center">
            <Button type="s7" style={{ marginRight: "10px", backgroundColor: "#FE5937" }} onClick={() => this.props.hidePopupTable()}>{t("bookingTables.cancel")}</Button>
            <Button style={{ backgroundColor: "#F58F1C" }} onClick={this.saveSelectedTable}>{t("bookingTables.confirm")}</Button>
          </div>
        </div>
        <Dialog
          title={t("bookingTables.listArea")}
          show={showPopupListArea}
          close={() => this.setState({ showPopupListArea: false })}
          innerClass="popup-booking"
        >
          <PopupListArea
            indexArea={this.state.indexArea}
            hidePopupArea={() => this.setState({ showPopupListArea: false })}
            saveSelectArea={area => this.setState({ nameArea: area.name })}
            {...rest}
          />
        </Dialog>
      </div>
    )
  }
}