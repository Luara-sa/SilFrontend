import React, { useMemo } from "react";

import Link from "next/link";

import { Box, Button, Rating, Typography } from "@mui/material";

import { Teacher } from "components/shared/teacher/Teacher";
import { SmallCourseInfoSlider } from "./SmallCourseInfoSlider";
import { BootstrapTooltip } from "components/styled";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { PricingTag, PricingTagType } from "./pricing-tag/PricingTag";
import { CoursePrice } from "./course-price/CoursePrice";

interface Props {
  name?: string;
  hours?: number;
  image?: string;
  level?: string;
  price: number;
  rate?: number;
  type?: string;
  id?: string | number;
  lessonCount?: number;
  discount: number;
  navigateTo?: string; // Optional custom navigation URL
  // New pricing props for better price display
  originalPrice?: number;
  discountedPrice?: number;
  currency?: string;
}

export const CourseCard = (props: Props) => {
  const {
    hours,
    lessonCount,
    level,
    type,
    id,
    image,
    name,
    price,
    rate,
    navigateTo,
    originalPrice,
    discountedPrice,
    currency,
  } = props;
  const isFourInfoDisplyed = !!hours && !!lessonCount && !!level && !!type;
  const [value, setValue] = React.useState<number | null>(rate ? rate : 0);
  const { t } = useTranslation("home");

  const hasPricingTag = props?.discount > 0 || props.price === 0;
  const pricingTagStatus: PricingTagType | undefined = useMemo(() => {
    if (props.discount === 100) return "free";
    else if (props?.discount > 0) return "discount";
    return undefined;
  }, [props.discount, props.price]);

  // Determine navigation URL
  const courseUrl = navigateTo || `courses/${id}`;

  return (
    <Box
      sx={{
        overflow: "hidden",
        borderRadius: "5px",
        boxShadow: "1px 2px 5px rgba(0, 0, 0, 0.25)",
        backgroundColor: "#FFFEFA",
        maxWidth: "300px",
        height: { xs: "350px", md: "455px" },
        minWidth: { xs: "200px", md: "300" },
        width: { xs: "200px", sm: "250px", md: "300px", lg: "300px" },
      }}
    >
      <Box
        sx={{
          minWidth: "200px",
          height: { xs: "137px", md: "200px" },
          backgroundColor: "gray.light",
          backgroundPosition: "left",
          backgroundSize: "cover",
          position: "relative",
          overflow: "hidden",
          "&:hover": {
            "& .course-card-pricing-tag": {
              bottom: "-45px",
              transition: "200ms",
            },
          },
        }}
      >
        <Image
          src={image ?? ""}
          layout="fill"
          objectFit="cover"
          alt="Course image"
          loading="lazy"
          // placeholder="blur"
          // blurDataURL={image ?? " "}
        />

        {hasPricingTag && (
          <PricingTag
            variants={pricingTagStatus}
            price={props.price}
            discount={props.discount}
          />
        )}
      </Box>

      <Box
        sx={{
          px: 2,
          pt: { xs: 0.5, md: 1.5 },
          height: "calc(100% - 200px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{}}>
          <BootstrapTooltip
            title={name && name?.length > 39 && name}
            // placement="top"
          >
            <Link href={courseUrl}>
              <Typography
                sx={{
                  color: "gray.50",
                  fontSize: { xs: "14px", md: "18px" },
                  fontWeight: 700,
                  cursor: "pointer",
                  lineHeight: {
                    xs: name && name?.length > 29 ? "1.2rem" : "2.2rem",
                    md: "initial",
                  },
                  height: { xs: "auto", md: "3rem" },
                }}
              >
                {name && name?.length > 39
                  ? name?.substring(0, 39) + "..."
                  : name}
              </Typography>
            </Link>
          </BootstrapTooltip>
          <Box sx={{ pt: { xs: 1, md: 2 } }}>
            <Rating
              name="simple-controlled"
              value={value}
              size="small"
              readOnly
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            />
          </Box>
          <Box
            sx={{
              borderBottom: "0.5px solid rgba(30, 91, 99, 0.19)",
              py: { xs: 1, md: 1.5 },
            }}
          >
            <Teacher
              image="/assets/images/logo.svg"
              name="SIL"
              withTeacher={false}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              // columnGap: "5px",
              borderBottom: "0.5px solid rgba(30, 91, 99, 0.19)",
              flexWrap: "wrap",
              justifyContent: "center",
              rowGap: "10px",
              py: { xs: "0", md: "8px" },
              // cursor: "grab",
              userSelect: "none",
              px: isFourInfoDisplyed ? "25px" : "10px",
              position: "relative",
            }}
          >
            <SmallCourseInfoSlider
              hours={hours}
              level={level}
              type={type}
              lessonCount={lessonCount}
              isFourInfoDisplyed={isFourInfoDisplyed}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            height: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            py: { xs: 1.5, md: 0 },
          }}
        >
          <Link href={courseUrl}>
            <Button variant="default" sx={{ fontSize: [10, 10, 11, 12, 13] }}>
              {t("reservation")}
            </Button>
          </Link>
          <CoursePrice
            price={props.price}
            disable={hasPricingTag}
            originalPrice={originalPrice}
            discountedPrice={discountedPrice}
            currency={currency}
          />
        </Box>
      </Box>
    </Box>
  );
};
