import React from "react";

const CommunicationIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="23"
      viewBox="0 0 24 23"
      fill="none"
      {...props}
    >
      <path
        d="M22.4163 10.9478C22.4163 16.451 17.752 20.9131 11.9997 20.9131C11.3233 20.9139 10.6489 20.8514 9.98448 20.7266C9.50626 20.6368 9.26715 20.5919 9.10022 20.6174C8.93329 20.6429 8.69673 20.7687 8.22362 21.0203C6.88523 21.7321 5.32462 21.9834 3.82375 21.7043C4.3942 21.0026 4.78378 20.1608 4.95569 19.2582C5.05986 18.7062 4.80176 18.1699 4.41518 17.7773C2.6594 15.9944 1.58301 13.5919 1.58301 10.9478C1.58301 5.44447 6.24736 0.982422 11.9997 0.982422C17.752 0.982422 22.4163 5.44447 22.4163 10.9478Z"
        stroke="url(#paint0_linear_7413_3390)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M11.995 11.3994H12.0043M16.157 11.3994H16.1663M7.83301 11.3994H7.84235"
        stroke="url(#paint1_linear_7413_3390)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_7413_3390"
          x1="1.58301"
          y1="11.3991"
          x2="22.4163"
          y2="11.3991"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#77B800" />
          <stop offset="1" stopColor="#4ECDC4" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_7413_3390"
          x1="7.83301"
          y1="11.8994"
          x2="16.1663"
          y2="11.8994"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#77B800" />
          <stop offset="1" stopColor="#4ECDC4" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default CommunicationIcon;
