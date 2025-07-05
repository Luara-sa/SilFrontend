import React, { useEffect } from "react";

import { Box, Typography, useTheme } from "@mui/material";

import { dateToString } from "helper/dateToString";
import { _StudentRoleService } from "services/studentRole.service";
import { profileStore } from "store/profileStore";

import { MyTestCard } from "../components";
import { _WithAuthService } from "services/withAuth.service";
import useTranslation from "next-translate/useTranslation";

export const PlacementTest = () => {
  const [setData, myData] = profileStore((state) => [
    state.setData,
    state.myData,
  ]);

  const { t } = useTranslation("profile");

  useEffect(() => {
    _StudentRoleService
      .getPlacmentTestsByToken()
      .then((res) => {
        setData(res.result.data, "placementTest");
      })
      .catch((err) => console.error(err));

    return () => {};
  }, []);

  return (
    <Box sx={{}}>
      <Box sx={{ borderBottom: "1px solid #EEEEEE" }}>
        <Typography
          sx={{ fontSize: "30px", fontWeight: "700", color: "primary.main" }}
        >
          {t("placement test")}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          columnGap: "20px",
          rowGap: "20px",
          flexWrap: "wrap",
          pt: "45px",
        }}
      >
        {myData?.placementTest &&
          myData?.placementTest.map((test) => (
            <Box sx={{ flex: "0.33" }} key={test.id}>
              <MyTestCard
                id={test.id}
                name={
                  test.test_name !== "" ? JSON.parse(test.test_name).en : ""
                }
                date={dateToString(test.created_at)}
                mark={test.mark ?? 0}
              />
            </Box>
          ))}
      </Box>
    </Box>
  );
};
