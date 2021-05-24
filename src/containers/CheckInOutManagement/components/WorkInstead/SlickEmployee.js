import React, { Component } from "react";
import Slider from "react-slick";
import { Input } from "../../../../components/common";
class SlickEmployee extends Component {
  state = {
    slickIndex: 0,
    indexSlide: 0,
    selected:
      this.props.selectedEmployee === null
        ? { id: "" }
        : this.props.selectedEmployee,
    searching: null,
    employeeList: this.props.accountList,
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
      selected: employee,
    });
    this.props.changeEmployee(employee);
  };
  /**
   * Search employee by name
   */
  onSearch = (searching) => {
    if (searching === "" || searching === null) {
      const { employeeList } = this.props;
      this.setState({
        employeeList,
      });
    } else {
      const employeeList = this.props.employeeList.filter((employee) =>
        employee.full_name.toLowerCase().includes(searching.toLowerCase())
      );
      this.setState({
        employeeList,
      });
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      prevState.employeeList.length === 0 &&
      nextProps.accountList.length !== 0
    ) {
      return {
        employeeList: nextProps.accountList,
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
      afterChange: (current) => this.setState({ indexSlide: current }),
    };

    return (
      <div className="employee-list-in-month">
        <div className="managed-employee-list">
          <div className="managed-employee-list__search">
            <Input
              placeholder={t("calendarManagement.searchName")}
              onChange={(e) => {
                this.setState({ searching: e.target.value });
                this.onSearch(e.target.value);
              }}
              className="search-text"
            />
          </div>
          <div className="slider slick-initialized slick-slider slick-vertical">
            {employeeList.length <= settings.slidesToShow ? null : (
              <button
                className={`slick-arrow slick-prev arrow-up ${
                  indexSlide <= 0 ? "slick-disabled" : null
                }`}
                style={{
                  display: "block",
                  top: "30%",
                  right: "0",
                  left: "unset",
                }}
                onClick={this.previous}
              ></button>
            )}

            <div
              className="slick-list draggable"
              style={{ height: `${settings.slidesToShow * 100}px` }}
            >
              <div
                className="slick-track radio-list"
                style={{
                  opacity: 1,
                  transform: "translate3d(0px, 0px, 0px)",
                  height: `${settings.slidesToShow * 100}px`,
                }}
              >
                {employeeList.length === 0 ? (
                  <div style={{ textAlign: "center" }}></div>
                ) : null}
                <Slider ref={(c) => (this.slider = c)} {...settings}>
                  {employeeList.map((employee, index) => (
                    <div key={index} className="e-row">
                      <div className="employee-card radio-item">
                        <input
                          type="radio"
                          id={`radio-list-${employee.id}`}
                          name={employee.full_name}
                          onChange={(e) => this.onChange(employee)}
                          checked={employee.id === selected.id}
                          style={{
                            minWidth: "30px",
                          }}
                        />
                        <label
                          style={{ marginTop: -5, cursor: "pointer" }}
                          htmlFor={`radio-list-${employee.user_id}`}
                          className="txt blue"
                        >
                          <span style={{ whiteSpace: "nowrap" }}>
                            <div className="employee-name-card">
                              {employee.full_name}
                            </div>
                          </span>
                        </label>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>

              {employeeList.length > settings.slidesToShow ? (
                <button
                  className={`slick-arrow slick-next arrow-down ${
                    indexSlide + settings.slidesToShow >= employeeList.length
                      ? "slick-disabled"
                      : null
                  }`}
                  style={{
                    display: "block",
                    bottom: "40%",
                    right: "0",
                    left: "unset",
                  }}
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

export default SlickEmployee;
