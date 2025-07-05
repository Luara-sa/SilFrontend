import React, { useState } from "react";
import { useRouter } from "next/router";

import { Box, ButtonBase, Dialog, Typography } from "@mui/material";

import { _StudentRoleService } from "services/studentRole.service";
import { StringDouble } from "interface/common";

import { DashboardTotalCardDialog } from "./DashboardTotalCardDialog";

import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import PanToolOutlinedIcon from "@mui/icons-material/PanToolOutlined";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  count: number;
  status: StudentStatus;
}

export const DashboardTotalCard = (props: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const { locale } = useRouter();

  const RenderIcon = () => {
    if (props?.status === "stopped") {
      return (
        <PanToolOutlinedIcon sx={{ color: "#1E5B63", fontSize: "45px" }} />
      );
    } else if (props?.status === "frozen") {
      return <AcUnitIcon sx={{ color: "#1E5B63", fontSize: "45px" }} />;
    } else if (props?.status === "completed") {
      return (
        <VerifiedOutlinedIcon sx={{ color: "#1E5B63", fontSize: "45px" }} />
      );
    }
  };
  const handleOpen = () => {
    if (props?.count === 0) {
      return;
    }
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ButtonBase>
      <Box
        onClick={handleOpen}
        sx={{
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)",
          borderRadius: "5px",
          minWidth: "275px",
          minHeight: "150px",
          px: "20px",
          py: "15px",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          justifyContent: "space-between",
          rowGap: "20px",
          backgroundColor: "#FFFEFA",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "80px",
              fontWeight: 700,
              color: "primary.main",
              lineHeight: "70px",
            }}
          >
            {props?.count}
          </Typography>
          <Box>{RenderIcon()}</Box>
        </Box>
        <Box>
          <Typography
            sx={{ fontSize: "25px", fontWeight: "700", color: "primary.main" }}
          >
            {CardProperites[props?.status]?.label[locale as keyof StringDouble]}
          </Typography>
        </Box>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            overflow: "hidden",
          },
        }}
      >
        <DashboardTotalCardDialog
          handleClose={handleClose}
          status={props?.status}
        />
      </Dialog>
    </ButtonBase>
  );
};

interface labelType {
  label: StringDouble;
}

export type StudentStatus = "stopped" | "frozen" | "completed";

type LabelsType = {
  [key in StudentStatus]: labelType;
};

export const CardProperites: LabelsType = {
  stopped: {
    label: { en: "Stopped Courses", ar: "دورات متوقفة" },
  },
  frozen: {
    label: { en: "Frozen Courses", ar: "دورات مجمّدة" },
  },
  completed: {
    label: { en: "Completed Courses", ar: "دورات مكتملة" },
  },
};
