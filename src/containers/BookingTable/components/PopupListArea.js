import React from "react";
import Button from "../../../components/common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmokingBan } from "@fortawesome/free-solid-svg-icons";
export default class SelectArea extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: props.indexArea,
      idArea: "",
      area: {}
    }
  }
  saveSelectArea = (area) => {
    this.props.actions.getListTableStatus({
      table_status: 0, area_id: this.state.idArea
    })
    this.props.saveSelectArea(area)
    this.props.hidePopupArea();
  }
  render() {
    const { t } = this.props
    const { selected, area } = this.state
    return (
      <>
        <div className="list-area e-row">
          {
            this.props.areaListDetails.map((area, index) => {
              let areaGeneral = area.area_general
              return <div key={index} className="e-col-3 item"
                onClick={() => this.setState({
                  selected: index, idArea: area.id, area
                })}
              >
                <li
                  className={selected !== index ? "item-area bg-noActive" : "item-area active"}
                >
                  <div className="head-name e-flex content-center item-center">
                    <span className="name-area">{area.name}</span>
                    <span className="icon-status">
                      {!area.is_smoke ?
                        <FontAwesomeIcon icon={faSmokingBan} />
                        : null
                      }</span>
                  </div>
                  <div className="info-area">
                    <div className="show-info">
                      <span>{t("bookingTables.numberTableEmpty")}: {areaGeneral.table_empty}</span><br></br>
                      <span>{t("bookingTables.numberTableUsing")}: {areaGeneral.table_used}</span><br></br>
                      <span>{t("bookingTables.vipTable")}: {areaGeneral.table_vip}</span><br></br>
                      <span>{t("bookingTables.normalTable")}: {areaGeneral.table_normal}</span>
                    </div>
                  </div>
                </li>
              </div>
            })
          }
        </div>
        <div className="btn-dialog-list-table e-m-top-10">
          <div className="e-dialog-footer e-flex content-center">
            <Button type="s3" style={{ marginRight: "10px" }}
              onClick={() => this.props.hidePopupArea()}>{t("bookingTables.back")}</Button>
            <Button onClick={() => this.saveSelectArea(area)}>{t("bookingTables.selectArea")}</Button>
          </div>
        </div>
      </>
    )
  }
}