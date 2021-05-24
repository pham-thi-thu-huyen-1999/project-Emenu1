import React, { Component } from "react";
import Slider from "react-slick";
import * as CONSTS from "../constants";
import { Input } from "../../../components/common";
class SlickEmployeeMonth extends Component {
  state = {
    slickIndex: 0,
    indexSlide: 0,
    selected: this.props.selectedEmployeeInMonthManagement === null ? { user_id: '' } : this.props.selectedEmployeeInMonthManagement,
    searching: null,
    employeeList: this.props.employeeList,
  };

  next = () => {
    this.slider.slickNext();
  };

  previous = () => {
    this.slider.slickPrev();
  };

  /**
   * Change selected employee id for month management
   */
  onChange = (employee) => {
    this.setState({
      selected: employee
    })
    this.props.changeSelectedEmployeeInMonthManagement(employee);
  }
  /**
   * Search employee by name
   */
  onSearch = (searching) => {
    if (searching === '' || searching === null) {
      const { employeeList } = this.props;
      this.setState({
        employeeList
      });
    } else {
      const employeeList = this.props.employeeList.filter(employee => employee.full_name.toLowerCase().includes(searching.toLowerCase()));
      this.setState({
        employeeList
      });
    }
  }

  static onSearchUpdate = (states, props) => {
    if (states.searching === '' || states.searching === null) {
      const { employeeList } = props;
      return employeeList;
    } else {
      const employeeList = props.employeeList.filter(employee => employee.full_name.toLowerCase().includes(states.searching.toLowerCase()));
      return employeeList;
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.employeeList.length === 0 && nextProps.employeeList.length !== 0 || nextProps.hasUpdateTotalShift && prevState.searching === '') {
      nextProps.updateFinish();
      return {
        employeeList: nextProps.employeeList,
      }
    } else if (prevState.employeeList.length === 0 && nextProps.employeeList.length !== 0 || nextProps.hasUpdateTotalShift && prevState.searching !== '') {
      nextProps.updateFinish();
      return {
        employeeList: SlickEmployeeMonth.onSearchUpdate(prevState, nextProps),
      };
    }
    return null;
  }

  render() {
    const { t } = this.props;
    const { selected, indexSlide, employeeList } = this.state;
    let settings = {
      infinite: false,
      slidesToShow: 6,
      slidesToScroll: 1,
      vertical: true,
      draggable: false,
      arrows: false,
      afterChange: current => this.setState({ indexSlide: current })
    }

    return (
      <div className="employee-list-in-month">

        <div className="managed-employee-list">

          <div className="managed-employee-list__search">
            <Input

              placeholder={t("calendarManagement.searchName")}
              onChange={e => {
                this.setState({ searching: e.target.value });
                this.onSearch(e.target.value);
              }}
              className="search-text"
            />
          </div>
          <div className="slider slick-initialized slick-slider slick-vertical">
            {employeeList.length <= settings.slidesToShow ? null : (
              <button
                className={`slick-arrow slick-prev arrow-up ${indexSlide <= 0 ? "slick-disabled" : null
                  }`}
                style={{ display: "block", top: "30%", right: "0", left: "unset" }}
                onClick={this.previous}
              ></button>
            )}

            <div className="slick-list draggable" style={{ height: `${settings.slidesToShow * 100}px` }}>
              <div
                className="slick-track radio-list"
                style={{
                  opacity: 1,
                  transform: "translate3d(0px, 0px, 0px)",
                  height: `${settings.slidesToShow * 100}px`
                }}
              >
                {employeeList.length === 0 ? (
                  <div style={{ textAlign: "center" }}>

                  </div>
                ) : null}
                <Slider ref={c => (this.slider = c)} {...settings}>
                  {employeeList.map((employee, index) => (
                    <div key={index} className="e-row">
                      <div className="employee-card radio-item">
                        <input
                          type="radio"
                          className="employee-radio-card"
                          id={`radio-list-${employee.user_id}`}
                          name={employee.full_name}
                          onChange={e => this.onChange(employee)}
                          checked={employee.user_id === selected.user_id}
                        />
                        <label
                          style={{ marginTop: -5, cursor: "pointer" }}
                          htmlFor={`radio-list-${employee.user_id}`}
                          className="txt blue"
                        >
                          <span style={{ whiteSpace: "nowrap" }}>
                            <div className="employee-name-card" data-shift={`( ${employee.total_shift} ${t("calendarManagement.shift")} / ${employee.total_date} ${t("calendarManagement.day")} )`}>{employee.full_name}</div>
                          </span>
                        </label>
                      </div>


                    </div>
                  ))}
                </Slider>
              </div>

              {employeeList.length > settings.slidesToShow ? (
                <button
                  className={`slick-arrow slick-next arrow-down ${indexSlide + settings.slidesToShow >= employeeList.length ? "slick-disabled" : null
                    }`}
                  style={{ display: "block", bottom: "40%", right: "0", left: "unset" }}
                  onClick={this.next}
                ></button>
              ) : null}
            </div>

          </div>

        </div>
      </div>

    );
  }
}

export default SlickEmployeeMonth;
