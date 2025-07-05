import { Box } from "@mui/material";
import React, { useRef, useState } from "react";
import { profileStore } from "store/profileStore";

import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";

export const ProfileImageEdit = ({
  //   imgChange,
  value,
  personalImage,
}: {
  //   imgChange: (file: null | unknown) => void;
  value?: string;
  personalImage: string;
}) => {
  const [isEdit, setUpdatedImage, updatedImage] = profileStore((state) => [
    state.isEdit,
    state.setUpdatedImage,
    state.updatedImage,
  ]);

  const inputFileRef = useRef<any>(null);

  const [image, setImage] = useState(value ?? null);

  const onImageChange = (event: any) => {
    setAnchorEl(null);
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]) as any);
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
  const handleDeleteImage = () => {
    setImage(null);
    setAnchorEl(null);
    // imgChange(null);
  };
  // End image options

  return (
    <Box
      sx={{
        cursor: isEdit ? "pointer" : "default",
        width: "130px",
        height: "130px",
        border: "3px solid #FFD700",
        backgroundImage: `url(${image || personalImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        borderRadius: "50%",
        backgroundColor: "#EEEEEE",
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
          setUpdatedImage(e?.target?.files !== null ? e.target.files[0] : "");
        }}
      />
      {isEdit && (
        <Box
          onClick={() => {
            inputFileRef?.current?.click();
          }}
          sx={{
            width: "100%",
            height: "100%",
            position: "absolute",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(12, 128, 144, 0.5)",
            "&:hover": {
              backgroundColor: "rgba(12, 128, 144, 0.8)",
            },
          }}
        >
          <AddPhotoAlternateOutlinedIcon
            sx={{ color: "gray.active", fontSize: "30px" }}
          />
        </Box>
      )}
    </Box>
  );
};
