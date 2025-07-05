import { SvgIconProps, SvgIcon } from "@mui/material";

export interface SvgIconPropsPlus extends SvgIconProps {
  customcolor?: string;
  customsize?: "small" | "large";
}

export const Pdf_Icon: React.FC<SvgIconPropsPlus> = (props) => (
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
          id="mask0_5471_29712"
          // style="mask-type:alpha"
          maskUnits="userSpaceOnUse"
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
        <g mask="url(#mask0_5471_29712)">
          <path
            d="M9 12.5H10V10.5H11C11.2833 10.5 11.521 10.404 11.713 10.212C11.9043 10.0207 12 9.78333 12 9.5V8.5C12 8.21667 11.9043 7.979 11.713 7.787C11.521 7.59567 11.2833 7.5 11 7.5H9V12.5ZM10 9.5V8.5H11V9.5H10ZM13 12.5H15C15.2833 12.5 15.521 12.404 15.713 12.212C15.9043 12.0207 16 11.7833 16 11.5V8.5C16 8.21667 15.9043 7.979 15.713 7.787C15.521 7.59567 15.2833 7.5 15 7.5H13V12.5ZM14 11.5V8.5H15V11.5H14ZM17 12.5H18V10.5H19V9.5H18V8.5H19V7.5H17V12.5ZM8 18C7.45 18 6.97933 17.8043 6.588 17.413C6.196 17.021 6 16.55 6 16V4C6 3.45 6.196 2.979 6.588 2.587C6.97933 2.19567 7.45 2 8 2H20C20.55 2 21.021 2.19567 21.413 2.587C21.8043 2.979 22 3.45 22 4V16C22 16.55 21.8043 17.021 21.413 17.413C21.021 17.8043 20.55 18 20 18H8ZM8 16H20V4H8V16ZM4 22C3.45 22 2.97933 21.8043 2.588 21.413C2.196 21.021 2 20.55 2 20V6H4V20H18V22H4Z"
            fill={props.customcolor ? props.customcolor : "#AAAAAA"}
          />
        </g>
      </svg>
    </>
  </SvgIcon>
);
