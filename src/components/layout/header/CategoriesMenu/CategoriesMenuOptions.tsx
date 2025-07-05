import { Fragment, useEffect, useState } from "react";
import {
  Divider,
  MenuItem,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { _CategoriesService } from "services/categories.service";
import { categoryStore } from "store/categoryStore";
import { filterStore } from "store/filterStore";
import { useStudentCategories } from "hooks/useStudentCategories";

export const dividerStyle = {
  width: "100%",
  borderColor: "#EEEEEE",
  margin: "0px !important",
};

export const CategoriesMenuOptions = () => {
  const setInitFilterParams = filterStore((state) => state.setInitFilterParams);
  const { lang } = useTranslation();
  const router = useRouter();

  // Use the new student categories hook
  const {
    studentCategories,
    studentCategoriesLoading,
    fetchStudentCategories,
  } = useStudentCategories();

  useEffect(() => {
    if (!studentCategories || studentCategories.length === 0) {
      fetchStudentCategories();
    }
  }, [studentCategories, fetchStudentCategories]);

  const params: any = {
    page: 1,
    limit: 20,
    cat_ids: [],
    section: "",
    subscription: "",
    price: [],
    rate: "",
    hours: [],
    level: "",
    tags: "",
  };

  const handleCategoryClick = (id: number) => {
    params.cat_ids.push(id);
    setInitFilterParams(JSON.stringify(params));
    router.push("/courses");
  };

  if (studentCategoriesLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {Array.isArray(studentCategories) && studentCategories.length > 0 ? (
        studentCategories.map((category, categoryIndex) => (
          <Fragment key={category.id}>
            <MenuItem
              onClick={() => handleCategoryClick(category.id)}
              sx={{
                px: "2rem",
                width: "100%",
                py: "12px",
                display: "flex",
                alignItems: "center",
                gap: 2,
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <Box
                component="img"
                src={category.image}
                alt={category.name}
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "4px",
                  objectFit: "cover",
                }}
              />
              <Typography
                sx={{
                  color: "#555555",
                  fontSize: "18px",
                  fontWeight: "400",
                }}
              >
                {category.name}
              </Typography>
            </MenuItem>
            {categoryIndex < studentCategories.length - 1 && (
              <Divider sx={dividerStyle} />
            )}
          </Fragment>
        ))
      ) : (
        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            No categories available
          </Typography>
        </Box>
      )}
    </>
  );
};
