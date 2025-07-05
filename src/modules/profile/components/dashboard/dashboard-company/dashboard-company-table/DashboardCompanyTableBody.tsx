import { Box, TableCell, TableRow, Typography } from "@mui/material";
import {
  StudentOrdersForCompany,
  UsersCompany,
} from "modules/profile/interfaces/profile-interfaces";
import React from "react";
import { GenderShip } from "../../shared/GenderShip";
import { IDship } from "../../shared/IdShip";
import { NameTableCell } from "../../shared/NameTableCell";
import { StudentCourseAction } from "./StudentCourseAction/StudentCourseAction";

interface Props {
  student: UsersCompany;
}

export const DashboardCompanyTableBody = (props: Props) => {
  return (
    <TableRow>
      <TableCell>
        <Box sx={{ display: "flex" }}>
          <IDship id={props.student.id} />
        </Box>
      </TableCell>
      <TableCell>
        <NameTableCell
          name={props.student.username}
          email={props.student.email}
          type="student"
        />
      </TableCell>
      <TableCell>
        <Box>
          <Typography sx={{ color: "#005CAF", fontSize: "14px" }}>
            {props.student.phone}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {props.student.gender && <GenderShip gender={props.student.gender} />}
        </Box>
      </TableCell>
      <TableCell align="center">
        <StudentCourseAction student_id={props.student.id} />
      </TableCell>
    </TableRow>
  );
};
