import React from "react";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { BootstrapTooltip } from "components/styled";

interface Props {
  name: string;
  image: string;
  pathId?: number;
  courseCount: number;
}

export const PathCard = (props: Props) => {
  const router = useRouter();

  return (
    <Box
      onClick={() => router.push(`/path/${props.pathId}`)}
      sx={{
        width: { xs: "250px", md: "300px" },
        position: "relative",
        borderRadius: "5px",
        cursor: "pointer",
        height: "100px",
        "&:hover .top-shadow": {
          // borderColor: "primary.main",
          boxShadow: "none",
          transition: "500ms",
        },
        "&:hover .bottom-shadow": {
          height: "83px",
          boxShadow: "none",
          transition: "500ms",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          zIndex: "-1",
        }}
      >
        <Box
          className="bottom-shadow"
          sx={{
            width: "90%",
            height: "88px",
            borderRadius: "5px",
            border: "1px solid #EEEEEE",
            boxShadow: "1px 2px 5px rgba(0, 0, 0, 0.25)",
            transition: "500ms",
          }}
        ></Box>
      </Box>
      <Box
        className="top-shadow"
        sx={{
          boxShadow: "1px 2px 5px rgba(0, 0, 0, 0.25)",
          p: "20px",
          borderRadius: "5px",
          backgroundColor: "#FFFEFA",
          border: "1px solid #EEEEEE",
          // mb: "10px",
          zIndex: "10",
          height: "83px",
          transition: "500ms",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              columnGap: "25px",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "50px",
                height: "50px",
                backgroundColor: "gray.light",
                backgroundImage: `url(${props.image})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                borderRadius: "5px",
                overflow: "hidden",
              }}
            ></Box>
            <Box>
              <BootstrapTooltip
                title={props.name && props.name?.length > 14 && props.name}
                // placement="top"
              >
                <Typography
                  sx={{
                    fontSize: [14, 14, 15, 16, 18],
                    color: "gray.50",
                    fontWeight: "700",
                  }}
                >
                  {props.name && props.name?.length > 14
                    ? props.name?.substring(0, 14) + "..."
                    : props.name}
                </Typography>
              </BootstrapTooltip>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: "5px",
                  color: "gray.50",
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: "700" }}>
                  {props.courseCount}
                </Typography>
                <Typography variant="body2">Courses</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
