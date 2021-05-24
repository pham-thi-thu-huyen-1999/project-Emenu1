import React, { Component } from "react";
import QRCode from "qrcode.react";
import LogoImage from "../../images/logo-qr-code.svg";

class QRcodeGenerator extends Component {
  render() {
    const { value, size, bgColor, fgColor, level } = this.props;
    return (
      <QRCode
        value={value}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        level={level}
        includeMargin={false}
        renderAs={"svg"}
        imageSettings={{
          src: LogoImage,
          x: null,
          y: null,
          height: 70,
          width: 70,
          excavate: true
        }}
      />
    );
  }
}

QRcodeGenerator.defaultProps = {
  size: 300,
  value: "dfdf",
  fgColor: "#000000",
  bgColor: "#FFFFFF",
  level: "H",
};

export default QRcodeGenerator;
