import * as React from "react";

function SuccessAlertIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <path
        d="M14.6668 8.00002C14.6668 4.31812 11.6821 1.33335 8.00016 1.33335C4.31826 1.33335 1.3335 4.31812 1.3335 8.00002C1.3335 11.6819 4.31826 14.6667 8.00016 14.6667C11.6821 14.6667 14.6668 11.6819 14.6668 8.00002Z"
        stroke="#03543F"
        strokeWidth="1.5"
      />
      <path
        d="M5.3335 8.33333L7.00016 10L10.6668 6"
        stroke="#03543F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default SuccessAlertIcon;
