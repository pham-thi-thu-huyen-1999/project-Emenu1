import React, { Component } from "react";
import Styles from "../../scss/TableList.module.scss";
import _ from 'lodash';

class AreaListDetailModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedArea: null
    };
  }

  componentDidMount() {
    this.setState({
      selectedArea: this.props.selectedArea
    })
  }

  /**
   * Toggle select area
   */
  toggleSelectArea = (area) => {
    if (this.state.selectedArea) {
      if (this.state.selectedArea.id !== area.id) {
        this.setState({
          selectedArea: area
        })
      }
    }
  }

  /**
   * Render area items
   */
  renderAreaItem = () => {
    const {listArea} = this.props;
    let areaItems = []
    if (!_.isEmpty(listArea)) {
      listArea.map(area => {
        return areaItems.push(
          <div
            key={area.id}
            className={`${Styles["area-item"]} ${this.state.selectedArea && area.id === this.state.selectedArea.id ? Styles["active"] : ''}`}
            onClick={this.toggleSelectArea.bind(this, area)}
          >
            <div className={Styles["area-name"]}>
              <div className={Styles["area-name-text"]}>{ area.name }</div>
            </div>
            <div className={Styles["area-smoking-label"]}>
              <span
                className={`${area.is_smoke ? 'icon-smoking ' + Styles["icon-smoking-custom"] : 'icon-non-smoking ' + Styles["icon-non-smoking-custom"]}`}
              ></span>
            </div>
            <div className={Styles["area-info"]}>
              <div className={Styles["info-container"]}>
                <p>{`${this.props.trans("area_management:area_statistics.available_table")}: ${area.table_empty ? area.table_empty : 0}`}</p>
                <p>{`${this.props.trans("area_management:area_statistics.in_use_table")}: ${area.table_used ? area.table_used : 0}`}</p>
                <p>{`${this.props.trans("area_management:area_statistics.vip_table")}: ${area.table_vip ? area.table_vip : 0}`}</p>
                <p>{`${this.props.trans("area_management:area_statistics.normal_table")}: ${area.table_normal ? area.table_normal : 0}`}</p>
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
    this.props.toggleAreaModalSelection();
  }

  /**
   * Select area
   */
  confirmSelectArea = () => {
    if (this.state.selectedArea && this.state.selectedArea.id !== this.props.selectedArea.id) {
      this.props.selectArea(this.state.selectedArea)
    }
    this.closeModal();
  }

  render() {
    // Normalize translation
    const trans = this.props.trans;

    return (
      <div className={`popup mfp-container mfp-s-ready mfp-inline-holder ${Styles["modal-container"]}`}>
        <div className={`mfp-content ${Styles["modal-wrapper"]} ${Styles["modal-area-list"]}`}>
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
