import React from "react";
import { useRouter } from "next/router";

import { Box } from "@mui/material";

import useDeviceSize from "hooks/useDeviceSize";

import { Breadcrumb } from "components/shared";
import { CoursesBodyWraper } from "modules/courses/components/courses-content/CoursesBodyWraper";

interface Props {
  courses: any;
}

const Courses = (props: Props) => {
  const { isReady } = useRouter();
  const DeviceSize = useDeviceSize();

  return (
    <Box sx={{ overflowX: "hidden" }}>
      {DeviceSize !== "mobile" && <Breadcrumb />}

      <Box
        sx={{
          mt: { xs: "60px", sm: "70px" },
          pb: { xs: "40px", sm: "70px" },
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            px: { xs: 2, sm: 3, md: 0 },
          }}
        >
          <Box sx={{ width: { xs: "100%", sm: "90vw" }, maxWidth: "1400px" }}>
            <CoursesBodyWraper />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Courses;

export async function getStaticProps(context: any) {
  return {
    props: {},
  };
}
