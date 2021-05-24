import React, { Component } from "react";
import SlickIndexForEmployee from "./SlickIndexForEmployee";
class BoxTotalEmployeeWorkinginWeek extends Component {
  state = {
    selectedIndex: [false,false,false,false,false,false,false]
  }
  render() {
    const settings = {
      infinite: false,
      slidesToShow: 3,
      slidesToScroll: 1,
      vertical: true,
      draggable: false,
      arrows: false,
    };
    const { title, employeeListForWeek } = this.props;
    const { selectedIndex } = this.state;
    console.table(selectedIndex);
    return (
      <div className="box-report-medium box-total-employee-in-week">
        <div className="box-total-employee-in-week__title">
          {title}
        </div>
        <div className="box-total-employee-in-week__chart">
          {
            employeeListForWeek.map((employeeListItem, index) => {
              return (
                <div key={index} className="slick-item">
                  <div className="slick-item__title" onClick={() => {
                    selectedIndex[index] = !selectedIndex[index];
                    this.setState({
                      selectedIndex: selectedIndex
                    })
                  }}>
                     <span>{employeeListItem.dateName}</span>
                     <span>{employeeListItem.employeeList.length} Người </span>
                  </div>
                  <div className={selectedIndex[index] ? "slick-item__popup active" : "slick-item__popup"}>
                      <SlickIndexForEmployee employeeList={employeeListItem.employeeList} settings={settings}>

                      </SlickIndexForEmployee>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>

    );
  }
}

export default BoxTotalEmployeeWorkinginWeek;
