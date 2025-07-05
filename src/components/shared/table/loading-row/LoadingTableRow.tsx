import React from "react";

import { Skeleton, TableCell, TableRow, Typography } from "@mui/material";

interface Props {
  columnNumber: number;
}

export const LoadingTableRow = (props: Props) => {
  return (
    <TableRow hover>
      <TableCell
        colSpan={props.columnNumber}
        align="center"
        sx={{ padding: "0" }}
      >
        <Skeleton variant="rectangular" height={60} />
      </TableCell>
    </TableRow>
  );
};
