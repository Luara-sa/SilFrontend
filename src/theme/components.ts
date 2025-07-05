import { Components, Theme } from "@mui/material";
import { lightColors } from "./colors";

export const components: Components<Omit<Theme, "components">> | undefined = {
  MuiAvatar: {
    styleOverrides: {
      root: {
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: 0,
      },
    },
  },

  MuiButton: {
    variants: [
      {
        props: { variant: "light" },
        style: {
          padding: "2px",
          backgroundColor: lightColors.gray.active,
          color: lightColors.primary.main,
          "&:hover": {
            backgroundColor: lightColors.gray.active,
            // backgroundColor: "#C62828",
          },
        },
      },
      {
        props: { variant: "default" },
        style: {
          backgroundColor: "rgba(30, 91, 99, 0.2)",
          color: lightColors.primary.main,
          fontWeight: "700",
          fontSize: "0.677vw",
          "&:hover": {
            // backgroundColor: "rgba(30, 91, 99, 0.8)",
            backgroundColor: "#1E5B63",
            color: lightColors.gray.active,
          },
        },
      },
    ],
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        textTransform: "none",
      },
      sizeSmall: {
        padding: "6px 16px",
      },
      sizeMedium: {
        padding: "8px 20px",
      },
      sizeLarge: {
        padding: "11px 24px",
      },
      textSizeSmall: {
        padding: "7px 12px",
      },
      textSizeMedium: {
        padding: "9px 16px",
      },
      textSizeLarge: {
        padding: "12px 16px",
      },
    },
  },
  // MuiButtonBase: {
  //   defaultProps: {
  //     disableRipple: true,
  //   },
  // },
  MuiCardActions: {
    styleOverrides: {
      root: {
        padding: "16px 24px",
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: "32px 24px",
        "&:last-child": {
          paddingBottom: "32px",
        },
      },
    },
  },
  MuiCardHeader: {
    defaultProps: {
      titleTypographyProps: {
        variant: "h6",
      },
      subheaderTypographyProps: {
        variant: "body2",
      },
    },
    // styleOverrides: {
    //   root: {
    //     padding: '32px 24px',
    //   },
    // },
  },
  MuiCheckbox: {
    defaultProps: {
      color: "primary",
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        fontWeight: 500,
      },
    },
  },
  MuiCssBaseline: {
    styleOverrides: {
      "*": {
        boxSizing: "border-box",
      },
      html: {
        MozOsxFontSmoothing: "grayscale",
        WebkitFontSmoothing: "antialiased",
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
        width: "100%",
      },
      body: {
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
        minHeight: "100%",
        width: "100%",
      },
      "#root": {
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      },
      "#nprogress": {
        pointerEvents: "none",
      },
      "#nprogress .bar": {
        backgroundColor: "#5048E5",
        height: 3,
        left: 0,
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 2000,
      },
    },
  },
  MuiIconButton: {
    // styleOverrides: {
    //   root: {
    //     borderRadius: 8,
    //     padding: 8,
    //   },
    //   sizeSmall: {
    //     padding: 4,
    //   },
    // },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: 3,
        overflow: "hidden",
      },
    },
  },
  MuiLink: {
    defaultProps: {
      underline: "hover",
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: {
        marginRight: "16px",
        "&.MuiListItemIcon-root": {
          minWidth: "unset",
        },
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      input: {
        fontWeight: 500,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: "none",
      },
    },
  },
  MuiPopover: {
    defaultProps: {
      elevation: 16,
    },
  },
  MuiRadio: {
    defaultProps: {
      color: "primary",
    },
  },
  MuiSwitch: {
    defaultProps: {
      color: "primary",
    },
  },
  MuiTab: {
    // variants: [
    //   {
    //     props: { variant: "custom" },
    //     style: {
    //       textTransform: "none",
    //       border: `2px dashed `,
    //     },
    //   },
    // ],
    styleOverrides: {
      root: {
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.71,
        minWidth: "auto",
        paddingLeft: 0,
        paddingRight: 0,
        textTransform: "none",
        "& + &": {
          marginLeft: 24,
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        padding: "15px 16px",
      },
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        borderBottom: "none",
        "& .MuiTableCell-root": {
          borderBottom: "none",
          fontSize: "12px",
          fontWeight: 600,
          lineHeight: 1,
          letterSpacing: 0.5,
          textTransform: "uppercase",
        },
        "& .MuiTableCell-paddingCheckbox": {
          paddingTop: 4,
          paddingBottom: 4,
        },

        ".MuiTableCell-root.MuiTableCell-head.MuiTableCell-stickyHeader": {
          backgroundColor: "inherit",
          textTransform: "capitalize",
          borderBottom: "1px solid #B0B0B04D",
          color: "gray.50",
          fontWeight: "700",
          fontSize: "14px",
        },
      },
    },
  },
};
