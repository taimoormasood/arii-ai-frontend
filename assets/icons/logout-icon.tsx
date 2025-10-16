import * as React from "react";

function LogoutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="20"
      viewBox="0 0 18 20"
      fill="none"
      {...props}
    >
      <path
        d="M4.85276 4.58325C2.83189 5.9269 1.5 8.22454 1.5 10.8333C1.5 14.9754 4.85786 18.3333 9 18.3333C13.1421 18.3333 16.5 14.9754 16.5 10.8333C16.5 8.22454 15.1681 5.9269 13.1472 4.58325"
        stroke="#6B7280"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 1.6665V8.33317"
        stroke="#6B7280"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default LogoutIcon;
