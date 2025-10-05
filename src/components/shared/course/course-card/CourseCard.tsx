import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, Button, Divider, Rating, Stack, Typography } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { Teacher } from "components/shared/teacher/Teacher";
import { SmallCourseInfoSlider } from "./SmallCourseInfoSlider";
import { BootstrapTooltip } from "components/styled";
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
  navigateTo?: string;
  isEnrolled?: boolean;
  categoryName?: string;
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
    rate,
    navigateTo,
    isEnrolled,
    categoryName,
    originalPrice,
    discountedPrice,
    currency,
  } = props;

  const { t } = useTranslation("home");
  const [value, setValue] = React.useState<number | null>(rate || 0);

  const hasPricingTag = props.discount > 0 || props.price === 0;
  const pricingTagStatus: PricingTagType | undefined = useMemo(() => {
    if (props.discount === 100) return "free";
    if (props.discount > 0) return "discount";
    return undefined;
  }, [props.discount]);

  const courseUrl = navigateTo || `courses/${id}`;
  const isFourInfoDisplayed = !!hours && !!lessonCount && !!level && !!type;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: 2.5,
        bgcolor: "common.white",
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        transition: "box-shadow 180ms ease, transform 180ms ease",
        outline: "1px solid rgba(0,0,0,0.04)",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 10px 22px rgba(0,0,0,0.10)",
        },
        width: 300,
        minHeight: 460,
      }}
    >
      {/* Media */}
      <Box
        sx={{
          position: "relative",
          aspectRatio: "16/9", // keeps consistent height
          bgcolor: "#f3f5f6",
          overflow: "hidden",
        }}
      >
        <Image
          src={image || "/assets/images/course-placeholder.png"}
          alt={name || "Course image"}
          width={300}
          height={169} // 16:9 ratio
          style={{ objectFit: "cover", width: "100%", height: "auto" }}
          loading="lazy"
        />

        {hasPricingTag && (
          <PricingTag
            variants={pricingTagStatus}
            price={props.price}
            discount={props.discount}
          />
        )}
        {/* Subtle gradient for title readability on busy images */}
        <Box
          sx={{
            pointerEvents: "none",
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.12) 100%)",
          }}
        />
      </Box>

      {/* Content */}
      <Stack
        spacing={1.25}
        sx={{
          px: 2,
          pt: 1.75,
          pb: 2,
          minHeight: 260,
          flex: 1,
        }}
      >
        {/* Title + Category */}
        <Stack spacing={0.5}>
          <BootstrapTooltip title={name && name.length > 42 ? name : ""}>
            <Link href={courseUrl}>
              <Typography
                component="h3"
                sx={{
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: 1.35,
                  color: "text.primary",
                  cursor: "pointer",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
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
              variant="caption"
              sx={{ color: "text.secondary", letterSpacing: 0.15 }}
            >
              {categoryName}
            </Typography>
          )}
        </Stack>

        {/* Rating */}
        <Rating
          name="course-rating"
          value={value}
          size="small"
          readOnly
          onChange={(_, v) => setValue(v)}
          sx={{ mt: 0.25 }}
        />

        <Divider sx={{ my: 0.5 }} />

        {/* Provider */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Teacher
            image="/assets/images/logo.svg"
            name="SIL"
            withTeacher={false}
          />
        </Stack>

        <Divider sx={{ my: 0.5 }} />

        {/* Meta */}
        <Box sx={{ pt: 0.5 }}>
          <SmallCourseInfoSlider
            hours={hours}
            level={level}
            type={type}
            lessonCount={lessonCount}
            isFourInfoDisplyed={isFourInfoDisplayed}
          />
        </Box>

        {/* Footer */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: "auto", pt: 0.5 }}
          spacing={1.25}
        >
          <Link href={courseUrl}>
            <Button
              variant="contained"
              size="small"
              sx={{
                borderRadius: 2,
                px: 1.75,
                fontSize: 13,
                textTransform: "none",
                boxShadow: "none",
              }}
            >
              {isEnrolled || props.price > 0 ? t("View Course") : t("Enroll")}
            </Button>
          </Link>

          <CoursePrice
            price={props.price}
            disable={hasPricingTag}
            originalPrice={originalPrice}
            discountedPrice={discountedPrice}
            currency={currency}
          />
        </Stack>
      </Stack>
    </Box>
  );
};
