import React from "react";

const TenantAvatar = (props: React.SVGProps<SVGSVGElement>) => {
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
        d="M4.48131 11.8987C3.30234 12.6007 0.211137 14.0342 2.09388 15.8279C3.01359 16.7041 4.03791 17.3307 5.32572 17.3307H12.6743C13.9621 17.3307 14.9864 16.7041 15.9061 15.8279C17.7889 14.0342 14.6977 12.6007 13.5187 11.8987C10.754 10.2525 7.24599 10.2525 4.48131 11.8987Z"
        stroke="#6B7280"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.75 4.41406C12.75 6.48513 11.0711 8.16406 9 8.16406C6.92893 8.16406 5.25 6.48513 5.25 4.41406C5.25 2.34299 6.92893 0.664062 9 0.664062C11.0711 0.664062 12.75 2.34299 12.75 4.41406Z"
        stroke="#6B7280"
        strokeWidth="1.2"
      />
    </svg>
  );
};

export default TenantAvatar;
