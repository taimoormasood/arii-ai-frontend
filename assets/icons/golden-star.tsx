import React from "react";

const GoldenStar = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.76025 1.5625C8.13525 0.8125 9.19775 0.84375 9.5415 1.5625L11.604 5.71875L16.1665 6.375C16.979 6.5 17.2915 7.5 16.6978 8.09375L13.4165 11.3125L14.1978 15.8438C14.3228 16.6562 13.4478 17.2812 12.729 16.9062L8.6665 14.75L4.57275 16.9062C3.854 17.2812 2.979 16.6562 3.104 15.8438L3.88525 11.3125L0.604004 8.09375C0.0102539 7.5 0.322754 6.5 1.13525 6.375L5.729 5.71875L7.76025 1.5625Z"
        fill="#E59819"
      />
    </svg>
  );
};

export default GoldenStar;
