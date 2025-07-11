import { SvgIconProps, SvgIcon } from "@mui/material";

export interface SvgIconPropsPlus extends SvgIconProps {
  customcolor?: string;
  customsize?: "small" | "large";
}

export const Image_Icon: React.FC<SvgIconPropsPlus> = (props) => (
  <SvgIcon
    {...props}
    sx={{
      width: "24px",
      height: "24px",
    }}
    viewBox="0 0 24 24"
  >
    <>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_5471_29718"
          // style="mask-type:alpha"
          // maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect
            width="24"
            height="24"
            fill={props.customcolor ? props.customcolor : "#AAAAAA"}
          />
        </mask>
        <g mask="url(#mask0_5471_29718)">
          <path
            d="M5 22C4.16667 22 3.45833 21.7083 2.875 21.125C2.29167 20.5417 2 19.8333 2 19V5C2 4.16667 2.29167 3.45833 2.875 2.875C3.45833 2.29167 4.16667 2 5 2H19C19.8333 2 20.5417 2.29167 21.125 2.875C21.7083 3.45833 22 4.16667 22 5V19C22 19.8333 21.7083 20.5417 21.125 21.125C20.5417 21.7083 19.8333 22 19 22H5ZM5 20H19C19.2833 20 19.5207 19.904 19.712 19.712C19.904 19.5207 20 19.2833 20 19V5C20 4.71667 19.904 4.479 19.712 4.287C19.5207 4.09567 19.2833 4 19 4H5C4.71667 4 4.479 4.09567 4.287 4.287C4.09567 4.479 4 4.71667 4 5V19C4 19.2833 4.09567 19.5207 4.287 19.712C4.479 19.904 4.71667 20 5 20ZM6 18L10 14L11.8 15.775L14 13L18 18H6ZM8 10C7.45 10 6.97933 9.804 6.588 9.412C6.196 9.02067 6 8.55 6 8C6 7.45 6.196 6.97933 6.588 6.588C6.97933 6.196 7.45 6 8 6C8.55 6 9.021 6.196 9.413 6.588C9.80433 6.97933 10 7.45 10 8C10 8.55 9.80433 9.02067 9.413 9.412C9.021 9.804 8.55 10 8 10Z"
            fill={props.customcolor ? props.customcolor : "#AAAAAA"}
          />
        </g>
      </svg>
    </>
  </SvgIcon>
);
