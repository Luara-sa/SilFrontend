import React, { useEffect, useRef, useState } from "react";

import { Box, Button, Typography } from "@mui/material";

import { profileSettingsStore } from "store/profileSettingsStore";

import PhotoCameraFrontOutlinedIcon from "@mui/icons-material/PhotoCameraFrontOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import useTranslation from "next-translate/useTranslation";

export const ProfileImageInput = ({
  value,
  personalImage,
}: {
  value?: string;
  personalImage?: string;
}) => {
  const [profileSettingForm, setProfileSettingForm] = profileSettingsStore(
    (state) => [state.profileSettingForm, state.setProfileSettingForm]
  );

  const inputFileRef = useRef<any>(null);

  const onImageChange = (event: any) => {
    setAnchorEl(null);
    if (event.target.files && event.target.files[0]) {
      setProfileSettingForm({
        ...profileSettingForm,
        updatedImageForDisplay: URL.createObjectURL(event.target.files[0]),
        updatedImageForApi:
          event?.target?.files !== null ? event.target.files[0] : "",
      });
    }
  };

  // Image options
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { t } = useTranslation("profile");
  const handleDeleteImage = () => {
    // setImage(null);
    setProfileSettingForm({
      ...profileSettingForm,
      updatedImageForDisplay: null,
      personal_image_deleted: true,
      updatedImageForApi: undefined,
    });
    setAnchorEl(null);
  };
  // End image options

  useEffect(() => {
    return () => {};
  }, [profileSettingForm, personalImage]);

  // Determine which image to display
  const imageToDisplay =
    profileSettingForm?.updatedImageForDisplay ||
    (!profileSettingForm?.personal_image_deleted && personalImage);

  return (
    <Box
      sx={{
        cursor: "default",
        width: "100%",
        height: "100%",
        backgroundImage: imageToDisplay ? `url(${imageToDisplay})` : "none",
        backgroundPosition: "center",
        backgroundSize: "cover",
        border: imageToDisplay ? "3px solid #FFC107" : "2px dashed gray.main",
        borderRadius: "10px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <input
        type="file"
        accept=".jpg, .jpeg, .png"
        hidden
        ref={inputFileRef}
        onChange={(e) => {
          onImageChange(e);
        }}
      />
      {(profileSettingForm?.personal_image_deleted || !personalImage) &&
        !profileSettingForm?.updatedImageForDisplay && (
          <Box
            onClick={() => {
              inputFileRef?.current?.click();
            }}
            sx={{
              cursor: "pointer",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PhotoCameraFrontOutlinedIcon
              sx={{ color: "gray.main", fontSize: "50px" }}
            />
            <Typography
              sx={{ color: "gray.main", fontSize: "16px", fontWeight: "600" }}
            >
              Upload New Profile Image
            </Typography>
          </Box>
        )}
      {((!profileSettingForm?.personal_image_deleted && personalImage) ||
        profileSettingForm?.updatedImageForDisplay) && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            columnGap: "5px",
            position: "absolute",
            bottom: "20px",
          }}
        >
          <Button
            onClick={() => handleDeleteImage()}
            startIcon={<DeleteOutlineOutlinedIcon />}
            sx={{
              backgroundColor: "#FF5252",
              color: "gray.active",
              "&:hover": { backgroundColor: "#ff3b3b" },
            }}
          >
            {t("remove")}
          </Button>
          <Button
            onClick={() => {
              inputFileRef?.current?.click();
            }}
            startIcon={<FileUploadOutlinedIcon />}
            sx={{
              backgroundColor: "primary.main",
              color: "gray.active",
              "&:hover": { backgroundColor: "#0e454c" },
            }}
          >
            {t("upload")}
          </Button>
        </Box>
      )}
    </Box>
  );
};
