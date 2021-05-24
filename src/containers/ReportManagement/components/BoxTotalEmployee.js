import React, { Component } from "react";
import Slider from "react-slick";
import  SlickIndexForEmployee from "./SlickIndexForEmployee";
class BoxTotalEmployee extends Component {
  
  render() {
    const settings = {
      infinite: false,
      slidesToShow: 5,
      slidesToScroll: 1,
      vertical: true,
      draggable: false,
      arrows: false,
    };
    const { title,employeeList } = this.props;
    

    
    return (

      <div className="box-report-medium">
        <div className="box-total-employee__title">
          <span className="box-total-employee__title-text">
            {title}
          </span>
          <span className="box-total-employee__title-number">
            {employeeList.length}
       </span>
        </div>
        <div className="box-total-employee__chart">
          <SlickIndexForEmployee employeeList={employeeList} settings={settings}>

          </SlickIndexForEmployee>
        </div>


      </div>

    );
  }
}

export default BoxTotalEmployee;
