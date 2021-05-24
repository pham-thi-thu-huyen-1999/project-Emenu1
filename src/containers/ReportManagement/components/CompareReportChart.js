import React, { Component } from "react";
import { Line, Bar, Chart } from "react-chartjs-2";
import * as CONSTS from "./../constants";
Chart.defaults.global.elements.line.tension = 0;
class CompareReportChart extends Component {
  render() {
    const { title, setting, name } = this.props;
    return (

      <div className="box-report-large">
        <div className="chart-compare">
          <div className="chart-compare__title">
            {title}
          </div>
          <div className="chart-compare__chart">
            {
              name === CONSTS.LINE_NAME ?
                (
                  <Line
                    height={500}
                    data={setting.data}
                    options={setting.options}
                  />
                ) : null

            }
            {
              name === CONSTS.COLLUMN_NAME ?
                (
                  <Bar
                    height={500}
                    data={setting.data}
                    options={setting.options}
                  />
                ) : null

            }

          </div>
        </div>
      </div>


    );
  }
}

export default CompareReportChart;
