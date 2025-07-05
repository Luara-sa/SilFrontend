import React, { useEffect, useState } from "react";

import {
  Box,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { convertStringToJSON } from "helper/convertStringToJSON";
import { _CompanyService } from "services/company.service";
import { _StudentRoleService } from "services/studentRole.service";

import { NameTableCell } from "../../../shared/NameTableCell";
import { PaymentStatusShip } from "../../../shared/PaymentStatusShip";
import { CircularStatic } from "../../../shared/CircularStatic";
import { StudentOrdersForCompany } from "modules/profile/interfaces/profile-interfaces";
import { LoadingTableRow, NoDataRow } from "components/shared";
import ConditionalRender, { Case } from "components/custom/conditionalRender";
import { companyStudentCoursesHeaderCell } from "modules/profile/helper/TablesHeaderCells";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

interface Props {
  handleClose?: () => void;
  student_id: number;
}

export const StudentCourseTable = (props: Props) => {
  const [studentOrderForCompany, setStudentOrderForCompany] =
    useState<StudentOrdersForCompany[]>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    _CompanyService
      .getStudentOrdersForCompany({
        student_id: props.student_id,
      })
      .then((res) => {
        // res.result.data.forEach((course) => {
        //   let attachmentCount = 0;
        //   let attachmentAtteded = 0;
        //   // Invoke  (attachment_attended_count) to make things easier
        //   // when displaying proggres bar
        //   course.attendance !== "" &&
        //     JSON.parse(course.attendance).forEach((attend: any) => {
        //       attachmentAtteded += attend.attachments.length;
        //     });
        //   course.attachment_attended_count = attachmentAtteded;
        //   // Here invoking (course_attachment_count)
        //   course.course_sessons.forEach((session) => {
        //     attachmentCount += session.session_attachments.length;
        //   });
        //   course.course_attachment_count = attachmentCount;
        // });
        setStudentOrderForCompany(res.result.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));

    return () => {};
  }, []);

  return (
    <Box
      sx={{
        width: "700px",
        // display: "flex",
        // justifyContent: "center",
        backgroundColor: "#FFFEFA",
        padding: "15px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "22px",
            color: "primary.main",
            fontWeight: "700",
          }}
        >
          Students
        </Typography>
        <Box sx={{ cursor: "pointer" }} onClick={props.handleClose}>
          <CloseOutlinedIcon />
        </Box>
      </Box>
      <Box
        sx={{
          mt: "20px",
          background:
            "linear-gradient(268.86deg, #EDFDFF 0%, #FFFDF6 48.96%, #F0FFF1 96.15%)",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
          borderRadius: "5px",
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {companyStudentCoursesHeaderCell.map((cell, index) => (
                <TableCell align={cell.align} key={index}>
                  {cell.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <ConditionalRender
              default={<h1>no condition</h1>}
              condition={true}
              debug
            >
              <Case condition={Boolean(studentOrderForCompany) && !loading}>
                {studentOrderForCompany?.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <NameTableCell
                        name={
                          (convertStringToJSON(course.course_name) as any).en
                        }
                        type="course"
                      />
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <PaymentStatusShip
                          paymentStatus={course.order_status}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <CircularStatic value={75} />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </Case>
              <Case condition={!studentOrderForCompany && !loading}>
                <NoDataRow
                  columnNumber={companyStudentCoursesHeaderCell.length}
                />
              </Case>
              <Case condition={loading}>
                <LoadingTableRow
                  columnNumber={companyStudentCoursesHeaderCell.length}
                />
              </Case>
            </ConditionalRender>
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};
