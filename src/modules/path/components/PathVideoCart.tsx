import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { useMe } from "hooks/useMe";

import { Box, Button } from "@mui/material";

import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import { _StudentRoleService } from "services/studentRole.service";
import useTranslation from "next-translate/useTranslation";
import { CourseIncludeCard } from "modules/courses/components/course-details-components/course-include-card/CourseIncludeCard";
import { OrderStatus } from "modules/courses/components/course-details-components/course-video-cart/OrderStatus/OrderStatus";
import { CertificateRequestAction } from "modules/courses/components/course-details-components/course-video-cart/certificate-request/CertificateRequestAction";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import { _PathService } from "services/path.service";
import { EnrollPath } from "./pathPopup/EnrollPopup";
import { DeleteEnrollPopup } from "./pathPopup/DeleteEnrollPopup";

interface Props {
  courseId: number;
  hours?: number;
  lessons?: number;
  isCertificate?: boolean;
  pathEnroll?: any;
  date?: Date;
  isOffline?: boolean;
  teacherName?: string;
  teacherImage?: string;
  isBaid?: boolean;
  videoSource?: string;
  certificate?: string;
  isCourseCompleted?: boolean;
  order_status?: string | undefined;
}

export const PathVideoCart = (props: Props) => {
  const router = useRouter();
  const { isLogged } = useMe();
  const { t } = useTranslation("course");

  return (
    <>
      <Box
        sx={{
          position: "",
          right: "0",
          mt: { xs: "0", lg: "-210px" },
          pt: { xs: "0", md: "1rem" },
          maxWidth: { xs: "100vw", lg: "350px" },
          width: { xs: "95vw", lg: "290px", xl: "350px" },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", rowGap: "20px" }}>
          {/* Video section */}
          <Box
            sx={{
              backgroundColor: "gray.active",
              overflow: "hidden",
              width: { xs: "95vw", lg: "290px", xl: "350px" },
              position: "relative",
              boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.4)",
              border: "3px solid #FFFFFF",
              borderRadius: "5px",
            }}
          >
            <Box
              sx={{
                backgroundImage: `url(${props?.videoSource})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                width: "100%",

                backgroundColor: "gray.dark",
                height: { xs: "222px", xl: "280px" },
                borderRadius: "5px 5px 0 0",
              }}
            ></Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                // rowGap: "10px",
                justifyContent: "center",
                alignItems: "center",
                px: "13px",
                pb: "15px",
                pt: "20px",
              }}
            >
              {!props.isBaid ? (
                <Box
                  sx={{
                    borderTop: "1px solid #EEEEEE",
                    pt: "15px",
                    // mt: "15px",
                    width: "100%",
                  }}
                >
                  {props?.pathEnroll === false ? (
                    <EnrollPath firstCourseId={props?.courseId} />
                  ) : (
                    <DeleteEnrollPopup
                      enrollId={props?.pathEnroll?.id?.toString()}
                    />
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    borderTop: "1px solid #EEEEEE",
                    pt: "15px",
                    mt: "15px",
                    width: "100%",
                  }}
                >
                  {props?.order_status === "completed" ? (
                    <Link
                      href={{
                        pathname: `/courses/[id]/lesson`,
                        query: {
                          ...router.query,
                          id: router.query.id,
                          // session: path?.sessions[0].id,
                          // attachment: course?.sessions[0].attachments[0].id,
                        },
                      }}
                    >
                      <Button
                        variant="default"
                        fullWidth
                        startIcon={<OutlinedFlagIcon />}
                        sx={{
                          borderRadius: "10px",
                          fontSize: [13, 13, 14, 13, 13],
                        }}
                      >
                        {t("start")}
                      </Button>
                    </Link>
                  ) : (
                    <Box>
                      <OrderStatus status={props?.order_status} />
                    </Box>
                  )}
                </Box>
              )}
              {props.isCourseCompleted && <CertificateRequestAction />}
            </Box>
          </Box>

          {/* Document Order Section */}

          {/* {isLogged && <CourseDocumentOrderCard />} */}

          {/* What's included Section */}
          <CourseIncludeCard
            date={props.date}
            hours={props.hours}
            isCertificate={props.isCertificate}
            isOffline={props.isOffline}
            lessons={props.lessons}
            certificate={props.certificate}
          />
          {/* Teacher card */}
          {/* {props.teacherName && (
            <CourseTeacherCard
              teacherName={props.teacherName}
              teacherImage={props.teacherImage}
            />
          )} */}
        </Box>
      </Box>
    </>
  );
};
