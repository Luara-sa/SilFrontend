import { StringDouble } from "interface/common";

export interface ColorType {
  primaryBackground: string;
  primaryColor: string;
  buttonText: StringDouble;
}

export type StudentStatus =
  | "normal"
  | "payability"
  | "stopped"
  | "withdrawn"
  | "frozen"
  | "completed";

export type ColorsType = {
  [key in StudentStatus]: ColorType;
};

export const StudentStatusProperties: ColorsType = {
  normal: {
    primaryBackground: "#4CAF50",
    primaryColor: "#FFFFFF",
    buttonText: { en: "Normal", ar: "فعّال" },
  },
  payability: {
    primaryBackground: "#D9D9D9",
    primaryColor: "#1E5B63",
    buttonText: { en: "Payability", ar: "إمكانية الدفع" },
  },
  stopped: {
    primaryBackground: "#FF5252",
    primaryColor: "#FFFFFF",
    buttonText: { en: "Stopped", ar: "متوقف" },
  },
  withdrawn: {
    primaryBackground: "#FFC107",
    primaryColor: "#FFFFFF",
    buttonText: { en: "Withdrawn", ar: "إنسحاب" },
  },
  frozen: {
    primaryBackground: "#5CBBF6",
    primaryColor: "#005CAF",
    buttonText: { en: "Frozen", ar: "مجمّد" },
  },
  completed: {
    primaryBackground: "#4CAF50",
    primaryColor: "#FFFFFF",
    buttonText: { en: "Completed", ar: "مكتمل" },
  },
};
