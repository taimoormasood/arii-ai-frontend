import React from "react";

const PlusGreenIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <path
        d="M10 4.5C10 4.22386 9.77614 4 9.5 4C9.22386 4 9 4.22386 9 4.5V9H4.5C4.22386 9 4 9.22386 4 9.5C4 9.77614 4.22386 10 4.5 10H9V14.5C9 14.7761 9.22386 15 9.5 15C9.77614 15 10 14.7761 10 14.5V10H14.5C14.7761 10 15 9.77614 15 9.5C15 9.22386 14.7761 9 14.5 9H10V4.5Z"
        fill="#6CA700"
      />
    </svg>
  );
};

export default PlusGreenIcon;
