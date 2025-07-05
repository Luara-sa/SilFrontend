import React, { useState } from "react";

import { Box, Button, Dialog, Typography } from "@mui/material";

import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import { _StudentRoleService } from "services/studentRole.service";
import { courseStore } from "store/courseStore";
import { CertificateRequestPopup } from "./CertificateRequestPopup";
import { CertificateRequestVariants } from "./CertificateRequestVariants";

export const CertificateRequestAction = () => {
  const [course] = courseStore((state) => [state.course]);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          pt: "14px",
          mt: "14px",
          borderTop: "1px solid #EEEEEE",
          width: "100%",
        }}
      >
        {course?.certificate_request === null && (
          <>
            <Button
              variant="contained"
              onClick={handleOpen}
              fullWidth
              startIcon={<WorkspacePremiumOutlinedIcon />}
              sx={{
                borderRadius: "10px",
                fontSize: [13, 13, 14, 13, 13],
                fontWeight: "700",
                "&:hover": {
                  backgroundColor: "#488289",
                },
              }}
            >
              Certificate Request
            </Button>
            <CertificateRequestPopup handleClose={handleClose} open={open} />
          </>
        )}
        {course?.certificate_request !== null &&
          course?.certificate_request.status && (
            <CertificateRequestVariants
              status={course?.certificate_request.status}
            />
          )}
      </Box>
    </>
  );
};
