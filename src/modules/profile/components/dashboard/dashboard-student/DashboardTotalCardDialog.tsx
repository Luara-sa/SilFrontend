import {
  Box,
  CircularProgress,
  Dialog,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { _StudentRoleService } from "services/studentRole.service";
import { CardProperites, StudentStatus } from "./DashboardTotalCard";
import { StringDouble } from "interface/common";
import { useRouter } from "next/router";
import { profileStore } from "store/profileStore";

import CloseIcon from "@mui/icons-material/Close";
import shallow from "zustand/shallow";

interface Props {
  handleClose: () => void;
  status: StudentStatus;
}

export const DashboardTotalCardDialog = ({ handleClose, status }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [myData, setData] = profileStore(
    (state) => [state.myData, state.setData],
    shallow
  );
  const params = useRef({
    student_status: status,
  });
  const { locale } = useRouter();

  useEffect(() => {
    setIsLoading(true);
    getData(params.current).finally(() => setIsLoading(false));
    return () => {
      setData([], "courses");
    };
  }, []);

  if (isLoading)
    return (
      <Box
        sx={{
          backgroundColor: "#FFFEFA",
          borderRadius: "15px",
          width: "578px",
          maxWidth: "578px",
          height: "441px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      sx={{
        backgroundColor: "#FFFEFA",
        borderRadius: "15px",
        width: "578px",
        maxWidth: "578px",
        height: "441px",
        padding: "1rem",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "2.5rem",
        }}
      >
        <Typography
          sx={{ fontSize: "25px", fontWeight: "700", color: "#1E5B63" }}
        >
          {CardProperites[status]?.label[locale as keyof StringDouble]}
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon
            sx={{ fontSize: "24px", color: "#1C1B1F", cursor: "pointer" }}
          />
        </IconButton>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "auto",
          maxHeight: "320px",
          overflowY: "auto",
          overflowX: "hidden",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25);",
          borderRadius: "5px",
        }}
      >
        {myData?.courses &&
          myData?.courses?.map((course) => (
            <>
              <Box
                sx={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                  px: "1.5rem",
                  py: "1rem",
                }}
              >
                <Box
                  sx={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "5px",
                    backgroundColor: "#D9D9D9",
                  }}
                >
                  .
                </Box>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "#000000",
                    fontWeight: "700",
                  }}
                >
                  {JSON.parse(course.course_name).en}
                </Typography>
              </Box>

              <Divider />
            </>
          ))}
      </Box>
    </Box>
  );
};

const getData = (params: any) => {
  const setData = profileStore.getState().setData;
  return _StudentRoleService
    .getStudentOrdersByToken(params)
    .then((res) => setData(res.result.data, "courses"))
    .catch((err) => console.error(err));
};
