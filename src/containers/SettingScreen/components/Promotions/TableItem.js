import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { TYPE_PROMOTION } from "../../../../consts/settings/promotion";
import {
  faPencilAlt,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
export default class TableItem extends Component {

  // loadTypeProm = (str) => {
  //   return (TYPE_PROMOTION.find((item) => {
  //     return str === item.text
  //   }) || { key: '' }).key
  // }

  render() {
    const {
      index,
      name,
      startDate,
      endDate,
      typeProm,
      status,
      Edit,
      Delete
    } = this.props

    //  const typeNum = this.loadTypeProm(typeProm)
    return (
        <ul className="row-tbl">
          <li style={{width:50}}>{index}</li>
          <li className="col-name">{name}</li>
          <li style={{width: 130}}>{startDate}</li>
          <li style={{width: 130}}>{endDate}</li>
          <li className="col-type">{typeProm}</li>
          <li className="col-status">{status}</li>
          <li className="col-acts acts grp-btns flex-view middle">
            <div className="s-btn s1 edit-btn" style={{marginRight: 5}}
             onClick={() =>
              Edit({
                index,
                name,
                startDate,
                endDate,
                typeProm,
                status
              })
            }
            >
              <FontAwesomeIcon icon={faPencilAlt} /> <span className="btn-name">Sửa</span>
            </div>
            <div className="s-btn s2 delete-btn"  onClick={() => Delete({index, name})} >
              <FontAwesomeIcon icon={faTimesCircle} /> <span className="btn-name">Xóa</span>
            </div>
          </li>
        </ul>
    );
  }
}
