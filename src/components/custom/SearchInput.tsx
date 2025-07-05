import React from "react";
import Input from "@mui/material/Input";
import { FormControl, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { TextFieldStyled } from "components/styled";

const SearchInput = () => {
  return (
    <TextFieldStyled
      placeholder="Search"
      variant="outlined"
      fullWidth
      id="search-header-input"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      sx={{
        "&.MuiTextField-root ": {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
          borderRadius: "10px",
        },
      }}
    />
  );
};

export default SearchInput;
