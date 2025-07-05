import { Box, Typography } from "@mui/material";
import { convertStringToJSON } from "helper/convertStringToJSON";
import { dateToString } from "helper/dateToString";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect } from "react";
import { _StudentRoleService } from "services/studentRole.service";
import { profileStore } from "store/profileStore";
import { MyCertificatesCard } from "../components";

export const MyCertificates = () => {
  const [setData, myData] = profileStore((state) => [
    state.setData,
    state.myData,
  ]);

  const { t } = useTranslation("profile");

  useEffect(() => {
    _StudentRoleService
      .getCertificatesStudentByToken()
      .then((res) => {
        console.log(res.result.data.data);
        setData(res.result.data.data, "certificates");
      })
      .catch((err) => console.log(err));

    return () => {};
  }, []);

  return (
    <Box sx={{}}>
      <Box sx={{ borderBottom: "1px solid #EEEEEE", pb: "15px" }}>
        <Typography
          sx={{ fontSize: "30px", fontWeight: "700", color: "primary.main" }}
        >
          {t("my certificate")}
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
        {myData?.certificates &&
          myData?.certificates.map((certificate) => (
            <Box sx={{ flex: "0.5" }} key={certificate.id}>
              <MyCertificatesCard
                courseName={
                  convertStringToJSON(certificate.content_array).course_name
                }
                certifcateName={
                  convertStringToJSON(certificate.content_array)
                    .certificate_name
                }
                date={dateToString(certificate.created_at)}
                evaluation={
                  convertStringToJSON(certificate.content_array).evaluation
                }
                // isPending
              />
            </Box>
          ))}
      </Box>
    </Box>
  );
};
