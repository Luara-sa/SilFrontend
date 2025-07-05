import { ReactElement } from "react";

import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import TimePending from "../../../../public/assets/icons/shared/time-pending";
import { StringDouble } from "interface/common";

export interface ColorType {
  primaryBackground: string;
  primaryColor: string;
  secondaryBackground: string;
  secondaryBorder: string;
  secondaryColor: string;
  icon: ReactElement<any, any>;
  buttonText: StringDouble;
  //   secondaryText: string;
}

export type CertifcateStatus = "pending" | "rejected" | "approved";

export type ColorsType = {
  [key in CertifcateStatus]: ColorType;
};

export const statusProperties: ColorsType = {
  pending: {
    primaryBackground: "#FFE490",
    primaryColor: "#1E5B63",
    secondaryBackground: "#FFF3CF",
    secondaryBorder: "#FFC107",
    secondaryColor: "gray.50",
    icon: <TimePending />,
    // icon: <img src="/assets/icons/shared/time-pending.svg" />,
    buttonText: { en: "Certificate Pending", ar: "طلب الشهادة معلّق" },
  },
  rejected: {
    primaryBackground: "#FFB8B8",
    primaryColor: "gray.50",
    secondaryBackground: "#FFE7E7",
    secondaryBorder: "#FF5252",
    secondaryColor: "gray.50",
    icon: <img src="/assets/icons/shared/rejected.svg" />,
    buttonText: { en: "Certificate Rejected", ar: "طلب الشهادة مرفوض" },
  },
  approved: {
    primaryBackground: "#98E89B",
    primaryColor: "#1E5B63",
    secondaryBackground: "#D2FFD4",
    secondaryBorder: "#4CAF50",
    secondaryColor: "gray.50",
    icon: <CheckCircleOutlineRoundedIcon />,
    buttonText: { en: "Certificate Accepted", ar: "طلب الشهادة مقبول" },
  },
};
