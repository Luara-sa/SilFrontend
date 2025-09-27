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
  isEnrolled?: boolean; // Whether user is enrolled in this course
  categoryName?: string; // Category name to display below course name
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
    isEnrolled,
    categoryName,
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
        maxWidth: { xs: "100%", sm: "280px", md: "300px" },
        height: { xs: "auto", sm: "400px", md: "455px" },
        minWidth: { xs: "280px", sm: "250px", md: "300px" },
        width: { xs: "100%", sm: "250px", md: "300px", lg: "300px" },
        minHeight: { xs: "350px", sm: "400px", md: "455px" },
      }}
    >
      <Box
        sx={{
          minWidth: { xs: "100%", md: "200px" },
          height: { xs: "150px", sm: "160px", md: "200px" },
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
          px: { xs: 1.5, sm: 2 },
          pt: { xs: 1, sm: 1.5, md: 1.5 },
          height: { xs: "auto", md: "calc(100% - 200px)" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
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
                  fontSize: { xs: "16px", sm: "16px", md: "18px" },
                  fontWeight: 700,
                  cursor: "pointer",
                  lineHeight: {
                    xs: "1.3",
                    sm: "1.4",
                    md: "1.5",
                  },
                  display: "-webkit-box",
                  WebkitLineClamp: { xs: 2, sm: 2, md: 2 },
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {name}
              </Typography>
            </Link>
          </BootstrapTooltip>
          {categoryName && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: "0.75rem",
                mt: 0.5,
                fontWeight: 400,
              }}
            >
              {categoryName}
            </Typography>
          )}
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
              borderBottom: "0.5px solid rgba(30, 91, 99, 0.19)",
              flexWrap: "wrap",
              justifyContent: "center",
              rowGap: { xs: "8px", sm: "10px" },
              columnGap: { xs: "8px", sm: "10px" },
              py: { xs: "8px", sm: "8px", md: "8px" },
              userSelect: "none",
              px: {
                xs: "10px",
                sm: isFourInfoDisplyed ? "15px" : "10px",
                md: isFourInfoDisplyed ? "25px" : "10px",
              },
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
            py: { xs: 1.5, sm: 1.5, md: 0 },
            gap: { xs: 1, sm: 1.5 },
            flexWrap: { xs: "wrap", sm: "nowrap" },
          }}
        >
          <Link href={courseUrl}>
            <Button
              variant="default"
              sx={{
                fontSize: { xs: "12px", sm: "11px", md: "12px", lg: "13px" },
                px: { xs: 1.5, sm: 2 },
                py: { xs: 0.5, sm: 0.75 },
                minWidth: { xs: "auto", sm: "80px" },
              }}
            >
              {isEnrolled
                ? t("View Course")
                : props.price && props.price > 0
                ? t("View Course")
                : t("Enroll")}
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
