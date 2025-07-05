import React, { useState } from "react";

import { Box, Dialog, Typography } from "@mui/material";

import { _CompanyService } from "services/company.service";

import { StudentCourseTable } from "./StudentCourseTable";

interface Props {
  student_id: number;
}

export const StudentCourseAction = (props: Props) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      <Box
        sx={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
        onClick={handleOpen}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            columnGap: "10px",
            backgroundColor: "#0C8090",
            borderRadius: "6px",
            px: "10px",
            py: "8px",
          }}
        >
          <Typography
            sx={{
              color: "gray.light",
              fontSize: "12px",
              fontWeight: "700",
            }}
          >
            5
          </Typography>
          <Box>
            <img src="/assets/icons/shared/bookmark-book.svg" />
          </Box>
        </Box>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ "& .MuiDialog-paper ": { maxWidth: "none" } }}
      >
        <StudentCourseTable
          handleClose={handleClose}
          student_id={props.student_id}
        />
      </Dialog>
    </>
  );
};
