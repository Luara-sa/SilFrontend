import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, CircularProgress, Typography, Card, Alert } from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";
import useTranslation from "next-translate/useTranslation";

const PaymentCallback = () => {
  const router = useRouter();
  const { t } = useTranslation("course");
  const [status, setStatus] = useState<"processing" | "success" | "failed">(
    "processing"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Extract payment parameters from URL
    const {
      success,
      pending,
      error,
      txn_response_code,
      course_id,
      order_id,
      ...otherParams
    } = router.query;

    console.log("Payment callback received:", router.query);

    // Check if we have the course_id
    if (!course_id) {
      console.error("No course_id in callback");
      // Try to get it from localStorage as fallback
      const storedCourseId = localStorage.getItem("pending_payment_course_id");
      if (storedCourseId) {
        handleRedirect(success, storedCourseId);
        localStorage.removeItem("pending_payment_course_id");
        return;
      }
      setStatus("failed");
      setMessage("Course information missing");
      setTimeout(() => router.push("/courses"), 3000);
      return;
    }

    // Handle the redirect based on payment status
    handleRedirect(success, course_id as string);
  }, [router.query]);

  const handleRedirect = (success: any, courseId: string) => {
    // Clear any stored payment info
    localStorage.removeItem("pending_payment_course_id");

    // Paymob returns success=true for successful payments
    if (success === "true" || success === true) {
      setStatus("success");
      setMessage("Payment successful! Redirecting...");
      setTimeout(() => {
        router.push(`/courses/${courseId}/student-details?payment_success=true`);
      }, 2000);
    } else {
      setStatus("failed");
      setMessage("Payment failed. Redirecting...");
      setTimeout(() => {
        router.push(`/courses/${courseId}/student-details?payment_failed=true`);
      }, 2000);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        p: 3,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          p: 4,
          textAlign: "center",
        }}
      >
        {status === "processing" && (
          <>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" gutterBottom>
              {t("Processing Payment...")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("Please wait while we verify your payment")}
            </Typography>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle
              sx={{ fontSize: 80, color: "success.main", mb: 2 }}
            />
            <Typography variant="h5" gutterBottom color="success.main">
              {t("Payment Successful!")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {message}
            </Typography>
          </>
        )}

        {status === "failed" && (
          <>
            <Error sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
            <Typography variant="h5" gutterBottom color="error.main">
              {t("Payment Failed")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {message}
            </Typography>
          </>
        )}
      </Card>
    </Box>
  );
};

export default PaymentCallback;

