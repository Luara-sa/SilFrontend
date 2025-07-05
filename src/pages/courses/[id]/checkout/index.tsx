import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { Box } from "@mui/material";

import { eventEmitter } from "services/eventEmitter";
import { _CourseService } from "services/course.service";
import { _WithAuthService } from "services/withAuth.service";

import { useProtectedRoute } from "hooks/useProtectedRoute";
import { useBackdropLoader } from "modules/checkout/hooks/usePaymentAction";
import { useGetCourseById } from "modules/checkout/hooks/useGetCourseById";
import { usePaymentURL } from "modules/checkout/hooks/usePaymentURL";
import { useGetPaymentMethods } from "modules/checkout/hooks/useGetPaymentMethods";

import { checkoutStore } from "store/checkoutStore";
import { checkoutSchema } from "validation";
import { calculateTotalPrice } from "helper/calculateTotalPrice";
import { Course } from "interface/common";

import { BillinDetails, CheckoutHero, TotalCard } from "modules";
import { BackdropLoader } from "components/shared";
import { TotalCardLoader } from "modules/checkout/components/total-card/TotalCardLoader";
import { useMe } from "hooks/useMe";

interface Props {
  course: Course;
}

const Checkout = (props: Props) => {
  const { query, push } = useRouter();

  const { isLogged, isThereIsToken, loading } = useMe();
  const { isQueryLoading, urlParams } = usePaymentURL();
  const { hasBackdropLoader } = useBackdropLoader({});
  const { course } = useGetCourseById();
  // useProtectedRoute();
  useGetPaymentMethods();

  const [setDataForApi, setDialog] = checkoutStore((state) => [
    state.setDataForApi,
    state.setDialog,
    // state.
  ]);

  const totalPrice = useMemo(
    () =>
      course
        ? calculateTotalPrice({
            discount: course.discount || 0,
            price: course.price,
            vat: 15,
            type:
              course.discount !== 0
                ? "total with dicount"
                : "total without discount",
          })
        : 0,
    [course?.price]
  );

  const formOptions = { resolver: yupResolver(checkoutSchema) };
  const {
    register,
    handleSubmit,
    formState,
    setValue: setForm,
    getValues: getFormValue,
    trigger: triggerForm,
  } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit(input: any) {
    if (course)
      setDataForApi({
        live_course_id: course.id,
        // moyasar_payment_id: 2,
        // payment_id: 4,
        bank_account_id: 1,
        // bank_name: "test",
        // bank_image: "dddd",
        // class_id: 1,
        bank_number: +input?.bank_number || 0,
        amount: course.price,
        discount: course.discount,
        totalWithVat: totalPrice,
        paid_type: 1,
        dataForMoyasar: {
          source: { ...input, type: "creditcard" },
          publishable_api_key:
            "pk_test_836GefpUCozvxPpsq6Gy3tPam1x3iikQfVZPwSQC",
          amount: 100,
          callback_url: `${window.location.protocol}//${
            window.location.host
          }/courses/${(query as any).id}/checkout`,
          type: "creditcard",
          description: "Order id 1234 by guest",
        },
      });
    setDialog(true);
  }

  useEffect(() => {
    eventEmitter.addListener("checkout", () => {
      handleSubmit(onSubmit)();
    });
    return () => {
      eventEmitter.removeAllListeners("checkout");
    };
  }, []);

  if (loading) return <></>;

  if (!isThereIsToken && !isLogged) push("/");

  return (
    <>
      <BackdropLoader open={hasBackdropLoader} />
      <CheckoutHero />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              columnGap: "20px",
              rowGap: "20px",
              width: { xs: "95%", lg: "90%", xl: "80.75vw" },
              // minWidth: { lg: "950px" },
              my: "76px",
            }}
          >
            <Box
              sx={{
                // flex: { xs: "1", lg: "0.60" },
                width: { xs: "100%", lg: "60%", xl: "70%" },
              }}
            >
              <BillinDetails
                register={register}
                setForm={setForm}
                errors={errors}
                getFormValue={getFormValue}
                triggerForm={triggerForm}
              />
            </Box>
            <Box sx={{ width: { xs: "100%", lg: "30%" } }}>
              {course ? (
                <TotalCard
                  price={course.price}
                  discount={course.discount}
                  courseName={course.name}
                  courseRating={course.rate}
                />
              ) : (
                <TotalCardLoader />
              )}
            </Box>
          </Box>
        </Box>
      </form>
    </>
  );
};

export default Checkout;

export const getServerSideProps = async (ctx: any) => {
  return {
    props: {
      // course: course,
    },
  };
};
