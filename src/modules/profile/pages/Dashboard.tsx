import React, { useEffect } from "react";

import { useMe } from "hooks/useMe";
import { RoleType } from "interface/common";

import { DashboardCompanyIndex } from "../components/dashboard/dashboard-company/DashboardCompanyIndex";
import { DashboardDelegateIndex } from "../components/dashboard/dashboard-delegate/DashboardDelegateIndex";
import { DashboardStudentIndex } from "../components/dashboard/dashboard-student/DashboardStudentIndex";
import { DashboardStudentDelegateIndex } from "../components/dashboard/dashboard-student-delegate/DashboardStudentDelegateIndex";

interface Props {
  role?: RoleType[];
}

export const Dashboard = (props: Props) => {
  if (props.role?.includes("company")) {
    return <DashboardCompanyIndex />;
  } else if (
    props.role?.includes("delegate") &&
    props.role?.includes("student")
  ) {
    return <DashboardStudentDelegateIndex />;
  } else if (props.role?.includes("delegate")) {
    return <DashboardDelegateIndex />;
  } else if (props.role?.includes("student")) {
    return <DashboardStudentIndex />;
  }

  return <>No match found</>;
};
