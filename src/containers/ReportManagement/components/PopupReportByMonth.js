import React, { Component } from "react";
import BoxReportSmall from "./BoxReportSmall";
import BoxEstimatedRevenue from "./BoxEstimatedRevenue";
import ChartTopFive from "./ChartTopFive";
import SelectBoxCommon from "./SelectBoxCommon";
import CompareReportChart from "./CompareReportChart";

export default class PopoupReportByMonth extends Component {
  state = {
    isBuffet: this.props.isBuffet
  }

  render() {
    const { hide, rest, t } = this.props;
    const { isBuffet } = this.state;
    const reportTitleList = [
      {
        title: t("reportManagement.totalCustomer"),
        number: 10,
      },
      {
        title: t("reportManagement.numBookedOnlineTable"),
        number: 10,
      },
      "",
    ]
    const reportTitleListForBuffet = [
      {
        title: t("reportManagement.totalRevenue"),
        number: 10,
      },
      {
        title: t("reportManagement.totalCustomer"),
        number: 10,
      },
      {
        title: t("reportManagement.numBookedOnlineTable"),
        number: 10,
      },

    ]
    const RevenueChart = {

      data: {
        labels: [
          "Đồ ăn",
          "Thức uống",
          "Khác"
        ],
        datasets: [
          {
            backgroundColor: [
              "rgb(38, 153, 251)",
              "rgb(245, 143, 28)",
              "rgb(57, 181, 82)"
            ],
            data: [65, 30, 5]
          }
        ]
      },
      showDatapoints: true,
      option: {
        maintainAspectRatio : false,
        pieceLabel: {
          mode: 'value'
        },
        animationEnabled: true,
        exportEnabled: true,
        title: {
          display: false,
        },



      },
      legend: {
        display: false,

      },

    }
    const settingColumnChartForDrink = {
      data: {
        labels: [
          "Tiger",
          "Heniken",
          "Pepsi",
          "Coca",
          "7UP"
        ],
        datasets: [
          {
            label: "Milions",
            backgroundColor: [
              "#3e95cd",
              "#8e5ea2",
              "#3cba9f",
              "#e8c3b9",
              "#c45850"
            ],
            data: [2.8, 1.5, 1, 0.8, 0.5]
          }
        ]
      },
      options: {
        maintainAspectRatio : false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        legend: { display: false },
      }
    }

    const settingColumnChartForFood = {
      data: {
        labels: [
          "Vú dê nướng",
          "Tôm hấp bia",
          "Mì xào hải sản",
          "Bò nướng lu",
          "Mì xào bò"
        ],
        datasets: [
          {
            label: "Milions",
            backgroundColor: [
              "#3e95cd",
              "#8e5ea2",
              "#3cba9f",
              "#e8c3b9",
              "#c45850"
            ],
            data: [2.8, 1.5, 1, 0.8, 0.5]
          }
        ]
      },
      options: {
        maintainAspectRatio : false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        legend: { display: false },
      }
    }

    const monthList = [
      {
        title: "Tháng 1"
      },
      {
        title: "Tháng 2"
      },
      {
        title: "Tháng 3"
      },
      {
        title: "Tháng 4"
      },
      {
        title: "Tháng 5"
      },
      {
        title: "Tháng 6"
      },
      {
        title: "Tháng 7"
      },
      {
        title: "Tháng 8"
      },
      {
        title: "Tháng 9"
      },
      {
        title: "Tháng 10"
      },
      {
        title: "Tháng 11"
      },
      {
        title: "Tháng 12"
      },

    ]
    const settingLineChart = {
      data: {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],

        datasets: [
          {
            data: [3, 2, 5, 4, 6, 4, 3, 10, 20, 3, 4, 5, 6, 34, 5, 3, 4, 6, 9, 20, 25, 24, 23, 4, 3, 6, 7, 3, 4, 6, 5],
            label: "Doanh Thu",
            borderColor: "#3cba9f",
            fill: false
          },
        ]
      },
      options: {
        maintainAspectRatio : false,
        title: {
          display: true,
          text: "Revenue per day (in millions)"
        },
        legend: {
          display: true,
          position: "bottom"
        }
      }
    }


    return (
      <div className="popup popup-report mfp-container mfp-s-ready mfp-inline-holder">
        <div className="mfp-content mfp-content-report">
          <div
            id="popup-report-byday"
            className=" popup-box popup-add-new"
            ref={this.wrapperRef}
          >
            <button
              title="Close (Esc)"
              type="button"
              className="mfp-close"
              onClick={hide}
            >
              ×
            </button>
            <h3 className="sec-tit text-center">
              {t("reportManagement.titleByWeek")}
            </h3>
            <section className="report-content">
              <aside className="e-row">
                <div className="e-col-5">
                  <SelectBoxCommon list={monthList} collumn={3}>

                  </SelectBoxCommon>
                </div>
                <div>
                </div>
              </aside>
              {
                isBuffet ?
                  (
                    <>
                      <aside className="e-flex box-report-container" >
                        {
                          reportTitleListForBuffet.map((report, index) => {
                            return (
                              <BoxReportSmall reportData={report} key={index} {...rest}>

                              </BoxReportSmall>
                            )

                          })
                        }
                      </aside>
                      
                      <aside className="e-flex box-report-container">
                        <CompareReportChart
                          title={t('reportManagement.ChartComparesRevenueBetweenDates')}
                          setting={settingLineChart}
                          name="line"
                        >

                        </CompareReportChart>
                      </aside>
                    </>
                  ) :
                  (
                    <>
                      <aside className="e-flex box-report-container" >
                        {
                          reportTitleList.map((report, index) => {
                            return (
                              <BoxReportSmall reportData={report} key={index} {...rest}>

                              </BoxReportSmall>
                            )

                          })
                        }
                      </aside>
                      <aside className="e-flex box-report-container">
                        <BoxEstimatedRevenue {...rest}
                          title={t("reportManagement.estimatedRevenue")}
                          RevenueChart={RevenueChart}
                        >

                        </BoxEstimatedRevenue>
                        <ChartTopFive
                          title={t("reportManagement.topFiveDrink")}
                          setting={settingColumnChartForDrink}
                        >

                        </ChartTopFive>
                      </aside>
                      <aside className="e-flex box-report-container">
                        <ChartTopFive
                          title={t("reportManagement.topFiveFood")}
                          setting={settingColumnChartForFood}
                        >

                        </ChartTopFive>
                        <div className="box-report-medium ">

                        </div>
                      </aside>
                      <aside className="e-flex box-report-container">
                        <CompareReportChart
                          title={t('reportManagement.ChartComparesRevenueBetweenDates')}
                          setting={settingLineChart}
                          name="line"
                        >

                        </CompareReportChart>
                      </aside>
                    </>
                  )
              }




            </section>
          </div>
        </div>
      </div >
    );
  }
}




