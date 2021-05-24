import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { TYPE_PROMOTION } from "../../../../consts/settings/promotion";
import { faPencilAlt, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
export default class TableItem extends Component {
  // loadTypeProm = (str) => {
  //   return (TYPE_PROMOTION.find((item) => {
  //     return str === item.text
  //   }) || { key: '' }).key
  // }

  dateFormat = (day) => {
    if (!day) {
      return;
    }
    const d = new Date(day);
    const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    const mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d);
    const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);

    return `${da}-${mo}-${ye}`;
  };

  render() {
    const { index, promotionInfo, Edit, Delete } = this.props;

    return (
      <ul className="row-tbl">
        <li style={{ width: 50 }}>{index}</li>
        <li className="col-name">{promotionInfo.name}</li>
        <li style={{ width: 140 }}>
          {this.dateFormat(promotionInfo.date_start)}
        </li>
        <li style={{ width: 140 }}>
          {this.dateFormat(promotionInfo.date_end)}
        </li>
        <li className="col-type">{promotionInfo.promotion_type_name}</li>
        <li className="col-status">
          {promotionInfo.is_active ? "Kích hoạt" : "Chưa kích hoạt"}
        </li>
        <li className="col-acts acts grp-btns flex-view middle">
          <div
            className="s-btn s1 edit-btn"
            style={{ marginRight: 5 }}
            onClick={() => Edit(promotionInfo)}
          >
            <FontAwesomeIcon icon={faPencilAlt} />{" "}
            <span className="btn-name">Sửa</span>
          </div>
          <div
            className="s-btn s2 delete-btn"
            onClick={() => Delete(promotionInfo)}
          >
            <FontAwesomeIcon icon={faTimesCircle} />{" "}
            <span className="btn-name">Xóa</span>
          </div>
        </li>
      </ul>
    );
  }
}
