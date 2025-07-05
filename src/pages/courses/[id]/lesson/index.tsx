import React, { useEffect } from "react";
import { useRouter } from "next/router";

import { Box, Typography } from "@mui/material";

import { Course } from "interface/common";
import { _CourseService } from "services/course.service";
import { courseStore } from "store/courseStore";

import { RatingCard } from "components/shared";
import {
  CourseLearnHero,
  CourseOutlineSection,
  NextAndPrevCard,
  PdfAttachment,
  RenderIcon,
  SessionsList,
  ThereIsTestCard,
  VideoAttachments,
} from "modules";
import { StudentStatus } from "modules/courses/helper/StudentStatusProperties";
import { lessonsGuard } from "modules/courses/helper/lessonsGuard";
import shallow from "zustand/shallow";

interface Props {
  courseId: string | number;
}

const StartLearning = (props: Props) => {
  const [
    attachmentSelected,
    sessionSelected,
    setAttachment,
    setSession,
    setCourse,
    course,
    clearCourseStore,
    setLastAttachmentId,
    lastAttachmentId,
    setAttachmentsArray,
  ] = courseStore(
    (state) => [
      state.attachmentSelected,
      state.sessionSelected,
      state.setAttachment,
      state.setSession,
      state.setCourse,
      state.course,
      state.clearCourseStore,
      state.setLastAttachmentId,
      state.lastAttachmentId,
      state.setAttachmentsArray,
    ],
    shallow
  );

  const router = useRouter();

  const showCourseTestCard =
    attachmentSelected?.id === lastAttachmentId &&
    !Boolean(course?.user_passed_test);

  useEffect(() => {
    // Store the course globaly for fast access

    if (course) {
      if (router.isReady && router.query.session) {
        const query = router.query as any;
        setSession(+query.session as any);
        setAttachment(+query.session as any, +query.attachment as any, course);
      } else {
        setSession((course as Course)?.sessions[0].id as number);
        setAttachment(
          course?.sessions[0].id as number,
          course?.sessions[0].attachments[0].id as number,
          course
        );
      }
    }
  }, [router, course, router.isReady, router.query.session]);

  useEffect(() => {
    _CourseService.getById(props.courseId).then((res) => {
      lessonsGuard(res)
        .then(() => {
          setCourse(res);
          setLastAttachmentId(res);
          setAttachmentsArray(res.sessions);
        })
        .catch(() => {
          router.push({
            pathname: "/courses/[id]",
            query: { id: router.query.id },
          });
        });
    });

    return () => {
      clearCourseStore();
    };
  }, []);

  useEffect(() => {
    // console.log(course?.sessions.slice(-1).pop()?.attachments.slice(-1).pop());

    console.log(course);
    return () => {};
  }, [course]);

  return (
    <Box>
      {course && <CourseLearnHero title={course.name.en} />}
      {course && (
        <CourseOutlineSection
          student_status={
            course.order?.student_status as StudentStatus | undefined
          }
          hours={course.hours}
          level={course.level}
          teacherImage={course.users?.personal_image}
          rate={course.rate}
          teacherName={course.users?.username}
        />
      )}
      <Box sx={{ display: "flex", justifyContent: "center", my: "50px" }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: { xs: "column-reverse", lg: "row" },
            justifyContent: "center",
            columnGap: "40px",
          }}
        >
          {/* Sessions List */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                width: { xs: "95vw", lg: "300px" },
                mt: { xs: "30px", lg: "0px" },
              }}
            >
              <Typography
                sx={{
                  fontSize: "24px",
                  color: "primary.main",
                  fontWeight: "700",
                }}
              >
                Lesson List
              </Typography>
              <Box
                sx={{
                  mt: "20px",
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "15px",
                }}
              >
                {course &&
                  course?.sessions?.map((session, index) => (
                    <SessionsList session={session} key={index} />
                  ))}
              </Box>
            </Box>
          </Box>
          {/* End sessions list */}
          <Box sx={{}}>
            {/* Start video section */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                sx={{
                  position: "relative",
                  width: { xs: "95vw", lg: "600px", xl: "850px" },
                }}
              >
                {attachmentSelected &&
                  attachmentSelected.file_type !== "none" && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: "10px",
                        mb: "20px",
                      }}
                    >
                      {RenderIcon({ type: attachmentSelected.file_type })}
                      <Typography
                        sx={{
                          color: "gray.50",
                          fontWeight: "700",
                          fontSize: "20px",
                        }}
                      >
                        {attachmentSelected.description.en}
                      </Typography>
                    </Box>
                  )}
                {attachmentSelected &&
                  attachmentSelected.file_type !== "none" && (
                    <Box>
                      {attachmentSelected.file_type === "mp4" ? (
                        <Box sx={{ height: "500px" }}>
                          <VideoAttachments
                            url={attachmentSelected.link}
                            themeName="sea"
                          />
                        </Box>
                      ) : (
                        <PdfAttachment
                          type={attachmentSelected.file_type}
                          title={attachmentSelected.description.en}
                          link={attachmentSelected.link}
                        />
                      )}
                    </Box>
                  )}
              </Box>
            </Box>
            {/* End video section */}
            {/* Start video section */}
            {attachmentSelected && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box sx={{ mt: "30px", width: { xs: "95vw", lg: "100%" } }}>
                  <NextAndPrevCard />
                </Box>
              </Box>
            )}
            {/* End video section */}
            {/* Start Attachment test card */}
            {attachmentSelected && attachmentSelected.attchments_tests[0] && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box sx={{ width: { xs: "95vw", lg: "100%" } }}>
                  <ThereIsTestCard
                    testId={attachmentSelected.attchments_tests[0].test_id}
                    message="There is a test after this attachment"
                    // attachmentTest={attachmentSelected.attchments_tests[0]}
                  />
                </Box>
              </Box>
            )}
            {/* End Attachment test card */}
            {/* Start Course test card */}
            {showCourseTestCard &&
              course?.course_test &&
              course?.course_test?.length > 0 && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Box sx={{ width: { xs: "95vw", lg: "100%" } }}>
                    <ThereIsTestCard
                      testId={course?.course_test[0].test_id ?? 0}
                      message="You can take the course final test now"
                      // attachmentTest={attachmentSelected.attchments_tests[0]}
                    />
                  </Box>
                </Box>
              )}
            {/* End Course test card */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default StartLearning;

export const getServerSideProps = async (ctx: any) => {
  return {
    props: {
      courseId: ctx.params.id,
    },
  };
};
