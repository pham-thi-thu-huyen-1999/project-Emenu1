import React from "react";
const CombineInfoIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
  >
    <g id="thong-tin-ghepban" transform="translate(-5 6.105)">
      <path
        id="info-solid"
        d="M.8,16.878h.8V11.131H.8a.8.8,0,0,1-.8-.8v-1.9a.8.8,0,0,1,.8-.8H5.252a.8.8,0,0,1,.8.8v8.444h.8a.8.8,0,0,1,.8.8v1.9a.8.8,0,0,1-.8.8H.8a.8.8,0,0,1-.8-.8v-1.9A.8.8,0,0,1,.8,16.878ZM3.819,0A2.865,2.865,0,1,0,6.684,2.865,2.865,2.865,0,0,0,3.819,0Z"
        transform="translate(21.366 3)"
        fill={props.color ? props.color : '#5E6775'}
      />
      <path
        id="Path_472"
        data-name="Path 472"
        d="M82,230a20,20,0,1,1,14.142-5.858A19.868,19.868,0,0,1,82,230Zm0-37a17,17,0,1,0,17,17A17.019,17.019,0,0,0,82,193Z"
        transform="translate(-57 -196.105)"
        fill={props.color ? props.color : '#5E6775'}
      />
    </g>
  </svg>
);

export default CombineInfoIcon;
