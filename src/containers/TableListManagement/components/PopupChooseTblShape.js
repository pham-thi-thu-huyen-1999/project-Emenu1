import React, { Component } from "react";
import { Button } from "../../../components/common";
import * as CONSTS from "../constants";
export default class PopupChooseTblShape extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seatNumberString: "_" + this.props.seatNumber + ".svg",
      // link gray
      selectedImage: this.props.tableShape,
      // link blue
      selectedLink: this.props.tableShape
        ? this.props.tableShape.replace("gray", "blue")
        : null,
    };
  }

  /**
   * Choose Icon
   */
  onChoose = (value) => {
    this.setState({
      selectedImage: value,
      selectedLink: value.replace("gray", "blue"),
    });
  };

  /**
   * Save table shape
   */
  onSave = () => {
    this.props.onChooseTableShape(this.state.selectedImage);
    this.props.onHide();
  };
  render() {
    const { onHide, t } = this.props;
    let hasShape = false;

    const { selectedImage, selectedLink, seatNumberString } = this.state;

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
              {t("tableManagament.titleOfChooseTable")}
            </h3>
            <section className="choose-table-content">
              <aside className="e-row shape-list">
                {this.props.iconList.map((item, index) => {
                  if (item.icon.includes(seatNumberString)) {
                    hasShape = true;
                    return selectedImage === item.icon ? (
                      <span
                        className="shape-item-list"
                        key={index}
                        onClick={() => {
                          this.onChoose(item.icon);
                        }}
                      >
                        <img src={selectedLink} alt="error" />
                      </span>
                    ) : (
                      <span
                        className="shape-item-list"
                        key={index}
                        onClick={() => {
                          this.onChoose(item.icon);
                        }}
                      >
                        <img src={item.icon} alt="error" />
                      </span>
                    );
                  }
                })}
                {hasShape === false
                  ? this.props.iconList.map((item, index) => {
                      if (item.icon.includes(CONSTS.MAX_ICON)) {
                        return selectedImage === item.icon ? (
                          <span
                            className="shape-item-list"
                            key={index}
                            onClick={() => {
                              this.onChoose(item.icon);
                            }}
                          >
                            <img src={selectedLink} alt="error" />
                          </span>
                        ) : (
                          <span
                            className="shape-item-list"
                            key={index}
                            onClick={() => {
                              this.onChoose(item.icon);
                            }}
                          >
                            <img src={item.icon} alt="error" />
                          </span>
                        );
                      }
                    })
                  : null}
              </aside>

              <aside className="e-row group-btn-table-shape">
                <Button className="e-m-right-5" type="s3" onClick={onHide}>
                  {t("tableManagament.return")}
                </Button>
                <Button className="e-m-left-5" onClick={this.onSave}>
                  {t("tableManagament.save")}
                </Button>
              </aside>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
