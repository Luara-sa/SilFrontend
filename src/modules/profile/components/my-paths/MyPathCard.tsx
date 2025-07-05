import { Box, Typography, Rating, Button, LinearProgress } from "@mui/material";
import { SmallCourseInfo } from "components/shared";
import React from "react";

interface Props {
  name: string;
  image: string;
}

export const MyPathCard = (props: Props) => {
  const [value, setValue] = React.useState<number | null>(2);

  return (
    <Box>
      <Box
        sx={{
          width: "300px",
          position: "relative",
          borderRadius: "5px",
          height: "260px",
          "&:hover .top-shadow": {
            // borderColor: "primary.main",
            boxShadow: "none",
            transition: "500ms",
          },
          "&:hover .bottom-shadow": {
            height: "240px",
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
              height: "260px",
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
            mb: "10px",
            zIndex: "10",
            height: "253px",
            transition: "500ms",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", columnGap: "10px" }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "50px",
                  height: "50px",
                  backgroundImage: `url(${props.image})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  borderRadius: "5px",
                  overflow: "hidden",
                }}
              ></Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: [14, 14, 15, 16, 18],
                    color: "gray.50",
                    fontWeight: "700",
                  }}
                >
                  {props.name}
                </Typography>
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
                    7
                  </Typography>
                  <Typography variant="body2">Courses</Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                mt: "12px",
                display: "flex",
                alignItems: "center",
                columnGap: "5px",
              }}
            >
              <Typography sx={{ fontSize: "10px", color: "gray.50" }}>
                Your Rating
              </Typography>
              <Rating
                name="simple-controlled"
                value={value}
                sx={{ color: "primary.main" }}
                size="small"
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
              />
            </Box>
          </Box>
          <Box sx={{ color: "gray.50", mt: "10px" }}>
            <Typography sx={{ fontSize: [6, 6, 8, 8, 8] }}>
              Lorem ipsum is placeholder text commonly used in the graphic,
              print, and publishing industries for previewing layouts and visual
              mockups.
            </Typography>
          </Box>
          <Box
            sx={{
              py: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box sx={{ minWidth: 35 }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "primary.main",
                }}
              >
                70%
              </Typography>
            </Box>
            <Box sx={{ width: "100%", mr: 1 }}>
              <LinearProgress variant="determinate" value={70} />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              columnGap: "15px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SmallCourseInfo
              title="6 hours"
              icon={<img src="/assets/icons/shared/time.svg" />}
            />
            <SmallCourseInfo
              title="12 Lessons"
              icon={<img src="/assets/icons/shared/video.svg" />}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              // flexDirection: "column",
              // justifyContent: "space-between",
              // alignItems: "end",
              // height: "100%",
              mt: "8px",
            }}
          >
            <Button
              variant="default"
              sx={{
                fontSize: [10, 10, 10, 13, 13],
                width: "100%",
                borderRadius: "10px",
              }}
            >
              Reservation
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
