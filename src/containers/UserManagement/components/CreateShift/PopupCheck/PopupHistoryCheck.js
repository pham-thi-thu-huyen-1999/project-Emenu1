import React from "react";
import { TableData } from "../../../../../components/common";

export default class PopupHistory extends React.Component {
  render() {
    const { t } = this.props
    const TABLE_SETTING = {
      heads: [
        {
          text: `${t("user.createShift.timeUpdate")}`,
          width: "25%"
        },
        {
          text: `${t("user.createShift.status")}`,
          width: "25%"
        },
        {
          text: `${t("user.createShift.content")}`,
          width: "25%"
        },
        {
          text: `${t("user.createShift.byUpdate")}`,
          width: "25%"
        }
      ],
      columns: [
        {
          key: 'timeUpdate',
          render: (item, index) => (
            <span>{index + 1}</span>
          ),
          width: "25%"
        },
        {
          key: "status",
          render: item => (
            <span>{item.status === 1 ? `${t("user.createShift.create")}` : item.status === 2 ? `${t("user.createShift.update")}` : `${t("user.createShift.delete")}`}</span>
          ),
          width: "25%"
        },
        {
          key: "description",
          width: "25%"
        },
        {
          key: 'byUpdate',
          render: item => (
            <span>{item.UpdateUser ? item.UpdateUser.full_name : ""}</span>
          ),
          width: "25%"
        }
      ]
    }
    return (
      <div className="tbls-history">
        <TableData
          dataSources={this.props.listCheckHistory}
          option={TABLE_SETTING}
          onMore={this.onMore}
        />
      </div>
    )
  }
}