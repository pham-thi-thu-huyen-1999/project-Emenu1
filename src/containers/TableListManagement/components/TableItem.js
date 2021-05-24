import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTimesCircle,
  faSyncAlt
} from "@fortawesome/free-solid-svg-icons";

import { TABLE_TYPES } from '../constants';

export default class TableItem extends Component {
  render() {
    const { table, index, Delete, Edit, Detail, t } = this.props;
    return (
      <ul className="row-its">
        <li className="no">{index}</li>
        <li className="tbl-name">{table.name}</li>
        <li className="room">
          {table.table_type_id === TABLE_TYPES.vip
            ? t("tableType.vip")
            : t("tableType.normal")}
        </li>
        <li className="qty">{table.seat_number} người</li>
        <li className="status">
          {table.status
            ? t("tableManagament.use")
            : t("tableManagament.notUse")}
        </li>
        <li className="acts grp-btns flex-view middle">
          <div className="s-btn" onClick={() => Detail(table)}>
            <FontAwesomeIcon icon={faSyncAlt} /> {t("tableManagament.detail")}
          </div>
          <div className="s-btn s1 edit-btn" onClick={() => Edit(table)}>
            <FontAwesomeIcon icon={faPencilAlt} /> {t("tableManagament.edit")}
          </div>
          <div className="s-btn s2 delete-btn" onClick={() => Delete(table)}>
            <FontAwesomeIcon icon={faTimesCircle} />{" "}
            {t("tableManagament.delete")}
          </div>
        </li>
      </ul>
    );
  }
}
