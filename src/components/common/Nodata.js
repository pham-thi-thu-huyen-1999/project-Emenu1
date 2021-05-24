import React from "react";

export default class NoData extends React.Component {
  render() {
    const { textNodata } = this.props;
    return (
      <div className="no-data-table e-flex content-center">
        <div>
          <img src={require("../../images/no-data.png")} />
          <div className="text">
            <h3 className="text-no-data">
              {textNodata}!
            </h3>
          </div>
        </div>
      </div>
    )
  }
}

NoData.defaultProps = {
  textNodata: "Không tìm thấy dữ liệu"
};