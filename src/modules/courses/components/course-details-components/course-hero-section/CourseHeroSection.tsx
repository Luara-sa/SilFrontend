import { Typography, Box, Rating } from "@mui/material";
import React from "react";
import StarIcon from "@mui/icons-material/Star";
import { StringDouble } from "interface/common";
import ConditionalRender, { Case } from "components/custom/conditionalRender";
import CourseStopContinueButton from "../../course-outline-row/course-stop-continue-button/CourseStopContinueButton";
import { CourseWithdrawnButton } from "../../course-outline-row/course-withdrawn-button/CourseWithdrawnButton";

interface Props {
  name: string;
  tags?: string[];
  student_status?: any;
  order_status?: string | undefined;
}

export const CourseHeroSection = (props: Props) => {
  return (
    <Box
      sx={{
        backgroundImage: "url('/assets/images/shared/Intersect.png')",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "rgba(12, 128, 144, 0.9)",
        }}
      >
        <Box
          sx={{
            width: { xs: "95vw", lg: "60vw" },

            pt: "50px",
            pb: "18px",
            minWidth: { lg: "970px", xl: "1148px" },
          }}
        >
          <Box sx={{ maxWidth: "800px", width: { lg: "67%", xl: "100%" } }}>
            <Typography
              sx={{
                color: "gray.active",
                fontSize: [30, 30, 30, 33, "1.979vw"],
                fontWeight: "700",
              }}
            >
              {props.name}
            </Typography>

            <Box
              sx={{
                mt: "10px",
                alignItems: "center",
                columnGap: "10px",
                display: { xs: "flex", lg: "none" },
              }}
            >
              <Rating
                name="simple-controlled"
                value={4}
                size="small"
                readOnly
                emptyIcon={<StarIcon fontSize="inherit" />}
                sx={{
                  "& .MuiRating-iconEmpty": {
                    color: "#D9D9D9",
                  },
                }}
              />
              <Typography sx={{ color: "gray.active", fontSize: ["12px"] }}>
                4/5
              </Typography>
            </Box>

            {props.tags && (
              <Box>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "gray.active",
                  }}
                >
                  Tags:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    columnGap: "10px",
                    rowGap: "10px",
                    mt: "15px",
                  }}
                >
                  {props.tags.map((tag, index) => (
                    <TagCard title={tag} key={index} />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
          <Box sx={{ paddingTop: "1rem", display: "flex", gap: "10px" }}>
            {props?.order_status && props.order_status === "completed" && (
              <ConditionalRender condition={props?.student_status}>
                <Case condition="normal">
                  <CourseStopContinueButton type="stopped" />
                  <CourseWithdrawnButton />
                </Case>
                <Case condition="stopped">
                  <CourseStopContinueButton type="normal" />
                </Case>
                <Case condition="withdrawn">
                  <></>
                </Case>
              </ConditionalRender>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const TagCard = (props: { title: string }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#1E5B63",
        px: "10px",
        py: "5px",
        color: "gray.active",
        fontWeight: "700",
        fontSize: "10px",
        borderRadius: "5px",
      }}
    >
      <Typography>{props.title}</Typography>
    </Box>
  );
};
