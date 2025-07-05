import React, { useEffect } from "react";

import useTranslation from "next-translate/useTranslation";

import { Box, Typography } from "@mui/material";

import { profileStore } from "store/profileStore";
import { _CourseService } from "services/course.service";

import { PathCard } from "components/shared";

export const MyPaths = () => {
  const { t } = useTranslation("profile");

  const [setData, myData] = profileStore((state) => [
    state.setData,
    state.myData,
  ]);

  useEffect(() => {
    _CourseService.getPaths().then((res) => setData(res, "paths"));
  }, []);

  return (
    <Box>
      <Box sx={{ pb: "13px", borderBottom: "1px solid #EEEEEE" }}>
        <Typography
          sx={{ fontSize: "30px", fontWeight: 700, color: "primary.main" }}
        >
          {t("my paths")}
        </Typography>
      </Box>
      <Box sx={{ mt: "15px" }}>
        <Box
          sx={{
            pt: "20px",
            display: "flex",
            justifyContent: { xs: "center", md: "start" },
            flexDirection: { xs: "column", sm: "row" },
            gap: "20px",
          }}
        >
          {myData?.paths &&
            myData?.paths.map((path) => (
              <PathCard
                key={path.id}
                name={path.name}
                image={path.image}
                pathId={path.id}
                courseCount={path.courses_count}
              />
            ))}
        </Box>
      </Box>
    </Box>
  );
};
