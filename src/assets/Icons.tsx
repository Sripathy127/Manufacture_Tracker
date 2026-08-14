import React from "react";

interface SearchIconProps {
  color?: string;
  className?: string;
}
interface CloseIconProps {
  color?: string;
  className?: string;
}
interface NotStartedIconProps {
  className?: string;
}

export const SearchIcon: React.FC<SearchIconProps> = ({
  color = "#FFFFFF",
  className = "",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      width="20px"
      viewBox="0 -960 960 960"
      fill={color}
      className={className}
    >
      <path d="M765-144 526-383q-30 22-65.79 34.5-35.79 12.5-76.18 12.5Q284-336 214-406t-70-170q0-100 70-170t170-70q100 0 170 70t70 170.03q0 40.39-12.5 76.18Q599-464 577-434l239 239-51 51ZM384-408q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z" />
    </svg>
  );
};

export const CloseIcon: React.FC<CloseIconProps> = ({
  color = "#080D1C",
  className = "",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      width="20px"
      viewBox="0 -960 960 960"
      fill={color}
      className={className}
    >
      <path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z" />
    </svg>
  );
};

// export const NotStartedIcon: React.FC<NotStartedIconProps> = ({
//   className = "",
// }) => {
//   return (
//     <svg
//       width="20"
//       height="20"
//       viewBox="0 0 128 128"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       className={className}
//     >
//       <path
//         d="M64 18
//        A46 46 0 1 1 30 34"
//         stroke="gray"
//         stroke-width="10"
//         stroke-linecap="round"
//         fill="none"
//       />

//       <path
//         d="M64 40 V70 L76 80"
//         stroke="gray"
//         stroke-width="8"
//         stroke-linecap="round"
//         stroke-linejoin="round"
//       />

//       <circle cx="34" cy="34" r="24" stroke="red" fill="white" />

//       <rect x="31" y="18" width="6" height="24" rx="2" fill="red" />
//       <circle cx="34" cy="50" r="4" fill="red" />
//     </svg>
//   );
// };

export const NotStartedIcon: React.FC<NotStartedIconProps> = ({
  className = "",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="#F19E39"
      className={className}
    >
      <path d="M324-168h312v-120q0-65-45.5-110.5T480-444q-65 0-110.5 45.5T324-288v120ZM192-96v-72h60v-120q0-59 28-109.5t78-82.5q-49-32-77.5-82.5T252-672v-120h-60v-72h576v72h-60v120q0 59-28.5 109.5T602-480q50 32 78 82.5T708-288v120h60v72H192Z" />
    </svg>
  );
};
