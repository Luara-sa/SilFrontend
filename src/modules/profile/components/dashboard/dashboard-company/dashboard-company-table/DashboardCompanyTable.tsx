import React from "react";

import {
  TableBody,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { _CompanyService } from "services/company.service";
import { profileStore } from "store/profileStore";

import { NoDataRow } from "components/shared/table";
import { comanyTableHeaderCells } from "modules/profile/helper/TablesHeaderCells";
import { DashboardCompanyTableBody } from "./DashboardCompanyTableBody";

export const DashboardCompanyTable = () => {
  const [usersCompany] = profileStore((state) => [state.usersCompany]);

  return (
    <TableContainer
      sx={{
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        backgroundImage:
          "linear-gradient(268.86deg, #EDFDFF 0%, #FFFDF6 48.96%, #F0FFF1 96.15%)",
        borderRadius: "5px",
        // textTransform:'capitalize'
      }}
    >
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {comanyTableHeaderCells.map((cell, index) => (
              <TableCell key={index} align={cell.align}>
                {cell.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {usersCompany ? (
            usersCompany.map((student, index) => (
              <DashboardCompanyTableBody key={index} student={student} />
            ))
          ) : (
            <NoDataRow columnNumber={comanyTableHeaderCells.length} />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
