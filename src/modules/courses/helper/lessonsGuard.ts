import { Course } from "interface/common";

export const lessonsGuard = (course: Course) => {
  return new Promise<void>((resolve, reject) => {
    const isOrderStatus = course?.order?.order_status === "completed";
    const isStudentStatus =
      course?.order?.student_status !== "stopped" &&
      course?.order?.student_status !== "frozen";

    if (course?.order) {
      if (isOrderStatus) {
        if (isStudentStatus) resolve();
        else return reject();
      }
      return reject();
    } else return reject();
  });
};
