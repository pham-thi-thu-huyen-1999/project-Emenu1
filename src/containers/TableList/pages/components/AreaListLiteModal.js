import React, { Component } from "react";
import Styles from "../../scss/TableList.module.scss";
import _ from 'lodash';

class AreaListLiteModal extends Component {
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
            className={`${Styles["area-item"]} ${Styles["area-lite-item"]} ${this.state.selectedArea && area.id === this.state.selectedArea.id ? Styles["active"] : ''}`}
            onClick={this.toggleSelectArea.bind(this, area)}
          >
            <div className={Styles["area-name"]}>
              { area.name }
            </div>
            <div className={Styles["area-smoking-label"]}>
              <span
                className={`${area.is_smoke ? 'icon-smoking ' + Styles["icon-smoking-custom"] : 'icon-non-smoking ' + Styles["icon-non-smoking-custom"]}`}
              ></span>
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
        <div className={`mfp-content ${Styles["modal-wrapper"]}`} style={{width: '600px'}}>
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
            <button onClick={this.closeModal.bind(this)} className={`${Styles["button"]} ${Styles["cancel"]}`} type="button">
              {
                trans("table_list:back")
              }
            </button>
            <button onClick={this.confirmSelectArea.bind(this)} className={Styles["button"]} type="button">
              {
                trans("table_list:choose")
              }
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default AreaListLiteModal;
