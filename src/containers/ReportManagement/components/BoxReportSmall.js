import React, { Component } from "react";
class BoxReportSmall extends Component {
  render() {
    
    const { reportData } = this.props;

    console.log(this.props);
    return (
       reportData ? 
        <div className="box-report-small e-row">
          <div className="e-col-6 box-report-small__title">
            {reportData.title}
          </div>
          <div className="e-col-6 box-report-small__number">
             {reportData.number}
          </div>
        </div> : <div className="e-row box-report-small" style={{background: "white"}}></div>

     
    );
  }
}

export default BoxReportSmall;
