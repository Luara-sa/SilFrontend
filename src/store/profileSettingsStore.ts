import create from "zustand";

interface ProfileSettingsStoreInterface {
  isDeleteAccoutPopup: boolean;
  openDeleteAccoutPopup: () => void;
  closeDeleteAccoutPopup: () => void;

  deleteAccoutPopupStep: number;
  setDeleteAccoutPopupStep: (res: number) => void;

  resetDeleteAccoutPopup: () => void;

  profileSettingForm: ProfileSettingFormInterface;
  setProfileSettingForm: (res: any) => void;
  clearProfileSettingForm: () => void;
}

export const profileSettingsStore = create<ProfileSettingsStoreInterface>(
  (set: any) => ({
    isDeleteAccoutPopup: false,
    openDeleteAccoutPopup: () => set(() => ({ isDeleteAccoutPopup: true })),
    closeDeleteAccoutPopup: () => {
      set(() => ({ isDeleteAccoutPopup: false, deleteAccoutPopupStep: 1 }));
    },

    deleteAccoutPopupStep: 1,
    setDeleteAccoutPopupStep: (res) =>
      set(() => ({ deleteAccoutPopupStep: res })),
    resetDeleteAccoutPopup: () =>
      set(() => ({ deleteAccoutPopupStep: 1, isDeleteAccoutPopup: false })),

    profileSettingForm: {
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      old_password: "",
      new_password: "",
      confirm_password: "",
      phone: "",
      extra_phone: "",
      id_number: "",
      personal_image: "",
      personal_image_deleted: false,

      profileChanged: false,
      accountChanged: false,
      paymentChanged: false,
      // To know which tab the error coming from
      error: [],
    },
    setProfileSettingForm: (res) => set(() => ({ profileSettingForm: res })),
    clearProfileSettingForm: () =>
      set(() => ({ profileSettingForm: undefined })),
  })
);

interface ProfileSettingFormInterface {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  old_password?: string;
  new_password?: string;
  confirm_password?: string;
  phone?: string;
  extra_phone?: string;
  id_number?: string;
  personal_image?: string;
  personal_image_deleted?: boolean;
  updatedImageForDisplay?: any;
  updatedImageForApi?: any;

  profileChanged?: boolean;
  accountChanged?: boolean;
  paymentChanged?: boolean;
  error?: string[];
}
