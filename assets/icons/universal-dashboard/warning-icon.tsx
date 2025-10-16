import React from "react";

const WarningIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.54748 6.45561C5.1566 3.60832 5.96116 2.18467 7.06518 1.8182C7.67255 1.61659 8.3268 1.61659 8.93417 1.8182C10.0382 2.18467 10.8428 3.60832 12.4519 6.45561C14.061 9.3029 14.8655 10.7266 14.6242 11.8866C14.4914 12.5247 14.1643 13.1036 13.6897 13.5401C12.827 14.3337 11.2179 14.3337 7.99967 14.3337C4.78144 14.3337 3.17232 14.3337 2.30965 13.5401C1.83506 13.1036 1.50793 12.5247 1.37516 11.8866C1.1338 10.7266 1.93836 9.3029 3.54748 6.45561Z"
        stroke="#723B13"
        strokeWidth="1.5"
      />
      <path
        d="M7.99499 10.667H8.00098"
        stroke="#723B13"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 8.66699L8 6.00033"
        stroke="#723B13"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default WarningIcon;
