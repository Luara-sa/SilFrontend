import React from "react";
import { Image_Icon } from "../../../../public/assets/icons/Image_icon";
import { Pdf_Icon } from "../../../../public/assets/icons/Pdf_icon";
import { VideoIcon } from "../../../../public/assets/icons/shared/VideoIcon";

import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";

interface Props {
  type:
    | "png"
    | "jpg"
    | "pdf"
    | "mp4"
    | "docx"
    | "doc"
    | "xls"
    | "xlsx"
    | "none"
    | "attended";

  color?: string;
  // locked: boolean;
}

export const RenderIcon = (props: Props) => {
  switch (props.type) {
    // case "pdf":
    //   return <Pdf_Icon />;
    //   break;
    case "none":
      return <></>;
      break;

    case "mp4":
      return <VideoIcon customcolor={props.color} />;
      break;
    case "png":
      return (
        <InsertPhotoOutlinedIcon
          sx={{ color: props.color ? props.color : "gray.main" }}
        />
      );
      break;
    case "jpg":
      return (
        <InsertPhotoOutlinedIcon
          sx={{ color: props.color ? props.color : "gray.main" }}
        />
      );
      break;

    default:
      return (
        <PictureAsPdfOutlinedIcon
          sx={{ color: props.color ? props.color : "gray.main" }}
        />
      );
      break;
  }
};
