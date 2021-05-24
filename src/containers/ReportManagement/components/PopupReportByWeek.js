import React, { Component } from "react";
import BoxReportSmall from "./BoxReportSmall";
import BoxEstimatedRevenue from "./BoxEstimatedRevenue";
import ChartTopFive from "./ChartTopFive";
import BoxTotalEmployeeWorkinginWeek from "./BoxTotalEmployeeWorkinginWeek";
import SelectBoxCommon from "./SelectBoxCommon";
import BoxTotalEmployee from "./BoxTotalEmployee";

export default class PopoupReportByWeek extends Component {
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
    const employeeList = [
      {
        name: "NGUYỄN VĂN B",
        are: "Khu Vực 1,2",
        image: `require('../../../images/userIcon.png')`
      },
      {
        name: "NGUYỄN VĂN B",
        are: "Khu Vực 1,2",
        image: `require('../../../images/userIcon.png')`
      },
      {
        name: "NGUYỄN VĂN B",
        are: "Khu Vực 1,2",
        image: `require('../../../images/userIcon.png')`
      },
      {
        name: "NGUYỄN VĂN B",
        are: "Khu Vực 1,2",
        image: `require('../../../images/userIcon.png')`
      },
      {
        name: "NGUYỄN VĂN B",
        are: "Khu Vực 1,2",
        image: `require('../../../images/userIcon.png')`
      },
      {
        name: "NGUYỄN VĂN B",
        are: "Khu Vực 1,2",
        image: `require('../../../images/userIcon.png')`
      },
      {
        name: "NGUYỄN VĂN B",
        are: "Khu Vực 1,2",
        image: `require('../../../images/userIcon.png')`
      },
      {
        name: "NGUYỄN VĂN B",
        are: "Khu Vực 1,2",
        image: `require('../../../images/userIcon.png')`
      },
    ]
    const employeeListForWeek = [
      {
        dateName: "Thứ 2",
        employeeList: [
          {
            name: "NGUYỄN VĂN B",
            are: "Khu Vực 1,2",
            image: `require('../../../images/userIcon.png')`
          },
          {
            name: "NGUYỄN VĂN B",
            are: "Khu Vực 1,2",
            image: `require('../../../images/userIcon.png')`
          },
          {
            name: "NGUYỄN VĂN B",
            are: "Khu Vực 1,2",
            image: `require('../../../images/userIcon.png')`
          },
          {
            name: "NGUYỄN VĂN B",
            are: "Khu Vực 1,2",
            image: `require('../../../images/userIcon.png')`
          },
          {
            name: "NGUYỄN VĂN B",
            are: "Khu Vực 1,2",
            image: `require('../../../images/userIcon.png')`
          },
        ]

      },
      {
        dateName: "Thứ 3",
        employeeList: [
          {
            name: "NGUYỄN VĂN B",
            are: "Khu Vực 1,2",
            image: `require('../../../images/userIcon.png')`
          },
          {
            name: "NGUYỄN VĂN B",
            are: "Khu Vực 1,2",
            image: `require('../../../images/userIcon.png')`
          },
        ]

      },
      {
        dateName: "Thứ 4",
        employeeList: [
          {
            name: "NGUYỄN VĂN B",
            are: "Khu Vực 1,2",
            image: `require('../../../images/userIcon.png')`
          },
          {
            name: "NGUYỄN VĂN B",
            are: "Khu Vực 1,2",
            image: `require('../../../images/userIcon.png')`
          },
        ]

      },
      {
        dateName: "Thứ 5",
        employeeList: [
          {
            name: "NGUYỄN VĂN B",
            are: "Khu Vực 1,2",
            image: `require('../../../images/userIcon.png')`
          },
          {
            name: "NGUYỄN VĂN B",
            are: "Khu Vực 1,2",
            image: `require('../../../images/userIcon.png')`
          },
        ]

      },
      {
        dateName: "Thứ 6",
        employeeList: [
          {
            name: "NGUYỄN VĂN B",
            are: "Khu Vực 1,2",
            image: `require('../../../images/userIcon.png')`
          },
          {
            name: "NGUYỄN VĂN B",
            are: "Khu Vực 1,2",
            image: `require('../../../images/userIcon.png')`
          },
        ]

      },
      {
        dateName: "Thứ 7",
        employeeList: [
          {
            name: "NGUYỄN VĂN B",
            are: "Khu Vực 1,2",
            image: `require('../../../images/userIcon.png')`
          },
          {
            name: "NGUYỄN VĂN B",
            are: "Khu Vực 1,2",
            image: `require('../../../images/userIcon.png')`
          },
        ]

      },
      {
        dateName: "Chủ Nhật",
        employeeList: [
          {
            name: "NGUYỄN VĂN B",
            are: "Khu Vực 1,2",
            image: `require('../../../images/userIcon.png')`
          },
          {
            name: "NGUYỄN VĂN B",
            are: "Khu Vực 1,2",
            image: `require('../../../images/userIcon.png')`
          },
        ]

      }
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

    const weekList = [
      {
        title: "Tuần 1 từ 1 - 7/5/2020"
      },
      {
        title: "Tuần 2 từ 8 - 14/5/2020"
      },
      {
        title: "Tuần 3 từ 15 - 21/5/2020"
      },
      {
        title: "Tuần 4 từ 22 - 28/5/2020"
      }
    ]


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
                  <SelectBoxCommon list={weekList} collumn={1}>

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
                        <BoxTotalEmployee
                          title={t("reportManagement.totalEmployeesAreWorking")}
                          employeeList={employeeList}
                        >

                        </BoxTotalEmployee>

                        
                      <BoxTotalEmployeeWorkinginWeek
                        title={t("reportManagement.listOfEmployeesWorkingInWeek")}
                        employeeListForWeek={employeeListForWeek}
                      >

                      </BoxTotalEmployeeWorkinginWeek>
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
                <BoxTotalEmployeeWorkinginWeek
                  title={t("reportManagement.listOfEmployeesWorkingInWeek")}
                  employeeListForWeek={employeeListForWeek}
                >

                </BoxTotalEmployeeWorkinginWeek>
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




