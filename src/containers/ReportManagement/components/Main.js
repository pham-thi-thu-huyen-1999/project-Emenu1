import React, { Component } from "react";
import "./style.scss";
import ButtonLink from "./ButtonLink";
import * as CONSTS from "./../constants";
import PopupReportByDay from "./PopupReportByDay";
import PopupReportByWeek from "./PopupReportByWeek";
import PopupReportByMonth from "./PopupReportByMonth";
import PopupReportByQuaterly from "./PopupReportByQuaterly";
import PopupReportByYear from "./PopupReportByYear";


export default class Main extends Component {
  state = {
    selectedReportItemIndex: null,
    showPopupReportByDay: false,
    showPopupReportByWeek: false,
    showPopupReportByMonth: false,
    showPopupReportByQuaterly: false,
    showPopupReportByYear: false,
  };

  onSelectItem = (index) => {
    console.log("index",index);
    this.setState({
      selectedReportItemIndex: index,
      showPopupReportByDay: CONSTS.SHOW_POPUP_BY_DAY === index,
      showPopupReportByWeek: CONSTS.SHOW_POPUP_BY_WEEK === index,
      showPopupReportByMonth: CONSTS.SHOW_POPUP_BY_MONTH === index,
      showPopupReportByQuaterly: CONSTS.SHOW_POPUP_BY_QUATERLY === index,
      showPopupReportByYear: CONSTS.SHOW_POPUP_BY_YEAR === index
    })
  }
  render() {
    const { ...rest } = this.props;
    const { t, reportOverview } = this.props;
    const { selectedReportItemIndex } = this.state;
    let isBuffet = this.props.partnerSetting.is_buffet;
    const dataLink = [
      {
        id: 0,
        name: "reportManagement.byDay",
        iconImg: require("../../../images/Group 1014.png"),
        income: reportOverview.total_revenue_day ? reportOverview.total_revenue_day + "Đ" : "0đ"
      },
      {
        id: 1,
        name: "reportManagement.byWeekly",
        iconImg: require("../../../images/Group 1015.png"),
        income:  reportOverview.total_revenue_week ? reportOverview.total_revenue_week + "Đ" : "0đ"
      },
      {
        id: 2,
        name: "reportManagement.byMonth",
        iconImg: require("../../../images/Group 1017.png"),
        income: reportOverview.total_revenue_month ? reportOverview.total_revenue_month + "Đ" : "0đ"
      },
      {
        id: 3,
        name: "reportManagement.byQuarterly",
        iconImg: require("../../../images/Group 1016.png"),
        income:  reportOverview.total_revenue_quarter ? reportOverview.total_revenue_quarter + "Đ" : "0đ"
      },
      {
        id: 4,
        name: "reportManagement.byYear",
        iconImg: require("../../../images/calendar-alt-solid.png"),
        income:  reportOverview.total_revenue_year ? reportOverview.total_revenue_year + "Đ" : "0đ"
      },

    ];

    return (
      <>
      <main id="site-main" className="report-management nofooter">
        <div id="primary" className="no-footer clear">
          <section id="main-cont" className="full clear">
            <h2 className="text-center main-tit report-management-title">
              {t("reportManagement.title")}
            </h2>
            <aside id="mag-menu-scr" className="view-table e-flex align-start content-center">
              <div className="inner view-table-cell">
                <ButtonLink {...rest}
                  data={dataLink}
                  selectedReportItemIndex={selectedReportItemIndex}
                  selectItem={ this.onSelectItem }
                />
              </div>
            </aside>
          </section>
        </div>

      </main>
      {
        this.state.showPopupReportByDay ?
        (
          <PopupReportByDay
            hide={() => this.setState({
              showPopupReportByDay: false,
              selectedReportItemIndex: null
            })}
            {...rest} {...t}
            isBuffet={isBuffet}

          />
        ) :
        null


      }
      {
        this.state.showPopupReportByWeek ?
        (
          <PopupReportByWeek
            hide={() => this.setState({
              showPopupReportByWeek: false,
              selectedReportItemIndex: null
            })}
            {...rest} {...t}
            isBuffet={isBuffet}

          />
        ) :
        null


      }
      {
        this.state.showPopupReportByMonth ?
        (
          <PopupReportByMonth
            hide={() => this.setState({
              showPopupReportByMonth: false,
              selectedReportItemIndex: null
            })}
            {...rest} {...t}
            isBuffet={isBuffet}

          />
        ) :
        null


      }
      {
        this.state.showPopupReportByQuaterly ?
        (
          <PopupReportByQuaterly
            hide={() => this.setState({
              showPopupReportByQuaterly: false,
              selectedReportItemIndex: null
            })}
            {...rest} {...t}
            isBuffet={isBuffet}

          />
        ) :
        null


      }
      {
        this.state.showPopupReportByYear ?
        (
          <PopupReportByYear
            hide={() => this.setState({
              showPopupReportByYear: false,
              selectedReportItemIndex: null
            })}
            {...rest} {...t}
            isBuffet={isBuffet}

          />
        ) :
        null


      }
      </>


    );
  }
}
