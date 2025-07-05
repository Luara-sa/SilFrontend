interface HeaderCellType {
  name: string;
  align: "inherit" | "left" | "center" | "right" | "justify" | undefined;
}

export const comanyTableHeaderCells: HeaderCellType[] = [
  { name: "ID", align: "left" },
  { name: "Name", align: "left" },
  { name: "Phone Num", align: "left" },
  { name: "Gender", align: "center" },
  { name: "Courses", align: "center" },
];

export const delegateTableHeaderCells: HeaderCellType[] = [
  // { name: "ID", align: "left" },
  { name: "Name", align: "left" },
  { name: "Gender", align: "center" },
  { name: "Links", align: "left" },
  { name: "Number Of beneficiaries", align: "center" },
];
export const companyStudentCoursesHeaderCell: HeaderCellType[] = [
  { name: "Name", align: "left" },
  { name: "Payment Status", align: "center" },
  { name: "Attendance", align: "center" },
];
