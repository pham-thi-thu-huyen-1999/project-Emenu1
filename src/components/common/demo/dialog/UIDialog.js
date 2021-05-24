import React, { Component } from 'react';
import Share from '../Share';
import { PROPERTY } from '../../../../consts/settings/ui/dialog';
import Dialog from '../../Dialog';

class UIDialog extends Component {
  state = {
    show: false
  }
  toggle = (show) => {
    this.setState({ show })
  }
  render() {
    const { show } = this.state
    return (
      <Share propertys={PROPERTY}>
        <button className="button-default" onClick={() => this.toggle(true)}>Show Modal</button>
        <Dialog
          show={show}
          close={() => this.toggle(false)}
          innerClass="small-size"
          title="THÊM SUẤT ĂN"
        >
          <div>
            <aside className="acts text-center">
              <div className="main-btn close-popup-btn">QUAY LẠI</div><div className="main-btn s2">THÊM</div>
            </aside>
          </div>
        </Dialog>
      </Share>
      )
  }
}

export default UIDialog;
