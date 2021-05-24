import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";

class BoxEstimatedRevenue extends Component {
  render() {
    const { title, RevenueChart } = this.props;
    return (

      <div className="box-report-medium">
        <div className="estimated-revenue__title">
          <span className="estimated-revenue__title-text">
            {title}
          </span>
          <span className="estimated-revenue__title-number">
            35.000.000Đ
       </span>
        </div>
        <div className="estimated-revenue__chart">
          <Doughnut
            height={150}
            data={RevenueChart.data}
            option={RevenueChart.option}
            legend={RevenueChart.legend}
            labels={RevenueChart.labels}
          />
        </div>
        {
          RevenueChart.data.labels.map((data, index) =>
            (
              <div key={index} className="estimated-revenue__note">
                <span className="estimated-revenue__note-title">
                  <span className="shape">
                    <canvas id="myCanvas" width="20" height="20"
                      style={{ backgroundColor: `${RevenueChart.data.datasets[0].backgroundColor[index]}` }}>
                    </canvas>
                  </span>
                  <span className="title">{data}</span>
                  <span className="percent">{RevenueChart.data.datasets[0].data[index]}%</span>
                </span>
                <span className="estimated-revenue__note-money">
                  5.000.000Đ
                </span>
              </div>
            )
          )
        }



      </div>

    );
  }
}

export default BoxEstimatedRevenue;
