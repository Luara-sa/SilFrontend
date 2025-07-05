import React from "react";

import { SvgIcon, SvgIconProps } from "@mui/material";

export interface SvgIconPropsPlus extends SvgIconProps {
  customcolor?: string;
  customsize?: "small" | "large";
  customWidth?: any;
  customHeight?: any;
}

const TimePending: React.FC<SvgIconPropsPlus> = (props) => {
  return (
    <SvgIcon
      {...props}
      viewBox={`0 0 16 20`}
      sx={{
        width: props.customWidth ? props.customWidth : "16",
        height: props.customHeight ? props.customHeight : "20",
      }}
      // width={props.customWidth ? props.customWidth : "16"}
      // height={props.customHeight ? props.customHeight : "20"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 18H12V15C12 13.9 11.6083 12.9583 10.825 12.175C10.0417 11.3917 9.1 11 8 11C6.9 11 5.95833 11.3917 5.175 12.175C4.39167 12.9583 4 13.9 4 15V18ZM8 9C9.1 9 10.0417 8.60833 10.825 7.825C11.6083 7.04167 12 6.1 12 5V2H4V5C4 6.1 4.39167 7.04167 5.175 7.825C5.95833 8.60833 6.9 9 8 9ZM0 20V18H2V15C2 13.9833 2.23767 13.029 2.713 12.137C3.18767 11.2457 3.85 10.5333 4.7 10C3.85 9.46667 3.18767 8.754 2.713 7.862C2.23767 6.97067 2 6.01667 2 5V2H0V0H16V2H14V5C14 6.01667 13.7627 6.97067 13.288 7.862C12.8127 8.754 12.15 9.46667 11.3 10C12.15 10.5333 12.8127 11.2457 13.288 12.137C13.7627 13.029 14 13.9833 14 15V18H16V20H0Z"
        fill={props.customcolor ? props.customcolor : "#1E5B63"}
      />
    </SvgIcon>
  );
};

export default TimePending;
