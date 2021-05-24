import React from "react";
const FoodListIcon = (props) => (
  <svg
    id="danh-sach-mon"
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
  >
    <path
      id="Path_463"
      data-name="Path 463"
      d="M82,230a20,20,0,1,1,14.142-5.858A19.868,19.868,0,0,1,82,230Zm0-37a17,17,0,1,0,17,17A17.019,17.019,0,0,0,82,193Z"
      transform="translate(-62 -190)"
      fill={props.color ? props.color : '#5E6775'}
    />
    <path
      id="Path_466"
      data-name="Path 466"
      d="M1026.464-3180.535c-1.772-.235-1.933-2.594-1.933-2.594h20.3a2.956,2.956,0,0,1-2.336,2.594s-7.089.035-11.839.035C1028.282-3180.5,1026.491-3180.508,1026.464-3180.535Zm.129-3.189q-.011-.209-.011-.418a7.915,7.915,0,0,1,2.387-5.672,8.236,8.236,0,0,1,5.823-2.376h-2a2.648,2.648,0,0,1,.6-1.6,1.866,1.866,0,0,1,1.431-.7,1.865,1.865,0,0,1,1.431.7,2.649,2.649,0,0,1,.6,1.6h-2.054a8.238,8.238,0,0,1,5.824,2.376,7.916,7.916,0,0,1,2.387,5.672q0,.209-.011.418Z"
      transform="translate(-1014.531 3207.5)"
      fill="none"
      stroke={props.color ? props.color : '#5E6775'}
      strokeWidth="2"
    />
  </svg>
);

export default FoodListIcon;
