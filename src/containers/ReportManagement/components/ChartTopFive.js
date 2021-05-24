import React, { Component } from "react";
import { Bar, Chart } from "react-chartjs-2";
Chart.defaults.global.defaultFontSize = 15;
class ChartTopFive extends Component {
  render() {
    const { title, setting } = this.props;
    return (

      <div className="box-report-medium ">
        <div className="chart-top-five">
          <div className="chart-top-five__title">
            {title}
          </div>
          <div className="chart-top-five__chart">
            <Bar

              height={400}
              data={setting.data}
              options={setting.options}
            />
          </div>
        </div>
      </div>


    );
  }
}

export default ChartTopFive;
