import React from "react";
const ChangeAvailableTable = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
  >
    <g id="chuyen-ban" transform="translate(0 0)">
      <path
        id="dolly-flatbed-solid"
        d="M22.956,14.127H4.709V.589A.59.59,0,0,0,4.12,0H.589A.59.59,0,0,0,0,.589V1.766a.59.59,0,0,0,.589.589H2.354V15.893a.59.59,0,0,0,.589.589h3.05a1.739,1.739,0,0,0-.107.589,1.766,1.766,0,0,0,3.532,0,1.834,1.834,0,0,0-.107-.589h7.28a1.739,1.739,0,0,0-.107.589,1.766,1.766,0,0,0,3.532,0,1.834,1.834,0,0,0-.107-.589h3.046a.59.59,0,0,0,.589-.589V14.715A.59.59,0,0,0,22.956,14.127Z"
        transform="translate(8 12.164)"
        fill={props.color ? props.color : '#5E6775'}
      />
      <path
        id="file-solid"
        d="M6.721,4.081V0h-6A.718.718,0,0,0,0,.72V14.643a.718.718,0,0,0,.72.72H10.8a.718.718,0,0,0,.72-.72V4.8H7.441A.722.722,0,0,1,6.721,4.081Zm4.8-.423v.183H7.681V0h.183a.72.72,0,0,1,.51.21l2.938,2.941A.718.718,0,0,1,11.522,3.658Z"
        transform="translate(16.434 9.333)"
        fill={props.color ? props.color : '#5E6775'}
      />
      <path
        id="Path_463"
        data-name="Path 463"
        d="M82,230a20,20,0,1,1,14.142-5.858A19.868,19.868,0,0,1,82,230Zm0-37a17,17,0,1,0,17,17A17.019,17.019,0,0,0,82,193Z"
        transform="translate(-62 -190)"
        fill={props.color ? props.color : '#5E6775'}
      />
    </g>
  </svg>
);

export default ChangeAvailableTable;
