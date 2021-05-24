import React, { Component } from "react";
import Share from "../Share";
import { PROPERTY } from "../../../../consts/settings/ui/modal";
import Modal from "../../Modal";
import Button from "../../Button";

class UIModal extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    console.log(this.state.visible);

    return (
      <Share propertys={PROPERTY}>
        <Button onClick={this.showModal}>Open Modal</Button>
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onCancel={this.handleCancel}
        >
          <div>123</div>
        </Modal>
      </Share>
    );
  }
}

export default UIModal;
