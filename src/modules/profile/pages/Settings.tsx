import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import useTranslation from "next-translate/useTranslation";

import { Box, Button, Dialog, Tab, Tabs, Typography } from "@mui/material";

import { filterTabsStyle } from "../helper/filterTabsStyle";
import { profileSettingsStore } from "store/profileSettingsStore";
import { _AuthService } from "services/auth.service";
import { eventEmitter } from "services/eventEmitter";
import { useMe } from "hooks/useMe";
import { meStore } from "store/meStore";

import ButtonLoader from "components/custom/ButtonLoader";
import { Account } from "../modules/settings/pages/Account";
import { a11yProps, TabPanel } from "components/shared/tabs";
import { ProfileSettings } from "../modules/settings/pages/ProfileSettings";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckIcon from "@mui/icons-material/Check";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";

export const Settings = () => {
  const { me } = useMe();
  const router = useRouter();

  const { setMe, meStr } = meStore((state) => ({
    setMe: state.setMe,
    meStr: state.me,
  }));

  const [clearProfileSettingForm, profileSettingForm, setProfileSettingForm] =
    profileSettingsStore((state) => [
      state.clearProfileSettingForm,
      state.profileSettingForm,
      state.setProfileSettingForm,
    ]);

  const [selectedTab, setSelectedTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);

  const { t } = useTranslation("profile");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };
  const handleOpen = () => {
    setOpenCancel(true);
  };
  const handleClose = () => {
    setOpenCancel(false);
  };

  useEffect(() => {
    return () => {
      clearProfileSettingForm();
    };
  }, []);

  const handleSubmit = async () => {
    // console.log(profileSettingForm);
    if (
      profileSettingForm?.error?.length &&
      profileSettingForm?.error?.length > 0
    ) {
      eventEmitter.emit("enqueueSnackbar", {
        variant: "error",
        autoHideDuration: 3000,
        message: "Form Error",
      });
      return;
    }
    setLoading(true);

    try {
      // Check if we're updating profile-related fields
      const hasProfileChanges =
        profileSettingForm?.profileChanged &&
        (profileSettingForm?.first_name ||
          profileSettingForm?.last_name ||
          profileSettingForm?.updatedImageForApi ||
          profileSettingForm?.personal_image_deleted);

      // Check if we're updating account-related fields (password)
      const hasAccountChanges =
        profileSettingForm?.accountChanged &&
        (profileSettingForm?.old_password || profileSettingForm?.new_password);

      // Handle profile updates with new API
      if (hasProfileChanges) {
        const profileUpdateData: {
          first_name?: string;
          last_name?: string;
          profile_img?: File;
        } = {};

        if (profileSettingForm?.first_name) {
          profileUpdateData.first_name = profileSettingForm.first_name;
        }
        if (profileSettingForm?.last_name) {
          profileUpdateData.last_name = profileSettingForm.last_name;
        }
        if (profileSettingForm?.updatedImageForApi) {
          profileUpdateData.profile_img = profileSettingForm.updatedImageForApi;
        }

        await _AuthService
          .updateStudentProfile(profileUpdateData)
          .then((res) => {
            // Handle both response formats
            const responseData = res.data as any;
            const isSuccess = responseData.status || responseData.success;
            const updatedProfile = responseData.data || responseData.result;

            if (isSuccess && updatedProfile) {
              // Update meStore with new profile data
              const updatedUser = {
                ...meStr?.user,
                first_name: updatedProfile.first_name,
                last_name: updatedProfile.last_name,
                profile_img: updatedProfile.profile_img,
                personal_image: updatedProfile.profile_img,
                username:
                  updatedProfile.first_name && updatedProfile.last_name
                    ? `${updatedProfile.first_name} ${updatedProfile.last_name}`
                    : meStr?.user?.username,
              };

              setMe({
                ...meStr,
                user: updatedUser,
              });

              // Update localStorage
              const updatedMeData = {
                ...meStr,
                user: updatedUser,
              };
              localStorage.setItem("user_data", JSON.stringify(updatedMeData));

              // Clear the temporary image state to show the new server image
              setProfileSettingForm({
                ...profileSettingForm,
                personal_image_deleted: false,
                updatedImageForDisplay: null,
                updatedImageForApi: undefined,
                profileChanged: false,
              });

              eventEmitter.emit("enqueueSnackbar", {
                message: "Profile updated successfully",
                variant: "success",
                snack: {
                  autoHideDuration: 3000,
                  preventDuplicate: true,
                },
              });
            }
          })
          .catch((err) => {
            console.error("Profile update error:", err);
            eventEmitter.emit("enqueueSnackbar", {
              message: "Failed to update profile",
              variant: "error",
              snack: {
                autoHideDuration: 3000,
                preventDuplicate: true,
              },
            });
          });
      }

      // Handle account updates (password changes) with old API
      if (hasAccountChanges) {
        const accountUpdateData = {
          old_password: profileSettingForm?.old_password,
          new_password: profileSettingForm?.new_password,
        };

        // Remove empty password fields
        if (accountUpdateData.old_password === "")
          delete accountUpdateData.old_password;
        if (accountUpdateData.new_password === "")
          delete accountUpdateData.new_password;

        await _AuthService
          .updateProfile(accountUpdateData)
          .then((res) => {
            eventEmitter.emit("enqueueSnackbar", {
              message: "Account updated successfully",
              variant: "success",
              snack: {
                autoHideDuration: 3000,
                preventDuplicate: true,
              },
            });
          })
          .catch((err) => {
            console.error("Account update error:", err);
            eventEmitter.emit("enqueueSnackbar", {
              message: "Failed to update account",
              variant: "error",
              snack: {
                autoHideDuration: 3000,
                preventDuplicate: true,
              },
            });
          });
      }

      // Handle other profile fields (username, email, phone, etc.) with old API if needed
      if (profileSettingForm?.profileChanged && !hasProfileChanges) {
        const otherFieldsData = { ...profileSettingForm };

        // Clean up the data
        delete otherFieldsData?.confirm_password;
        delete otherFieldsData?.accountChanged;
        delete otherFieldsData?.profileChanged;
        delete otherFieldsData?.updatedImageForDisplay;
        delete otherFieldsData?.updatedImageForApi;
        delete otherFieldsData?.personal_image_deleted;
        delete otherFieldsData?.error;
        delete otherFieldsData?.first_name;
        delete otherFieldsData?.last_name;
        delete otherFieldsData?.old_password;
        delete otherFieldsData?.new_password;

        // Remove unchanged email
        if (me?.email === otherFieldsData?.email) delete otherFieldsData?.email;

        if (Object.keys(otherFieldsData).length > 0) {
          await _AuthService
            .updateProfile(otherFieldsData)
            .then((res) => {
              setMe({
                ...meStr,
                user: {
                  ...meStr?.user,
                  ...otherFieldsData,
                },
              });

              eventEmitter.emit("enqueueSnackbar", {
                message: "Profile updated successfully",
                variant: "success",
                snack: {
                  autoHideDuration: 3000,
                  preventDuplicate: true,
                },
              });
            })
            .catch((err) => {
              console.error("Profile update error:", err);
              eventEmitter.emit("enqueueSnackbar", {
                message: "Failed to update profile",
                variant: "error",
                snack: {
                  autoHideDuration: 3000,
                  preventDuplicate: true,
                },
              });
            });
        }
      }
    } catch (error) {
      console.error("Update error:", error);
      eventEmitter.emit("enqueueSnackbar", {
        message: "Failed to update",
        variant: "error",
        snack: {
          autoHideDuration: 3000,
          preventDuplicate: true,
        },
      });
    }

    setLoading(false);
  };
  const handleCancel = () => {
    clearProfileSettingForm();
    router.push("/profile?page=dashboard");
  };

  return (
    <Box>
      <Box sx={{ pb: "13px", borderBottom: "1px solid #EEEEEE" }}>
        <Typography
          sx={{ fontSize: "30px", fontWeight: 700, color: "primary.main" }}
        >
          {t("settings")}
        </Typography>
      </Box>
      <Box sx={{ mt: "15px" }}>
        <Box
          sx={{
            backgroundColor: "#fff",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
            borderRadius: "10px",
            padding: "8px 10px",
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={filterTabsStyle}
          >
            <Tab
              label={t("profile")}
              value="profile"
              icon={
                profileSettingForm?.error?.includes("profile") ? (
                  <FiberManualRecordIcon
                    sx={{ color: "#FF5252", fontSize: "15px" }}
                  />
                ) : undefined
              }
              iconPosition="start"
              {...a11yProps("profile")}
              sx={{
                fontSize: "16px",
                fontWeight: "400",
                minHeight: "20px",
              }}
            />
            <Tab
              label={t("account")}
              value="account"
              icon={
                profileSettingForm?.error?.includes("account") ? (
                  <FiberManualRecordIcon
                    sx={{ color: "#FF5252", fontSize: "15px" }}
                  />
                ) : undefined
              }
              iconPosition="start"
              {...a11yProps("account")}
              sx={{
                fontSize: "16px",
                fontWeight: "400",
                ml: "0",
              }}
            />
          </Tabs>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <TabPanel value={selectedTab} index="profile">
            <ProfileSettings />
          </TabPanel>
          <TabPanel value={selectedTab} index="account" sx={{ width: "100%" }}>
            <Account />
          </TabPanel>
          <TabPanel value={selectedTab} index="payment">
            Payment
          </TabPanel>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "flex-end" },
            columnGap: "20px",
            mt: "20px",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleOpen}
            startIcon={<CloseOutlinedIcon />}
            sx={{
              border: "3px solid #FF5252",
              fontWeight: "700",
              borderRadius: "10px",
              color: "#FF5252",
              "&:hover": {
                border: "3px solid #FF5252",
              },
              px: "25px",
            }}
          >
            {t("cancel")}
          </Button>
          <ButtonLoader
            onClick={() => handleSubmit()}
            startIcon={!loading && <CheckIcon />}
            disableOnLoading
            loading={loading}
            sx={{
              px: "35px",
              backgroundColor: "primary.main",
              color: "gray.active",
              "&:hover": {
                backgroundColor: "rgba(30, 91, 99, 0.2)",
                color: "primary.main",
              },
            }}
            textstyle={{
              fontWeight: "700",
            }}
            // onClick={() => handleSubmit(submitHandler)()}
          >
            {t("save")}
          </ButtonLoader>
        </Box>
      </Box>
      <Dialog
        open={openCancel}
        onClose={handleClose}
        sx={{ overflow: "hidden" }}
      >
        <Box
          sx={{
            backgroundColor: "#FFDCDC",
            width: "582px",
            height: "385px",
            borderRadius: "15px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "85px", height: "100px" }}>
            <Image
              src="/assets/icons/profile/warning.png"
              width={85}
              height={100}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Typography
              sx={{
                fontSize: "30px",
                fontWeight: "700",
                color: "#FF5252",
                textAlign: "center",
              }}
            >
              {t("are you sure you want to leave")}
            </Typography>
            <Typography
              sx={{
                fontSize: "26px",
                fontWeight: "500",
                color: "#FF5252",
                textAlign: "center",
              }}
            >
              {t("unsaved changes will be lost")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "10px" }}>
            <Button
              onClick={handleClose}
              sx={{
                backgroundColor: "#FF525233",
                gap: "3px",
                borderRadius: "10px",
                color: "#FF5252",
                fontWeight: "700",
                width: "127px",
                height: "42px",
              }}
              endIcon={<HighlightOffOutlinedIcon sx={{ color: "#FF5252" }} />}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleCancel}
              sx={{
                backgroundColor: "rgba(12, 128, 144, 0.3)",
                gap: "3px",
                borderRadius: "10px",
                color: "#0C8090",
                fontWeight: "700",
                width: "127px",
                height: "42px",
              }}
              endIcon={<CheckCircleOutlineIcon sx={{ color: "#0C8090" }} />}
            >
              {t("sure")}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};
