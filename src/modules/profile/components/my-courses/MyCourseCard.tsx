import { Box, Button, LinearProgress, Rating, Typography } from "@mui/material";
import { SmallCourseInfo, Teacher } from "components/shared";
import { BootstrapTooltip } from "components/styled";
import Link from "next/link";
import React, { useEffect } from "react";
import { LevelIcon } from "../../../../../public/assets/icons/shared/LevelIcon";
import { MaleIcon } from "../../../../../public/assets/icons/shared/MaleIcon";
import { TimeIcon } from "../../../../../public/assets/icons/shared/Time";
import { VideoIcon } from "../../../../../public/assets/icons/shared/VideoIcon";

interface Props {
  name?: string;
  hours?: number;
  image?: string;
  level?: string;
  price?: number;
  rate?: number;
  type?: string;
  id?: string | number;
  trianer_name: string;
  trianer_image: string;
  progressValue?: number;
  lesson_count: number;
}

export const MyCourseCard = (props: Props) => {
  const [value, setValue] = React.useState<number | null>(
    props.rate ? props.rate : 0
  );

  // useEffect(() => {
  //   console.log(props.progressValue);
  //   return () => {};
  // }, [props]);

  return (
    <Box
      sx={{
        overflow: "hidden",
        borderRadius: "5px",
        boxShadow: "1px 2px 5px rgba(0, 0, 0, 0.25)",
        backgroundColor: "#FFFEFA",
        maxWidth: "270px",
        minWidth: { xs: "200px", md: "300" },
        width: { xs: "250px", sm: "250px", md: "300px", lg: "300px" },
      }}
    >
      <Box
        sx={{
          minWidth: "200px",
          height: "200px",
          backgroundImage: `url('${props.image}')`,
          // backgroundImage: "url('/assets/images/product.png')",
          backgroundPosition: "left",
          backgroundSize: "cover",
        }}
      />
      <Box sx={{ px: 2, pt: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <BootstrapTooltip
            title={props.name && props.name?.length > 30 && props.name}
          >
            <Typography
              sx={{
                color: "gray.50",
                fontSize: [14, 14, 16, 18, 22],
                fontWeight: 700,
                height: "66px",
                wordBreak: "break-word",
              }}
            >
              {props.name && props.name?.length > 30
                ? props.name?.substring(0, 30) + "..."
                : props.name}
            </Typography>
          </BootstrapTooltip>
          <Teacher
            image={props.trianer_image}
            name={props.trianer_name}
            withTeacher={false}
            isMyCourse={true}
            nameBottom
            nameFontSize={[12]}
          />
        </Box>
        <Box sx={{ mt: "9px", display: "flex", columnGap: "8px" }}>
          <Typography sx={{ color: "gray.50", fontSize: "10px" }}>
            Your Rating
          </Typography>
          <Rating
            name="simple-controlled"
            sx={{ color: "primary.main" }}
            value={value}
            size="small"
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          />
        </Box>
        <Box
          sx={{
            borderBottom: "0.5px solid rgba(30, 91, 99, 0.19)",
            py: 1.5,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box sx={{ pr: "10px" }}>
            <Typography
              sx={{ fontSize: "14px", fontWeight: 700, color: "primary.main" }}
            >
              {props.progressValue?.toFixed(1)!}%
              {/* {props.progressValue?.toString().slice(0, 4)}% */}
            </Typography>
          </Box>
          <Box sx={{ width: "100%", mr: 1 }}>
            <LinearProgress variant="determinate" value={props.progressValue} />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            // columnGap: "10px",
            borderBottom: "0.5px solid rgba(30, 91, 99, 0.19)",
            py: 1.5,
            flexWrap: "wrap",
            // justifyContent: "space-between",
            justifyContent: "center",
            columnGap: "5px",
            rowGap: "10px",
          }}
        >
          <SmallCourseInfo
            title={`${props.hours} hours`}
            icon={<TimeIcon customsize="small" />}
          />
          <SmallCourseInfo
            title={`${props.lesson_count} Lessons`}
            icon={<VideoIcon customsize="small" customcolor="#1E5B63" />}
          />
          {props.level && (
            <SmallCourseInfo
              title={props.level}
              icon={<LevelIcon customsize="small" />}
            />
          )}
          {props.type && (
            <SmallCourseInfo title={props.type} icon={<MaleIcon />} />
          )}
        </Box>
        <Box
          sx={{
            py: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link href={`courses/${props.id}`}>
            <Button
              variant="default"
              sx={{
                fontSize: [10, 10, 11, 12, 13],
                width: "100%",
                borderRadius: "10px",
              }}
            >
              Resume
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};
