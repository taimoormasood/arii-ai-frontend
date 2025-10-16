import * as React from "react";

function HeroSearchDivider(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="2"
      height="62"
      viewBox="0 0 2 62"
      fill="none"
      {...props}
    >
      <path
        d="M1 1L0.999997 61"
        stroke="#9CA3AF"
        strokeLinecap="round"
        strokeDasharray="4 4"
      />
    </svg>
  );
}

export default HeroSearchDivider;
