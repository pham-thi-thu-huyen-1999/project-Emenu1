import React from "react";
const Atm = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40.001"
    viewBox="0 0 40 40.001"
  >
    <g id="Group_1702" data-name="Group 1702" transform="translate(-28 -610)">
      <g id="Group_945" data-name="Group 945" transform="translate(28 610)">
        <path
          id="Path_464"
          data-name="Path 464"
          d="M82,230a20,20,0,1,1,14.142-5.858A19.869,19.869,0,0,1,82,230Zm0-37a17,17,0,1,0,17,17A17.02,17.02,0,0,0,82,193Z"
          transform="translate(-62 -190)"
          fill={props.color ? props.color : '#5E6775'}
        />
      </g>
      <path
        id="money-check-solid"
        d="M0,11.2a.8.8,0,0,0,.8.8H15.2a.8.8,0,0,0,.8-.8v-8H0ZM11.2,6a.4.4,0,0,1,.4-.4H14a.4.4,0,0,1,.4.4v.8a.4.4,0,0,1-.4.4H11.6a.4.4,0,0,1-.4-.4Zm0,3a.2.2,0,0,1,.2-.2h2.8a.2.2,0,0,1,.2.2v.4a.2.2,0,0,1-.2.2H11.4a.2.2,0,0,1-.2-.2ZM1.6,6.6a.2.2,0,0,1,.2-.2H9.4a.2.2,0,0,1,.2.2V7a.2.2,0,0,1-.2.2H1.8A.2.2,0,0,1,1.6,7ZM1.6,9a.2.2,0,0,1,.2-.2H6.2a.2.2,0,0,1,.2.2v.4a.2.2,0,0,1-.2.2H1.8a.2.2,0,0,1-.2-.2ZM15.6.8H.4a.4.4,0,0,0-.4.4V2.4H16V1.2A.4.4,0,0,0,15.6.8Z"
        transform="translate(40 623.6)"
        fill={props.color ? props.color : '#5E6775'}
      />
    </g>
  </svg>
);

export default Atm;
