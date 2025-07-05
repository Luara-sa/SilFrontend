import { NotificationType } from "interface/common";

export const notificationTextStyle = {
  background: "linear-gradient(270deg, #0E7B8A 0%, #1CA9BC 100%)",
  backgroundClip: "text",
  textFillColor: "transparent",
};

export type NotificationRedirection = {
  [key in NotificationType]: { link: string; query?: any };
};

export const notificationRedirection: NotificationRedirection = {
  certificates_request: {
    link: "/profile",
    query: { page: "myCertificates" },
  },
  delegate_account: {
    link: "/profile",
    query: { page: "dashboard" },
  },
  delegate_link: {
    link: "/profile",
    query: { page: "dashboard" },
  },
  my_courses: { link: "/profile", query: { page: "myCourses" } },
  new_installment_to_checkout: {
    link: "/profile",
    query: { page: "myCourses" },
  },
  my_orders: {
    link: "/profile",
    query: { page: "myOrders" },
  },
};
