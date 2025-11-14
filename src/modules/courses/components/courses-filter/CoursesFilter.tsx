import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Divider,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Rating,
} from "@mui/material";
import { ExpandMore, Close, FilterList, Clear } from "@mui/icons-material";

import { filterStore } from "store/filterStore";
import { StudentCoursesFilters } from "interface/common";
import { useStudentCategories } from "hooks/useStudentCategories";
import { useUserAccess } from "hooks/useUserAccess";
import { useCourseMappings } from "hooks/useCourseMappings";

interface CoursesFilterProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: StudentCoursesFilters) => void;
}

export const CoursesFilter: React.FC<CoursesFilterProps> = ({
  open,
  onClose,
  onApplyFilters,
}) => {
  const { filters, setFilters, resetFilters } = filterStore();
  const { canAccess, isLoading } = useUserAccess();
  const { getCourseMode } = useCourseMappings();
  const {
    studentCategories = [],
    fetchStudentCategories,
    studentCategoriesLoading,
  } = useStudentCategories();

  // Local state for form
  const [localFilters, setLocalFilters] =
    useState<StudentCoursesFilters>(filters);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [durationRange, setDurationRange] = useState<[number, number]>([
    0, 200,
  ]);

  // Fetch categories when component mounts or drawer opens (only for students)
  useEffect(() => {
    if (
      open &&
      !isLoading &&
      canAccess.categories &&
      studentCategories.length === 0
    ) {
      fetchStudentCategories();
    }
  }, [
    open,
    studentCategories.length,
    fetchStudentCategories,
    canAccess.categories,
    isLoading,
  ]);

  // Update local state when store filters change
  useEffect(() => {
    setLocalFilters(filters);

    // Handle price range - prioritize nested format, fallback to legacy
    const minPrice = filters.price?.min ?? filters.min_price ?? 0;
    const maxPrice = filters.price?.max ?? filters.max_price ?? 10000;
    if (minPrice !== 0 || maxPrice !== 10000) {
      setPriceRange([minPrice, maxPrice]);
    }

    // Handle duration range - prioritize nested format, fallback to legacy
    const minDuration = filters.duration?.min ?? filters.min_duration ?? 0;
    const maxDuration = filters.duration?.max ?? filters.max_duration ?? 200;
    if (minDuration !== 0 || maxDuration !== 200) {
      setDurationRange([minDuration, maxDuration]);
    }
  }, [filters]);

  const handleInputChange = (
    field: keyof StudentCoursesFilters,
    value: any
  ) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  const handlePriceRangeChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    const range = newValue as [number, number];
    setPriceRange(range);
    setLocalFilters((prev) => ({
      ...prev,
      // Support both legacy and new nested format
      min_price: range[0] > 0 ? range[0] : undefined,
      max_price: range[1] < 10000 ? range[1] : undefined,
      price: {
        min: range[0] > 0 ? range[0] : undefined,
        max: range[1] < 10000 ? range[1] : undefined,
      },
    }));
  };

  const handleDurationRangeChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    const range = newValue as [number, number];
    setDurationRange(range);
    setLocalFilters((prev) => ({
      ...prev,
      // Support both legacy and new nested format
      min_duration: range[0] > 0 ? range[0] : undefined,
      max_duration: range[1] < 200 ? range[1] : undefined,
      duration: {
        min: range[0] > 0 ? range[0] : undefined,
        max: range[1] < 200 ? range[1] : undefined,
      },
    }));
  };

  const handleApplyFilters = () => {
    setFilters(localFilters);
    onApplyFilters(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    resetFilters();
    setLocalFilters({});
    setPriceRange([0, 10000]);
    setDurationRange([0, 200]);
    onApplyFilters({});
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 350,
          padding: 2,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <FilterList /> Filters
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Search */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Search
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            label="Search courses"
            value={localFilters.search || ""}
            onChange={(e) => handleInputChange("search", e.target.value)}
            size="small"
          />
        </AccordionDetails>
      </Accordion>

      {/* Category - Only show for students */}
      {canAccess.categories && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1" fontWeight={600}>
              Category
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth size="small">
              <InputLabel>Select Category</InputLabel>
              <Select
                value={localFilters.category_id || ""}
                onChange={(e) =>
                  handleInputChange("category_id", e.target.value)
                }
                label="Select Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {Array.isArray(studentCategories) &&
                  studentCategories.length > 0 &&
                  studentCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Course Mode */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Course Mode
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth size="small">
            <InputLabel>Course Mode</InputLabel>
            <Select
              value={localFilters.mode || ""}
              onChange={(e) => handleInputChange("mode", e.target.value)}
              label="Course Mode"
            >
              <MenuItem value="">All Modes</MenuItem>
              <MenuItem value="online">{getCourseMode('online')}</MenuItem>
              <MenuItem value="location">{getCourseMode('location')}</MenuItem>
              <MenuItem value="hybrid">{getCourseMode('hybrid')}</MenuItem>
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Learning Structure */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Learning Structure
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth size="small">
            <InputLabel>Learning Structure</InputLabel>
            <Select
              value={localFilters.learning_structure || ""}
              onChange={(e) =>
                handleInputChange("learning_structure", e.target.value)
              }
              label="Learning Structure"
            >
              <MenuItem value="">All Structures</MenuItem>
              <MenuItem value="structured">Structured</MenuItem>
              <MenuItem value="unstructured">Unstructured</MenuItem>
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Delivery Mode */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Delivery Mode
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth size="small">
            <InputLabel>Delivery Mode</InputLabel>
            <Select
              value={localFilters.delivery_mode || ""}
              onChange={(e) =>
                handleInputChange("delivery_mode", e.target.value)
              }
              label="Delivery Mode"
            >
              <MenuItem value="">All Delivery Modes</MenuItem>
              <MenuItem value="synchronous">Synchronous</MenuItem>
              <MenuItem value="asynchronous">Asynchronous</MenuItem>
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Price Range */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Price Range
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 1 }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              SAR {priceRange[0]} - SAR {priceRange[1]}
            </Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              min={0}
              max={10000}
              step={100}
              sx={{ mt: 1 }}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Duration Range */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Duration (Hours)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 1 }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {durationRange[0]} - {durationRange[1]} hours
            </Typography>
            <Slider
              value={durationRange}
              onChange={handleDurationRangeChange}
              valueLabelDisplay="auto"
              min={0}
              max={200}
              step={5}
              sx={{ mt: 1 }}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Minimum Rating */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Minimum Rating
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth size="small">
            <InputLabel>Minimum Rating</InputLabel>
            <Select
              value={localFilters.min_rating || ""}
              onChange={(e) => handleInputChange("min_rating", e.target.value)}
              label="Minimum Rating"
            >
              <MenuItem value="">Any Rating</MenuItem>
              <MenuItem value={1}>1+ Stars</MenuItem>
              <MenuItem value={2}>2+ Stars</MenuItem>
              <MenuItem value={3}>3+ Stars</MenuItem>
              <MenuItem value={4}>4+ Stars</MenuItem>
              <MenuItem value={5}>5 Stars</MenuItem>
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Target Audience */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Target Audience
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth size="small">
            <InputLabel>Target Audience</InputLabel>
            <Select
              value={localFilters.target_audience_id || ""}
              onChange={(e) =>
                handleInputChange("target_audience_id", e.target.value)
              }
              label="Target Audience"
            >
              <MenuItem value="">All Audiences</MenuItem>
              <MenuItem value={1}>Beginners</MenuItem>
              <MenuItem value={2}>Intermediate</MenuItem>
              <MenuItem value={3}>Advanced</MenuItem>
              <MenuItem value={4}>Professionals</MenuItem>
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Course Type */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Course Type
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={localFilters.is_free || false}
                  onChange={(e) =>
                    handleInputChange("is_free", e.target.checked)
                  }
                />
              }
              label="Free Courses"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={localFilters.is_paid || false}
                  onChange={(e) =>
                    handleInputChange("is_paid", e.target.checked)
                  }
                />
              }
              label="Paid Courses"
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Course Level */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Course Level
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth size="small">
            <InputLabel>Course Level</InputLabel>
            <Select
              value={localFilters.level_id || ""}
              onChange={(e) => handleInputChange("level_id", e.target.value)}
              label="Course Level"
            >
              <MenuItem value="">All Levels</MenuItem>
              <MenuItem value={0}>Beginner</MenuItem>
              <MenuItem value={1}>Intermediate</MenuItem>
              <MenuItem value={2}>Advanced</MenuItem>
              <MenuItem value={3}>Expert</MenuItem>
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Specific Rating */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Specific Rating
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Select exact rating
            </Typography>
            <Rating
              value={localFilters.rating || 0}
              onChange={(event, newValue) => {
                handleInputChange("rating", newValue);
              }}
              size="large"
            />
            {localFilters.rating && (
              <Button
                size="small"
                onClick={() => handleInputChange("rating", undefined)}
                sx={{ mt: 1 }}
              >
                Clear Rating
              </Button>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Course Creation Date */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Course Creation Date
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={localFilters.created_this_week || false}
                  onChange={(e) =>
                    handleInputChange("created_this_week", e.target.checked)
                  }
                />
              }
              label="Created This Week"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={localFilters.created_this_month || false}
                  onChange={(e) =>
                    handleInputChange("created_this_month", e.target.checked)
                  }
                />
              }
              label="Created This Month"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={localFilters.created_this_year || false}
                  onChange={(e) =>
                    handleInputChange("created_this_year", e.target.checked)
                  }
                />
              }
              label="Created This Year"
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Action Buttons */}
      <Box sx={{ mt: 3, display: "flex", gap: 1, flexDirection: "column" }}>
        <Button
          variant="contained"
          onClick={handleApplyFilters}
          fullWidth
          startIcon={<FilterList />}
        >
          Apply Filters
        </Button>
        <Button
          variant="outlined"
          onClick={handleResetFilters}
          fullWidth
          startIcon={<Clear />}
        >
          Clear All
        </Button>
      </Box>
    </Drawer>
  );
};
