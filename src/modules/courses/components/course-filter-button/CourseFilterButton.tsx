import React from "react";
import { Button, Badge } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { filterStore } from "store/filterStore";

interface CourseFilterButtonProps {
  onOpenFilter: () => void;
}

export const CourseFilterButton: React.FC<CourseFilterButtonProps> = ({
  onOpenFilter,
}) => {
  const { filters } = filterStore();

  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== undefined && value !== "" && value !== null
  ).length;

  return (
    <Badge
      badgeContent={activeFiltersCount}
      color="primary"
      sx={{
        "& .MuiBadge-badge": {
          right: -3,
          top: 13,
        },
      }}
    >
      <Button
        variant="outlined"
        startIcon={<FilterList />}
        onClick={onOpenFilter}
        sx={{
          borderColor: activeFiltersCount > 0 ? "primary.main" : "grey.300",
          color: activeFiltersCount > 0 ? "primary.main" : "text.primary",
          fontWeight: activeFiltersCount > 0 ? 600 : 400,
        }}
      >
        Filters
      </Button>
    </Badge>
  );
};
