import React, { Component } from "react";
import { CheckBox } from "../../../components/common";
import Swal from "../../../utils/sweetalert2";
import * as CONSTS from "./../constants";
import Dialog from "./../../../../src/components/common/Dialog";
import { Input } from "../../../components/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import Button from "../../../components/common/Button";

export default class PopoupAddEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeList: this.props.accountList,
      workShiftId: this.props.workShift.id,
      workShift: this.props.workShift,
      searching: "",
      selected: [],
    };
  }

  /**
   * Check or Un_Check Employee
   */
  HandleClickEmployee = (id) => {
    let { selected } = this.state;
    const indexOfId = selected.indexOf(id);

    if (indexOfId === -1) {
      selected = selected.concat(id);
    } else {
      selected.splice(indexOfId, 1);
    }

    this.setState({ selected });
  };

  /**
   * Add Employee to work shift
   */
  showAlert = () => {
    const { t, selectedDate } = this.props;
    const { workShiftId, employeeList, workShift, selected } = this.state;
    const data = {
      "shift_id": workShiftId,
      "overtime_at": moment(new Date(selectedDate)).format("DD-MM-YYYY").toString(),
      "users": [
      ]
    }

    Swal.fire({
      title: t("calendarManagement.swalTitle"),
      text: t("calendarManagement.swalAddEmployeeForWorkShift"),
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: t("calendarManagement.swalAgree"),
      cancelButtonText: t("calendarManagement.swalCancel"),
    }).then((result) => {
      if (result.value) {
        let employeeListTemp = []
        employeeList.filter((employee, index) => {
          if (selected.indexOf(employee.id) !== -1) {
            employeeListTemp.push(employee.id);
          }
          return null;
        })
        workShift.users.filter((employee, index) => {
          if (employee.status_calendar === CONSTS.WORK_PART_TIME) {
            employeeListTemp.push(employee.id);
          }
          return null;
        })
        data.users = [...employeeListTemp];
        this.props.actions.addEmployeesToShift({
          data,
          callback_success: this.showOk,
          callback_fail: this.showErr
        });

        this.props.hide();
      }
    })
  }

  showOk = () => {
    const t = this.props.t;
    Swal.fire({
      icon: 'success',
      text: t("calendarManagement.swalUpdateSuccess"),
      title: t("calendarManagement.swalTitle")
    })
  }

  showErr = () => {
    const t = this.props.t;
    Swal.fire({
      icon: 'error',
      title: t("calendarManagement.swalTitle"),
      text: t("calendarManagement.swalUpdateFail"),
    })
  }

  onSearch = () => {
    const { searching } = this.state;
    if (searching === '' || searching === null) {
      const employeeList = [...this.props.accountList];
      this.setState({
        employeeList
      });
    } else {
      const employeeList = this.props.accountList.filter(employee => employee.full_name.toLowerCase().includes(searching.toLowerCase()));
      this.setState({
        employeeList
      });
    }
  }
  render() {
    const { t } = this.props;
    const { employeeList, selected } = this.state;
    return (
      <Dialog
        show={true}
        close={() => this.props.hide()}
        innerClass="popup-add-employee-to-shift"
      >
        <h2
          className="main-lbl text-center popup-add-employee-to-shift__title"
        >
          {t("calendarManagement.titleAddEmployeeForWorkShift")}
        </h2>
        <div className="popup-add-employee-to-shift__search">
          <Input

            placeholder={t("calendarManagement.searchName")}
            onChange={e => {
              this.setState({ searching: e.target.value });
            }}
            className="search-text"
          />
          <div onClick={this.onSearch} className="search-btn" >
            {t("calendarManagement.search")}{" "}
            <FontAwesomeIcon
              icon={faSearch}
              style={{
                fontSize: 20,
                verticalAlign: "middle",
              }}
            />
          </div>
        </div>
        <div className="popup-add-employee-to-shift__content e-row">
          {employeeList.map((employee, i) => (
            <div className="e-col-4 employee-name e-flex content-start" key={i}>
              <CheckBox
                name={employee.id}
                label={employee.full_name}
                checked={selected.indexOf(employee.id) !== -1}
                onChange={() => this.HandleClickEmployee(employee.id)}
              />
              <br /> <br />
            </div>
          ))}

        </div>
        <aside
          className="e-row e-col-12 e-flex content-center"
        >
          <Button onClick={this.showAlert}>{t("calendarManagement.add")}</Button>
        </aside>
      </Dialog>


    );
  }
}




