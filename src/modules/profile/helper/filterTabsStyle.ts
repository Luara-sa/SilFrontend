export const filterTabsStyle = {
  "& .MuiTabs-indicator ": {
    height: "100%",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
    borderRadius: "10px",
  },
  "& .MuiTab-root": {
    px: "10px",
    borderRadius: "10px",
    py: "0",
    color: "primary.main",
  },
  "& .MuiTab-root.Mui-selected ": {
    zIndex: 1,
    color: "gray.active",
  },
  "& .MuiTabs-flexContainer": {
    height: "100%",
    maxHeight: "48px",
  },
  " .MuiTab-labelIcon": {
    maxHeight: "48px",
    minHeight: "20px ",
    display: "flex",
    alignItems: "center",
    height: "48px",
  },
};
