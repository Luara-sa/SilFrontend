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
  secondaryText: StringDouble;
}

export type Status = "wraning" | "rejected" | "success";

export type ColorsType = {
  [key in Status]: ColorType;
};

export const statusProperties: ColorsType = {
  wraning: {
    primaryBackground: "#FFE490",
    primaryColor: "#1E5B63",
    secondaryBackground: "#FFF3CF",
    secondaryBorder: "#FFC107",
    secondaryColor: "gray.50",
    icon: <TimePending />,
    // icon: <img src="/assets/icons/shared/time-pending.svg" />,
    buttonText: { ar: "طلب التسويق معلّق", en: "Delegate Pending" },
    secondaryText: {
      ar: "يرجى الانتظار حتى يصرح لك المسؤول بأداء واجباتك كمفوض",
      en: "Please wait for the administrator to authorize you to perform your duties as a delegate",
    },
  },
  rejected: {
    primaryBackground: "#FFB8B8",
    primaryColor: "gray.50",
    secondaryBackground: "#FFE7E7",
    secondaryBorder: "#FF5252",
    secondaryColor: "gray.50",
    icon: <img src="/assets/icons/shared/rejected.svg" />,
    buttonText: { ar: "تم رفض طلب التسويق", en: "Delegate Rejected" },
    secondaryText: {
      ar: "عذراً،لم تحصل على إذن لمشاركة الرابط",
      en: "Sorry, you did not get permission to share the link",
    },
  },
  success: {
    primaryBackground: "#98E89B",
    primaryColor: "#1E5B63",
    secondaryBackground: "#D2FFD4",
    secondaryBorder: "#4CAF50",
    secondaryColor: "gray.50",
    icon: <CheckCircleOutlineRoundedIcon />,
    buttonText: { ar: "طلب التسويق مقبول", en: "Delegate Accepted" },
    secondaryText: {
      ar: "تهانينا،لقد حصلت على إذن لمشاركة رابط الدورة التدريبية مع شبكتك",
      en: "Congratulations, you've got permission to share the course link to your network",
    },
  },
};
