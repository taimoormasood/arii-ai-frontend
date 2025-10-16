import * as React from "react";

function ErrorAlertIcon(props: React.SVGProps<SVGSVGElement>) {
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
        d="M3.54797 6.45524C5.15709 3.60795 5.96165 2.1843 7.06567 1.81783C7.67304 1.61622 8.32729 1.61622 8.93466 1.81783C10.0387 2.1843 10.8432 3.60795 12.4524 6.45524C14.0615 9.30254 14.866 10.7262 14.6247 11.8862C14.4919 12.5244 14.1648 13.1032 13.6902 13.5398C12.8275 14.3333 11.2184 14.3333 8.00016 14.3333C4.78193 14.3333 3.17281 14.3333 2.31014 13.5398C1.83555 13.1032 1.50842 12.5244 1.37565 11.8862C1.13429 10.7262 1.93885 9.30254 3.54797 6.45524Z"
        stroke="#8A2C0D"
        strokeWidth="1.5"
      />
      <path
        d="M7.9945 10.6666H8.00049"
        stroke="#8A2C0D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 8.66663L8 5.99996"
        stroke="#8A2C0D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ErrorAlertIcon;
