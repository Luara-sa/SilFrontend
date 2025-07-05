import { Notification } from "interface/common";
import create from "zustand";

interface NotificationStoreInterface {
  notifications?:
    | {
        seen?: Notification[];
        all?: Notification[];
        unseen?: Notification[];
      }
    | undefined;
  setNotifications: (
    res: Notification[] | undefined,
    key: "seen" | "all" | "unseen"
  ) => void;

  // this state to make the (NotificationCardsWraper) reRender and
  // call the (getNotificationsByToken) again
  // This approach is not obtimal, we will refactor this later
  reRenderNotification?: boolean;
  setReRenderNotification: () => void;
}

export const notificationStore = create<NotificationStoreInterface>(
  (set: any) => ({
    setNotifications: (res, key) =>
      set((state: NotificationStoreInterface) => ({
        notifications: { ...state.notifications, [key]: res },
      })),

    setReRenderNotification: () =>
      set((state: NotificationStoreInterface) => ({
        notifications: !state.reRenderNotification,
      })),
  })
);
