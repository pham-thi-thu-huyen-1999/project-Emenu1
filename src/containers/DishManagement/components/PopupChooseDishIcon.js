import React, { Component } from "react";
import { Button } from "../../../components/common";
export default class PopupChooseDishIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImage: this.props.DishIcon,
    };
  }

  /**
   * Choose Icon
   */
  onChoose = (value) => {
    this.setState({
      selectedImage: value,
    });
  };

  /**
   * Save table shape
   */
  onSave = () => {
    this.props.onChooseDishIcon(this.state.selectedImage);
    this.props.onHide();
  };
  render() {
    const { onHide, t } = this.props;

    const { selectedImage } = this.state;

    return (
      <div className="popup popup-choose-table-shape mfp-container mfp-s-ready mfp-inline-holder">
        <div className="mfp-content mfp-content-table">
          <div className=" popup-box popup-add-new">
            <button
              title="Close (Esc)"
              type="button"
              className="mfp-close"
              onClick={onHide}
            >
              ×
            </button>
            <h3 className="sec-tit text-center">
              {t("dishManagament.titleOfChooseDishIcon")}
            </h3>
            <section className="choose-table-content">
              <aside className="e-row shape-list">
                {this.props.dishIconList.map((item, index) => {
                  if (item.icon) {
                    return selectedImage === item.icon ? (
                      <span
                        className="shape-item-list comboIcon choosed"
                        key={index}
                        onClick={() => {
                          this.onChoose(item.icon);
                        }}
                      >
                        <img src={selectedImage} alt="error" className="comboIconImg"/>
                      </span>
                    ) : (
                      <span
                        className="shape-item-list comboIcon"
                        key={index}
                        onClick={() => {
                          this.onChoose(item.icon);
                        }}
                      >
                        <img src={item.icon} alt="error" className="comboIconImg"/>
                      </span>
                    );
                  }
                })}
              </aside>

              <aside className="e-row group-btn-table-shape">
                <Button className="e-m-right-5" type="s3" onClick={onHide}>
                  {t("dishManagament.back")}
                </Button>
                <Button className="e-m-left-5" onClick={this.onSave}>
                  {t("dishManagament.save")}
                </Button>
              </aside>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
