import React, { Component } from "react";

export default class PopupDeletetbl extends Component {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("click", this.handleClick);
  }

  componentWillUnmount() {
    // important
    document.removeEventListener("click", this.handleClick);
  }
  handleClick = event => {
    const { target } = event;
    if (this.wrapperRef.current === null) {
      return;
    }
    if (!this.wrapperRef.current.contains(target)) {
      this.props.hide();
    }
  };

  handleClickOk = () => {
    this.props.deleteOk();
    this.props.hide();
  };

  render() {
    const { hide, PromotionInf } = this.props;
    return (
      <div className="popup">
        <div
          id="popup-delete-dish"
          className="popup-box medium-size left-close-btn text-center"
          ref={this.wrapperRef}
          style={{ top: "25%" }}
        >
          <button
            title="Close (Esc)"
            type="button"
            className="mfp-close"
             onClick={hide}
          >
            ×
          </button>
          <h3 className="main-tit">BẠN MUỐN XÓA CHƯƠNG TRÌNH NÀY</h3>
          <h4 className="">{`"${PromotionInf.name}"`}</h4>
          <aside className="msgbox grp-btns">
            <div
              className="main-btn s2 close-popup-btn"
               onClick={hide}
              style={{ marginRight: 5 }}
            >
              CANCEL
            </div>
            <div className="main-btn" onClick={this.handleClickOk}>
              OK
            </div>
          </aside>
        </div>
      </div>
    );
  }
}