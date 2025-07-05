import React, { useEffect } from "react";

import {
  TableBody,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
} from "@mui/material";

import { convertStringToJSON } from "helper/convertStringToJSON";
import { _CompanyService } from "services/company.service";
import { profileStore } from "store/profileStore";

import { GenderShip } from "../shared/GenderShip";
import { IDship } from "../shared/IdShip";
import { NameTableCell } from "../shared/NameTableCell";
import { delegateTableHeaderCells } from "modules/profile/helper/TablesHeaderCells";
import { BootstrapTooltip } from "components/styled";
import { NoDataRow } from "components/shared";

export const DashboardDelegateTable = () => {
  const [delegate] = profileStore((state) => [state.delegate]);

  const hasRows =
    Array.isArray(delegate?.table) && delegate?.table?.length! > 0;

  return (
    <TableContainer
      sx={{
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        backgroundImage:
          "linear-gradient(268.86deg, #EDFDFF 0%, #FFFDF6 48.96%, #F0FFF1 96.15%)",
        borderRadius: "5px",
      }}
    >
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {delegateTableHeaderCells.map((cell, index) => (
              <TableCell key={index} align={cell.align}>
                {cell.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {hasRows ? (
            delegate?.table.map((course, index) => {
              const courseName = convertStringToJSON(course.course_name).en;
              return (
                <TableRow key={index}>
                  {/* <TableCell>
                    <Box sx={{ display: "flex" }}>
                      <IDship id={1234} />
                    </Box>
                  </TableCell> */}
                  <BootstrapTooltip
                    title={courseName && courseName?.length > 40 && courseName}
                  >
                    <TableCell>
                      <NameTableCell
                        name={
                          courseName && courseName?.length > 40
                            ? courseName?.substring(0, 40) + "..."
                            : courseName
                        }
                        type="course"
                      />
                    </TableCell>
                  </BootstrapTooltip>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <GenderShip gender={course.course_type} />
                    </Box>
                  </TableCell>
                  <BootstrapTooltip
                    title={
                      course.link && course.link?.length > 35 && course.link
                    }
                  >
                    <TableCell>
                      <Box>
                        <Typography sx={{ color: "#005CAF", fontSize: "14px" }}>
                          {course.link && course.link?.length > 35
                            ? course.link?.substring(0, 35) + "..."
                            : course.link}
                        </Typography>
                      </Box>
                    </TableCell>
                  </BootstrapTooltip>
                  <TableCell>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <IDship id={course.users_used} />
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoDataRow columnNumber={delegateTableHeaderCells.length} />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
