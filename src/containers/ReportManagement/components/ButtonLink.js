import React, { Component } from "react";
class ButtonLink extends Component {
  render() {
    const dataLink = this.props.data;
    const { selectedReportItemIndex, selectItem, t } = this.props;
    return (
      <ul id="report-manager-menu">
        {
          dataLink.length > 0 ?
            dataLink.map((item, index) => {
              return (
                <li key={index} onClick={() => selectItem(item.id)}>
                  <span className={selectedReportItemIndex === index ? "report-item report-item--clicked" : "report-item"}>
                    <span className="wrap">
                      <span className="ico">
                        <img src={item.iconImg} alt="" />
                      </span>
                      <span className="money" style={{ textTransform: "uppercase" }}>
                        {t(item.income)}
                      </span>
                      <span className="txt" style={{ textTransform: "uppercase" }}>
                        {t(item.name)}
                      </span>
                    </span>
                  </span>
                </li>
              );
            }) : <h3 className="text-no-data e-flex content-center">
              {t("dishManagaments.noData")}!
            </h3>
        }
      </ul>
    );
  }
}

export default ButtonLink;
