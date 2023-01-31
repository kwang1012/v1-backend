import * as React from "react";

const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 40 40"
    {...props}
  >
    <path d="M5 37.5A2.503 2.503 0 0 1 2.5 35V5c0-1.378 1.122-2.5 2.5-2.5h30c1.378 0 2.5 1.122 2.5 2.5v30c0 1.378-1.122 2.5-2.5 2.5H5z" />
    <path d="M35 3c1.103 0 2 .897 2 2v30c0 1.103-.897 2-2 2H5c-1.103 0-2-.897-2-2V5c0-1.103.897-2 2-2h30m0-1H5a3 3 0 0 0-3 3v30a3 3 0 0 0 3 3h30a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3z" />
    <path
      d="M3 20.5h6.5l2-4 2 10 4-18 3 24.007 5-18.007 3 11 2-5H37"
      fill="none"
      stroke="#FFF"
      strokeLinejoin="round"
      strokeMiterlimit={10}
    />
  </svg>
);

export default SvgComponent;
