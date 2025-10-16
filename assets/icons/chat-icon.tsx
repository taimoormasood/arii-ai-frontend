import React from "react";

const ChatIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="20"
      viewBox="0 0 19 20"
      fill="none"
      {...props}
    >
      <path
        d="M17.8334 9.63633C17.8334 14.0389 14.1019 17.6086 9.50008 17.6086C8.95899 17.6093 8.41945 17.5593 7.88793 17.4594C7.50535 17.3876 7.31407 17.3517 7.18052 17.3721C7.04698 17.3925 6.85773 17.4931 6.47924 17.6944C5.40853 18.2638 4.16004 18.4649 2.95934 18.2415C3.4157 17.6802 3.72737 17.0067 3.8649 16.2847C3.94823 15.8431 3.74175 15.414 3.43249 15.1C2.02786 13.6737 1.16675 11.7516 1.16675 9.63633C1.16675 5.2337 4.89823 1.66406 9.50008 1.66406C14.1019 1.66406 17.8334 5.2337 17.8334 9.63633Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9.49634 10H9.50382M12.8259 10H12.8334M6.16675 10H6.17422"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ChatIcon;
