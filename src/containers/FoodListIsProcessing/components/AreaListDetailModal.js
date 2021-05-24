import React, { Component } from "react";
import Styles from "./ModalArea.module.scss";
import _ from 'lodash';

class AreaListDetailModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedArea: props.areaIndex.length > 0 ? props.areaIndex : [],
      areaList: props.areaList,
    };
  }



  /**
   * Toggle select area
   */
  toggleSelectArea = (areaIndex) => {
    if (this.state.selectedArea.length === 0 || this.state.selectedArea.includes(areaIndex) === false) {
      this.setState({ selectedArea: this.state.selectedArea.concat(areaIndex) })
    } else {
      this.setState({ selectedArea: this.state.selectedArea.filter(selectedAreaIndex => selectedAreaIndex !== areaIndex) })
    }
  }

  /**
   * Render area items
   */
  renderAreaItem = () => {
    const { areaList } = this.state;
    let areaItems = []
    if (!_.isEmpty(areaList)) {
      areaList.map((area, index) => {
        return areaItems.push(
          <div
            key={area.id}
            className={`${Styles["area-item"]} ${this.state.selectedArea && this.state.selectedArea.includes(index) === true ? Styles["active"] : ''}`}
            onClick={this.toggleSelectArea.bind(this, index)}
          >
            <div className={Styles["area-name"]}>
              {area.name}
            </div>
            <div className={Styles["area-smoking-label"]}>
              <span
                className={`${area.is_smoke ? 'icon-smoking ' + Styles["icon-smoking-custom"] : 'icon-non-smoking ' + Styles["icon-non-smoking-custom"]}`}
              ></span>
            </div>
            <div className={Styles["area-info"]}>
              <div className={Styles["info-container"]}>
                <p>{`${this.props.trans("area_management:area_statistics.available_table")}: ${area.table_empty}`}</p>
                <p>{`${this.props.trans("area_management:area_statistics.in_use_table")}: ${area.table_used}`}</p>
                <p>{`${this.props.trans("area_management:area_statistics.vip_table")}: ${area.table_vip}`}</p>
                <p>{`${this.props.trans("area_management:area_statistics.normal_table")}: ${area.table_normal}`}</p>
              </div>
            </div>
          </div>
        )
      })
    }

    if (_.isEmpty(areaItems)) {
      areaItems = null;
    }
    return areaItems;
  }

  /**
   * Close modal
   */
  closeModal = () => {
    this.props.hide();
  }

  /**
   * Select area
   */
  confirmSelectArea = () => {
    this.props.selectArea(this.state.selectedArea)
    this.closeModal();
  }

  render() {
    // Normalize translation
    const trans = this.props.trans;

    return (
      <div className={`popup mfp-container mfp-s-ready mfp-inline-holder ${Styles["modal-container"]}`}>
        <div className={`mfp-content ${Styles["modal-wrapper"]}`}>
          <div className={Styles["modal-header-title"]}>
            <span>
              {
                trans("table_list:area_list_modal_title")
              }
            </span>
          </div>
          <div className={Styles["modal-content-wrapper"]}>
            {
              this.renderAreaItem()
            }
          </div>
          <div className={Styles["modal-action-buttons"]}>
            <button onClick={this.closeModal.bind(this)} className={`${Styles["button"]} ${Styles["cancel"]}`} type="button">Trở về</button>
            <button onClick={this.confirmSelectArea.bind(this)} className={Styles["button"]} type="button">Chọn</button>
          </div>
        </div>
      </div>
    );
  }
}

export default AreaListDetailModal;
