import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

import useTranslation from "next-translate/useTranslation";

import { useMe } from "hooks/useMe";
import { courseStore } from "store/courseStore";
import { _StudentRoleService } from "services/studentRole.service";

import { Box, Button } from "@mui/material";

import { BeDelegateAction } from "./be-delegate/BeDelegateAction";

import { CourseIncludeCard } from "../course-include-card/CourseIncludeCard";
import { CourseDocumentOrderCard } from "../course-document-order-card/CourseDocumentOrderCard";
import { CertificateRequestAction } from "./certificate-request/CertificateRequestAction";

import { OrderStatus } from "./OrderStatus/OrderStatus";
import ButtonLoader from "components/custom/ButtonLoader";
import { StudentStatus } from "modules/courses/helper/StudentStatusProperties";

import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";

interface Props {
  hours?: number;
  lessons?: number;
  isCertificate?: boolean;
  isPath?: boolean;
  date?: Date;
  isOffline: boolean;
  teacherName?: string;
  teacherImage?: string;
  isBaid: boolean;
  videoSource?: string;
  certificate?: string;
  isCourseCompleted?: boolean;
  order_status?: string | undefined;
  student_status?: StudentStatus;
}

export const CourseVideoCart = (props: Props) => {
  const router = useRouter();
  const { isLogged } = useMe();
  const { t } = useTranslation("course");

  const [course] = courseStore((state) => [state.course]);
  const [isAddtoCartLoading, setIsAddtoCartLoading] = useState(false);

  const handleAddToCart = () => {
    setIsAddtoCartLoading(true);
    _StudentRoleService
      .checkOrderAvailability(router.query.id as string)
      .then((res) => router.push(`/courses/${router.query.id}/checkout`))
      .catch((err) => console.error(err))
      .finally(() => setIsAddtoCartLoading(false));
  };

  const ButtonRender = () => {
    if (
      props?.order_status === "completed" &&
      props?.student_status !== "completed"
    ) {
      return (
        <Link
          href={{
            pathname: `/courses/[id]/lesson`,
            query: {
              ...router.query,
              id: router.query.id,
              session: course?.sessions[0].id,
              attachment: course?.sessions[0].attachments[0].id,
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
      );
    } else if (
      props?.order_status === "completed" &&
      props?.student_status === "completed"
    ) {
      return (
        <Box
          sx={{
            width: "100%",
            height: "40px",
            backgroundColor: "#98E89B",
            color: "rgba(12, 128, 144, 1)",
            display: "flex",
            gap: "3px",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            fontSize: "15px",
            fontWeight: "700",
          }}
        >
          {t("completed course")}
          <VerifiedOutlinedIcon
            sx={{ color: "rgba(12, 128, 144, 0.95)", fontSize: "22px" }}
          />
        </Box>
      );
    } else {
      return (
        <Box>
          <OrderStatus status={props?.order_status} />
        </Box>
      );
    }
  };

  return (
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
            backgroundColor: "#FFFEFA",
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
              backgroundImage: `url(${course?.image || props?.videoSource})`,
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
            <BeDelegateAction />
            {!props.isBaid ? (
              <Box
                sx={{
                  borderTop: "1px solid #EEEEEE",
                  pt: "15px",
                  mt: "15px",
                  width: "100%",
                }}
              >
                {!props?.isPath && (
                  <ButtonLoader
                    loading={isAddtoCartLoading}
                    variant="default"
                    fullWidth
                    onClick={() => handleAddToCart()}
                    startIcon={<AddShoppingCartOutlinedIcon />}
                    sx={{
                      borderRadius: "10px",
                      fontSize: [13, 13, 14, 13, 13],
                      "&:hover": {
                        backgroundColor: "primary.main",
                      },
                    }}
                  >
                    {t("add to cart")}
                  </ButtonLoader>
                )}
                {props?.isPath && (
                  <ButtonLoader
                    loading={isAddtoCartLoading}
                    variant="default"
                    fullWidth
                    startIcon={
                      <Image
                        src="/assets/icons/course/subscriptions.png"
                        width={24}
                        height={24}
                      />
                    }
                    sx={{
                      borderRadius: "10px",
                      fontSize: [13, 13, 14, 13, 13],
                      "&:hover": {
                        backgroundColor: "primary.main",
                      },
                    }}
                  >
                    Enroll Path
                  </ButtonLoader>
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
                {ButtonRender()}
              </Box>
            )}
            {props.isCourseCompleted && <CertificateRequestAction />}
          </Box>
        </Box>

        {/* Document Order Section */}

        {isLogged && <CourseDocumentOrderCard />}

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
  );
};
