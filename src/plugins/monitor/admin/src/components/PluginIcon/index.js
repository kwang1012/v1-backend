import * as React from "react";

const SvgComponent = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M17.49 2.85H6.51a3.66 3.66 0 0 0-3.66 3.66v10.98a3.66 3.66 0 0 0 3.66 3.66h10.98a3.66 3.66 0 0 0 3.66-3.66V6.51a3.66 3.66 0 0 0-3.66-3.66Z"
      stroke="#8E8EA9"
      strokeWidth={1.699}
      strokeLinecap="round"
    />
    <path
      d="M7.036 12h2.397c.372 0 .73-.148.993-.411l2.07-2.071a1.404 1.404 0 0 1 1.986 0L16.964 12"
      stroke="white"
      strokeWidth={1.699}
      strokeLinecap="round"
    />
  </svg>
);

export default SvgComponent;
