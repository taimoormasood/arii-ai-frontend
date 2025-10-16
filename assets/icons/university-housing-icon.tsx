import React from "react";

// Define props including the custom `active` prop
interface IconProps extends React.SVGProps<SVGSVGElement> {
  active?: boolean;
}

const UniversityHousingIcon: React.FC<IconProps> = ({
  active = false,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      {...props}
    >
      <path
        d="M1 21L20.5 21"
        stroke={active ? "#6CA700" : "#6B7280"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12L2 21M20 12L20 21"
        stroke={active ? "#6CA700" : "#6B7280"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 7L6.5 21M15.5 7L15.5 21"
        stroke={active ? "#6CA700" : "#6B7280"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 12L6 12M21 12L16 12"
        stroke={active ? "#6CA700" : "#6B7280"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 7L16.5 7"
        stroke={active ? "#6CA700" : "#6B7280"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 7L11 3.98221M11 3.98221V1.97035C11 1.49615 11 1.25905 11.1464 1.11173C11.6061 0.649394 13.5 1.74303 14.2203 2.18653C14.8285 2.56105 15 3.30914 15 3.98221L11 3.98221Z"
        stroke={active ? "#6CA700" : "#6B7280"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 21L11 19"
        stroke={active ? "#6CA700" : "#6B7280"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 11L9.5 11.5M12.5 11V11.5"
        stroke={active ? "#6CA700" : "#6B7280"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 15L9.5 15.5M12.5 15V15.5"
        stroke={active ? "#6CA700" : "#6B7280"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default UniversityHousingIcon;
