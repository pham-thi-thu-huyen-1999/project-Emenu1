import React from "react";
const QRCodeIcon = (props) => (
  <svg
    id="qr-code"
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
  >
    <path
      id="qrcode-solid"
      d="M0,7.786H6.857V.929H0ZM2.286,3.214H4.571V5.5H2.286ZM9.143.929V7.786H16V.929ZM13.714,5.5H11.429V3.214h2.286ZM0,16.929H6.857V10.071H0Zm2.286-4.571H4.571v2.286H2.286Zm12.571-2.286H16v4.571H12.571V13.5H11.429v3.429H9.143V10.071h3.429v1.143h2.286Zm0,5.714H16v1.143H14.857Zm-2.286,0h1.143v1.143H12.571Z"
      transform="translate(12 11.071)"
      fill={props.color ? props.color : '#5E6775'}
    />
    <path
      id="Path_463"
      data-name="Path 463"
      d="M82,230a20,20,0,1,1,14.142-5.858A19.868,19.868,0,0,1,82,230Zm0-37a17,17,0,1,0,17,17A17.019,17.019,0,0,0,82,193Z"
      transform="translate(-62 -190)"
      fill={props.color ? props.color : '#5E6775'}
    />
  </svg>
);

export default QRCodeIcon;
