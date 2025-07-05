import { Gender, PaymentStatus } from "interface/common";

export const renderColorGender = (gender: any) => {
  switch (gender) {
    case "men":
      return "#005CAF";
      break;
    case "women":
      return "#F033B0";
      break;
    case "both":
      return "#FFC107";
      break;
  }
};

export const renderColorPayment = (status: PaymentStatus) => {
  switch (status) {
    case "completed":
      return "#4CAF50";
      break;
    case "pending":
      return "#FFC107";
      break;
    case "rejected":
      return "#FF5252";
      break;

    default:
      break;
  }
};

export const renderStatusPayment = (status: PaymentStatus) => {
  switch (status) {
    case "completed":
      return "Innocent";
      break;
    case "rejected":
      return "Debit";
      break;
    case "pending":
      return "pending";
      break;

    default:
      break;
  }
};

export const renderColorCircle = (value: number) => {
  if (value < 50) return "#FF5252";
  else if (value >= 50 && value < 75) return "#FFC107";
  else if (value >= 75) return "#4CAF50";
};
