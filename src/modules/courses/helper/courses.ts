import { MutableRefObject } from "react";

import { _CourseService } from "services/course.service";
import { _PathService } from "services/path.service";

import { coursesStore } from "store/coursesStore";

export const getCourses = (paramsRef: MutableRefObject<any>) => {
  const setCourses = coursesStore.getState().setCourses;

  paramsRef.current.page = 1;

  _CourseService
    .getAll(paramsRef.current)
    .then((res) => {
      setCourses(res.result);
    })
    .catch((err) => console.error(err));
};

export const getPaths = (paramsRef: MutableRefObject<any>) => {
  const setPaths = coursesStore.getState().setPaths;

  paramsRef.current.page = 1;

  _PathService
    .getPaths(paramsRef.current)
    .then((res) => {
      setPaths(res.result);
    })
    .catch((err) => console.log(err));
};
