import React, { Component } from "react";
import { Dialog, Button } from "./";

class PopupConfirm extends Component {
  render() {
    const { show, close, content, confirm, t } = this.props;
    return (
      <Dialog show={show} close={close} innerClass="small-size">
        <h3 className="text-center">{content} </h3>
        <aside className="acts text-center">
          <Button type="s3" onClick={close} style={{ marginRight: 5 }}>
            {t("user.back")}
          </Button>
          <Button
            onClick={() => {
              confirm();
              close();
            }}
          >
            {t("user.save")}
          </Button>
        </aside>
      </Dialog>
    );
  }
}
export default PopupConfirm;
