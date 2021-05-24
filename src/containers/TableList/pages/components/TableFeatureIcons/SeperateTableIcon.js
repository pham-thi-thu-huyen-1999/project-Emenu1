import React from "react";
const SeperateTableIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
  >
    <g id="tach_ban" data-name="tach ban" transform="translate(0 0)">
      <path
        id="Path_460"
        data-name="Path 460"
        d="M1.5,0h11a1.5,1.5,0,0,1,0,3H1.5a1.5,1.5,0,0,1,0-3Z"
        transform="translate(13 18.185)"
        fill={props.color ? props.color : '#5E6775'}
      />
      <path
        id="Path_465"
        data-name="Path 465"
        d="M82,230a20,20,0,1,1,14.142-5.858A19.868,19.868,0,0,1,82,230Zm0-37a17,17,0,1,0,17,17A17.019,17.019,0,0,0,82,193Z"
        transform="translate(-62 -190)"
        fill={props.color ? props.color : '#5E6775'}
      />
    </g>
  </svg>
);

export default SeperateTableIcon;
