import React from "react";
import { Box, SxProps, Theme } from "@mui/material";
import parse from "html-react-parser";

interface HtmlRendererProps {
  content: string;
  sx?: SxProps<Theme>;
}

const HtmlRenderer: React.FC<HtmlRendererProps> = ({ content, sx }) => {
  return (
    <Box
      sx={{
        // Base HTML element styling
        "& p": {
          margin: "8px 0",
          lineHeight: 1.6,
          "&:first-of-type": { marginTop: 0 },
          "&:last-of-type": { marginBottom: 0 },
        },
        "& b, & strong": {
          fontWeight: "bold",
        },
        "& i, & em": {
          fontStyle: "italic",
        },
        "& u": {
          textDecoration: "underline",
        },
        "& a": {
          color: "primary.main",
          textDecoration: "underline",
          "&:hover": {
            textDecoration: "none",
          },
        },
        "& br": {
          display: "block",
          content: '""',
          marginTop: "8px",
        },
        "& h1, & h2, & h3, & h4, & h5, & h6": {
          margin: "16px 0 8px 0",
          fontWeight: "bold",
          "&:first-of-type": { marginTop: 0 },
        },
        "& h1": { fontSize: "2rem" },
        "& h2": { fontSize: "1.75rem" },
        "& h3": { fontSize: "1.5rem" },
        "& h4": { fontSize: "1.25rem" },
        "& h5": { fontSize: "1.125rem" },
        "& h6": { fontSize: "1rem" },
        "& ul, & ol": {
          margin: "8px 0",
          paddingLeft: "20px",
        },
        "& li": {
          margin: "4px 0",
        },
        "& blockquote": {
          margin: "16px 0",
          padding: "8px 16px",
          borderLeft: "4px solid",
          borderLeftColor: "divider",
          backgroundColor: "grey.50",
          fontStyle: "italic",
        },
        "& code": {
          backgroundColor: "grey.100",
          padding: "2px 4px",
          borderRadius: "4px",
          fontSize: "0.875rem",
          fontFamily: "monospace",
        },
        "& pre": {
          backgroundColor: "grey.100",
          padding: "12px",
          borderRadius: "4px",
          overflow: "auto",
          "& code": {
            backgroundColor: "transparent",
            padding: 0,
          },
        },
        "& img": {
          maxWidth: "100%",
          height: "auto",
          borderRadius: "4px",
        },
        "& table": {
          width: "100%",
          borderCollapse: "collapse",
          margin: "16px 0",
        },
        "& th, & td": {
          border: "1px solid",
          borderColor: "divider",
          padding: "8px 12px",
          textAlign: "left",
        },
        "& th": {
          backgroundColor: "grey.50",
          fontWeight: "bold",
        },
        "& hr": {
          border: "none",
          borderTop: "1px solid",
          borderColor: "divider",
          margin: "16px 0",
        },
        // Custom styling can be added via sx prop
        ...sx,
      }}
    >
      {parse(content)}
    </Box>
  );
};

export default HtmlRenderer;
