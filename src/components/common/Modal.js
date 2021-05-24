import React, { Component } from "react";
import PropTypes from "prop-types";

import { Button } from "./";

export default class Modal extends Component {
  static propTypes = {
    visible: PropTypes.bool,
  };
  render() {
    const {
      onCancel,
      title,
      children,
      visible,
      onOK,
      nBtns,
      success,
    } = this.props;
    if (!visible) {
      return null;
    }
    return (
      <div className="popup mfp-container mfp-s-ready mfp-inline-holder">
        <div className="mfp-content">
          <div
            onClick={onCancel}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          ></div>
          <section id="e-modal" className="popup-box ">
            <button
              title="Close (Esc)"
              type="button"
              className="mfp-close"
              onClick={onCancel}
            >
              ×
            </button>
            <div className={`header ${success ? "success" : ""}`}>
              {success ? "" : title}
            </div>
            {success ? (
              <img
                src={require("../../images/success.png")}
                alt=""
                className="success-ico"
              />
            ) : null}

            {children}
            {nBtns ? null : success ? (
              <aside className="acts grp-btns text-right">
                <Button main onClick={onCancel} className="e-m-right-10">
                  QUAY LẠI{" "}
                </Button>
              </aside>
            ) : (
              <aside className="acts grp-btns text-right">
                <Button main onClick={onCancel} className="e-m-right-10">
                  QUAY LẠI{" "}
                </Button>

                <Button main onClick={onOK} type="s2">
                  ĐỒNG Ý{" "}
                </Button>
              </aside>
            )}
          </section>
        </div>
      </div>
    );
  }
}
