import React, { useEffect } from "react";
import { useRouter } from "next/router";

import { _CourseService } from "services/course.service";
import { checkoutStore } from "store/checkoutStore";

export const useGetCourseById = () => {
  const router = useRouter();
  const [course, setCourse] = checkoutStore((state) => [
    state.course,
    state.setCourse,
  ]);

  const { query, isReady } = useRouter();

  useEffect(() => {
    if (isReady)
      _CourseService
        .getById(query.id as string)
        .then((res) => {
          if (res.order?.id) {
            router.back();
          }
          setCourse(res);
        })
        .catch((err) => console.error(err));

    return () => {};
  }, [isReady]);

  return { course };
};
