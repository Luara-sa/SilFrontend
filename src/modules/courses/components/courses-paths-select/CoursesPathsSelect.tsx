import React from "react";

import shallow from "zustand/shallow";

import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";

import { coursesStore, SelectValue } from "store/coursesStore";

export const CoursesPathsSelect = () => {
  const [selectValue, setSelectedValue] = coursesStore(
    (state) => [state.selectValue, state.setSelectedValue],
    shallow
  );

  const handleSelectChange = (
    event: SelectChangeEvent<string>,
    child: React.ReactNode
  ) => {
    const { value } = event.target;
    // console.log(value);
    setSelectedValue(value as SelectValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: "8px", md: "20px" },
      }}
    >
      <Typography
        sx={{
          fontSize: "18px",
          color: { xs: "#AAAAAA", md: "primary.main" },
          fontWeight: "700",
        }}
      >
        Display
      </Typography>
      <FormControl>
        <Select
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "3px",
            border: "2px solid rgba(30, 91, 99, 0.5)",
            boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.25)",
            fontSize: "19px",
            fontWeight: "600",
            color: "#1E5B63",
            width: "246px",
            height: "38px",
          }}
          defaultValue="courses"
          value={selectValue}
          onChange={handleSelectChange}
        >
          <MenuItem value="paths">
            <Typography
              sx={{
                fontSize: "19px",
                fontWeight: "600",
                color: "#1E5B63",
              }}
            >
              Paths
            </Typography>
          </MenuItem>
          <MenuItem value="courses">
            <Typography
              sx={{
                fontSize: "19px",
                fontWeight: "600",
                color: "#1E5B63",
              }}
            >
              Courses
            </Typography>
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
