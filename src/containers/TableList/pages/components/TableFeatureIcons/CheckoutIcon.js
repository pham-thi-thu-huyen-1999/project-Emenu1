import React from "react";
const CheckoutIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
  >
    <g id="Group_910" data-name="Group 910" transform="translate(0)">
      <path
        id="Path_463"
        data-name="Path 463"
        d="M82,230a20,20,0,1,1,14.142-5.858A19.868,19.868,0,0,1,82,230Zm0-37a17,17,0,1,0,17,17A17.019,17.019,0,0,0,82,193Z"
        transform="translate(-62 -190)"
        fill={props.color ? props.color : '#5E6775'}
      />
      <path
        id="money-bill-solid"
        d="M19,5.1H1a1,1,0,0,0-1,1v10a1,1,0,0,0,1,1H19a1,1,0,0,0,1-1V6.1A1,1,0,0,0,19,5.1ZM1.5,15.6v-2a2,2,0,0,1,2,2Zm0-7v-2h2A2,2,0,0,1,1.5,8.6ZM10,14.1a2.784,2.784,0,0,1-2.5-3,2.784,2.784,0,0,1,2.5-3,2.784,2.784,0,0,1,2.5,3A2.785,2.785,0,0,1,10,14.1Zm8.5,1.5h-2a2,2,0,0,1,2-2Zm0-7a2,2,0,0,1-2-2h2Z"
        transform="translate(10 8.9)"
        fill={props.color ? props.color : '#5E6775'}
      />
    </g>
  </svg>
);

export default CheckoutIcon;
