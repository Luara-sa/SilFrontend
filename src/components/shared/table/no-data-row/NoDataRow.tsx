import React from "react";

import { TableCell, TableRow, Typography } from "@mui/material";

interface Props {
  columnNumber: number;
}

export const NoDataRow = (props: Props) => {
  return (
    <TableRow hover>
      <TableCell
        colSpan={props.columnNumber}
        align="center"
        sx={{ py: "20px" }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "600",
            color: "gray.main",
          }}
        >
          No data to show.
        </Typography>
      </TableCell>
    </TableRow>
  );
};
