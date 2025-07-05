import React, { MutableRefObject, useEffect } from "react";
import { eventEmitter } from "services/eventEmitter";
import { SelectValue } from "store/coursesStore";
import { getCourses, getPaths } from "../helper/courses";

export const useFilterSubmit = (params: MutableRefObject<any>) => {
  useEffect(() => {
    eventEmitter.addListener(
      "submit-fliter",
      (param: { selectValueParam: SelectValue }) => {
        param.selectValueParam === "courses"
          ? getCourses(params)
          : getPaths(params);
      }
    );

    return () => {
      eventEmitter.removeAllListeners("submit-fliter");
    };
  }, []);
};
