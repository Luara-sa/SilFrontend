import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Rating,
  Avatar,
  CardMedia,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  SelectChangeEvent,
} from "@mui/material";
import {
  CalendarToday,
  AccessTime,
  School,
  Person,
  AttachMoney,
  Groups,
  PlayCircleOutline,
  OnlinePrediction,
  CheckCircle,
  Receipt,
  CloudDownload,
  Warning,
  SelectAllSharp,
} from "@mui/icons-material";
import {
  useDetailedStudentCourse,
  useCourseEnrollment,
  useCourseEnrollmentStatus,
} from "hooks/useStudentCourses";
import { CourseGroup, CourseLevel, TargetAudience } from "interface/common";
import { Seo, PaymentModal, GroupSelectionModal } from "components/shared";
import useTranslation from "next-translate/useTranslation";
import { useAuth } from "contexts/AuthContext";
import { useCourseMappings } from "hooks/useCourseMappings";

const StudentCourseDetailsPage = () => {
  const router = useRouter();
  const { id, payment_success, payment_failed } = router.query;
  const { t } = useTranslation("course");
  const { isAuthenticated } = useAuth();
  const {
    getCourseMode,
    getCourseLevelById,
    getLearningStructure,
    getDeliveryMode,
  } = useCourseMappings();

  // State for payment messages
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showPaymentFailed, setShowPaymentFailed] = useState(false);

  const { courseData, loading, error, refetch } = useDetailedStudentCourse(
    id ? String(id) : null
  );

  const {
    enrollInCourse,
    loading: enrollmentLoading,
    error: enrollmentError,
    success: enrollmentSuccess,
    resetEnrollment,
  } = useCourseEnrollment();

  const {
    enrollmentStatus,
    loading: statusLoading,
    error: statusError,
    refetch: refetchStatus,
  } = useCourseEnrollmentStatus(id ? String(id) : null, !isAuthenticated);

  // State for group selection
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  // State for modals
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);

  // Reset enrollment state when course changes
  useEffect(() => {
    resetEnrollment();
    setSelectedGroupId(null);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle payment success from redirect
  useEffect(() => {
    if (payment_success === "true") {
      setShowPaymentSuccess(true);
      // Refetch enrollment status after successful payment
      refetchStatus();
      // Remove the query parameter from URL
      const newUrl = `/courses/${id}/student-details`;
      router.replace(newUrl, undefined, { shallow: true });

      // Hide the success message after 10 seconds
      setTimeout(() => {
        setShowPaymentSuccess(false);
      }, 10000);
    }
  }, [payment_success, id, refetchStatus, router]);

  // Handle payment failure from redirect
  useEffect(() => {
    if (payment_failed === "true") {
      setShowPaymentFailed(true);
      // Remove the query parameter from URL
      const newUrl = `/courses/${id}/student-details`;
      router.replace(newUrl, undefined, { shallow: true });

      // Hide the failure message after 15 seconds
      setTimeout(() => {
        setShowPaymentFailed(false);
      }, 15000);
    }
  }, [payment_failed, id, router]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={refetch}>
          {t("Try Again")}
        </Button>
      </Box>
    );
  }

  if (!courseData) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          {t("Course not found")}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => router.push("/courses")}
          sx={{ mt: 2 }}
        >
          {t("Back to Courses")}
        </Button>
      </Box>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "online":
        return <OnlinePrediction />;
      case "offline":
        return <School />;
      default:
        return <PlayCircleOutline />;
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case "online":
        return "primary";
      case "offline":
        return "secondary";
      default:
        return "default";
    }
  };

  const handleEnrollment = async () => {
    if (!courseData) return;

    // Check if user is authenticated, if not redirect to login
    if (!isAuthenticated) {
      const currentPath = `/courses/${id}/student-details`;
      router.push(`/auth/login?returnUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Check if group selection is required but not selected
    if (
      courseData.group_assignment_mode === "before_enroll" &&
      courseData.groups.length > 0 &&
      !selectedGroupId
    ) {
      setGroupModalOpen(true);
      return;
    }

    // Get the price from selected group or course
    let coursePrice = 0;
    if (selectedGroupId) {
      const selectedGroup = courseData.groups.find(
        (g: CourseGroup) => g.id === selectedGroupId
      );
      if (selectedGroup) {
        coursePrice =
          selectedGroup.setting.has_discount === 1 &&
          selectedGroup.setting.discounted_price
            ? parseFloat(selectedGroup.setting.discounted_price)
            : parseFloat(selectedGroup.setting.price);
      }
    } else if (courseData.course_price) {
      coursePrice =
        courseData.course_price.discounted_price ||
        courseData.course_price.price ||
        0;
    }

    // Check if course is paid, open payment modal
    const isPaidCourse =
      (selectedGroupId &&
        courseData.groups.find((g: CourseGroup) => g.id === selectedGroupId)
          ?.setting.is_free !== 1) ||
      (!selectedGroupId && courseData.course_setting?.is_free !== 1);

    if (isPaidCourse && coursePrice > 0) {
      setPaymentModalOpen(true);
      return;
    }

    try {
      const response = await enrollInCourse(
        courseData.id,
        "course", // type parameter
        selectedGroupId || undefined // course_group_id parameter
      );
      if (response) {
        // Refetch enrollment status after successful enrollment
        refetchStatus();
      }
    } catch (error) {
      // Error is handled by the hook and displayed in the UI
    }
  };

  // Check if enrollment is disabled due to missing group selection
  const isEnrollmentDisabled = () => {
    if (enrollmentLoading || enrollmentSuccess) return true;

    // If group assignment is required before enrollment but there are no groups available
    if (
      courseData?.group_assignment_mode === "before_enroll" &&
      courseData.groups.length === 0
    ) {
      return true;
    }

    return false;
  };

  // Get the price to display (from selected group or course)
  const getDisplayPrice = () => {
    if (selectedGroupId) {
      const selectedGroup = courseData?.groups.find(
        (g: CourseGroup) => g.id === selectedGroupId
      );
      if (selectedGroup) {
        return {
          price:
            selectedGroup.setting.has_discount === 1 &&
            selectedGroup.setting.discounted_price
              ? selectedGroup.setting.discounted_price
              : selectedGroup.setting.price,
          discountedPrice:
            selectedGroup.setting.has_discount === 1
              ? selectedGroup.setting.discounted_price
              : null,
          originalPrice: selectedGroup.setting.price,
          isFree: selectedGroup.setting.is_free === 1,
        };
      }
    }
    return {
      price:
        courseData?.course_price?.discounted_price ||
        courseData?.course_price?.price ||
        0,
      discountedPrice: courseData?.course_price?.discounted_price,
      originalPrice: courseData?.course_price?.price,
      isFree: courseData?.course_setting?.is_free === 1,
    };
  };

  return (
    <>
      <Seo
        title={courseData.name || "Course Details"}
        description={
          courseData.short_description || "View course details and information"
        }
      />

      <Box sx={{ maxWidth: "1200px", mx: "auto", p: 3 }}>
        {/* Payment Success Message */}
        {showPaymentSuccess && (
          <Alert
            severity="success"
            onClose={() => setShowPaymentSuccess(false)}
            sx={{ mb: 3 }}
          >
            <Typography variant="h6" gutterBottom>
              {t("Payment Successful!")}
            </Typography>
            <Typography variant="body2">
              {t(
                "Your payment has been processed successfully. You are now enrolled in this course!"
              )}
            </Typography>
          </Alert>
        )}

        {/* Payment Failed Message */}
        {showPaymentFailed && (
          <Alert
            severity="error"
            onClose={() => setShowPaymentFailed(false)}
            sx={{ mb: 3 }}
          >
            <Typography variant="h6" gutterBottom>
              {t("Payment Failed")}
            </Typography>
            <Typography variant="body2">
              {t(
                "Unfortunately, your payment could not be processed. Please try again or contact support if the problem persists."
              )}
            </Typography>
          </Alert>
        )}

        {/* Course Header */}
        <Card sx={{ mb: 3 }}>
          <CardMedia
            component="img"
            height="300"
            image={courseData.thumbnail}
            alt={courseData.name}
            sx={{ objectFit: "cover" }}
          />
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  {courseData.name}
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {courseData.short_description}
                </Typography>

                {/* Course Tags */}
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
                  <Chip
                    icon={getModeIcon(courseData.mode)}
                    label={getCourseMode(courseData.mode)}
                    color={getModeColor(courseData.mode) as any}
                    variant="outlined"
                  />
                  <Chip
                    label={getLearningStructure(courseData.learning_structure)}
                    variant="outlined"
                  />
                  <Chip
                    label={getDeliveryMode(courseData.delivery_mode)}
                    variant="outlined"
                  />
                  {courseData.course_setting?.is_free === 1 && (
                    <Chip label={t("Free")} color="success" />
                  )}
                  {courseData.course_setting?.is_live === 1 && (
                    <Chip label={t("Live")} color="error" />
                  )}
                  {courseData.course_setting?.is_upcoming === 1 && (
                    <Chip label={t("Upcoming")} color="warning" />
                  )}
                </Box>

                {/* Rating */}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Rating
                    value={courseData.reviews.average_rating}
                    readOnly
                    precision={0.5}
                  />
                  <Typography variant="body2" color="text.secondary">
                    ({courseData.reviews.total_rating} {t("reviews")})
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                {/* Price Card */}
                <Card variant="outlined" sx={{ p: 3, textAlign: "center" }}>
                  <Box sx={{ mb: 2 }}>
                    {getDisplayPrice().isFree ? (
                      <Typography
                        variant="h3"
                        color="success.main"
                        fontWeight="bold"
                      >
                        {t("Free")}
                      </Typography>
                    ) : (
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {getDisplayPrice().price} ﷼
                        </Typography>
                        {getDisplayPrice().discountedPrice && (
                          <Typography
                            variant="body2"
                            sx={{ textDecoration: "line-through" }}
                            color="text.secondary"
                          >
                            {getDisplayPrice().originalPrice} ﷼
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>

                  {/* Show different content based on enrollment status */}
                  {statusLoading ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mb: 2 }}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  ) : enrollmentStatus?.is_enrollment ? (
                    /* User is already enrolled - show progress */
                    <Box sx={{ mb: 2 }}>
                      <Alert severity="success" sx={{ mb: 2 }}>
                        <Typography variant="body2" fontWeight="500">
                          {t("You are enrolled in this course!")}
                        </Typography>
                      </Alert>

                      {/* Progress Information */}
                      <Card sx={{ mb: 2 }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {t("Your Progress")}
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {t("status")}
                              </Typography>
                              <Chip
                                label={enrollmentStatus.statistic.status}
                                color={
                                  enrollmentStatus.statistic.status ===
                                  "completed"
                                    ? "success"
                                    : "primary"
                                }
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {t("Progress")}
                              </Typography>
                              <Typography variant="body1" fontWeight="500">
                                {enrollmentStatus.statistic.progress}%
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {t("Completed Tasks")}
                              </Typography>
                              <Typography variant="body1" fontWeight="500">
                                {
                                  enrollmentStatus.statistic
                                    .completed_tasks_count
                                }{" "}
                                / {enrollmentStatus.statistic.tasks_count}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>

                      {/* Purchase Details Card - Only show for paid courses */}
                      {enrollmentStatus.purchase_details &&
                        courseData.course_setting?.is_free !== 1 && (
                          <Card sx={{ mb: 2 }}>
                            <CardContent>
                              <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Receipt color="primary" />
                                {t("Purchase Details")}
                              </Typography>

                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {t("Payment Method")}
                                  </Typography>
                                  <Chip
                                    label={
                                      enrollmentStatus.purchase_details.purchase
                                        .payment_method === "bank_transfer"
                                        ? t("Bank Transfer")
                                        : enrollmentStatus.purchase_details
                                            .purchase.payment_method ===
                                          "paymob"
                                        ? t("Credit Card")
                                        : enrollmentStatus.purchase_details
                                            .purchase.payment_method ===
                                          "tamara"
                                        ? t("Tamara")
                                        : enrollmentStatus.purchase_details
                                            .purchase.payment_method
                                    }
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    sx={{ mt: 0.5 }}
                                  />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {t("Payment Status")}
                                  </Typography>
                                  <Chip
                                    label={
                                      enrollmentStatus.purchase_details.purchase
                                        .status
                                    }
                                    color={
                                      enrollmentStatus.purchase_details.purchase
                                        .status === "completed" ||
                                      enrollmentStatus.purchase_details.purchase
                                        .status === "paid" ||
                                      enrollmentStatus.purchase_details.purchase
                                        .status === "success"
                                        ? "success"
                                        : enrollmentStatus.purchase_details
                                            .purchase.status === "pending"
                                        ? "warning"
                                        : "error"
                                    }
                                    size="small"
                                    sx={{ mt: 0.5 }}
                                    icon={
                                      enrollmentStatus.purchase_details.purchase
                                        .status === "pending" ? (
                                        <Warning />
                                      ) : undefined
                                    }
                                  />
                                </Grid>

                                {/* Show uploaded document for bank transfer */}
                                {enrollmentStatus.purchase_details.purchase
                                  .payment_method === "bank_transfer" &&
                                  enrollmentStatus.purchase_details
                                    .document && (
                                    <Grid item xs={12}>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        gutterBottom
                                      >
                                        {t("Uploaded Document")}
                                      </Typography>
                                      <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<CloudDownload />}
                                        onClick={() =>
                                          window.open(
                                            enrollmentStatus.purchase_details
                                              .document,
                                            "_blank"
                                          )
                                        }
                                        sx={{ textTransform: "none" }}
                                      >
                                        {t("View Bank Transfer Receipt")}
                                      </Button>
                                    </Grid>
                                  )}

                                {/* Show installments if available */}
                                {enrollmentStatus.purchase_details
                                  .installments &&
                                  enrollmentStatus.purchase_details.installments
                                    .length > 0 && (
                                    <Grid item xs={12}>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        gutterBottom
                                      >
                                        {t("Installments")}
                                      </Typography>
                                      <Typography variant="body2">
                                        {
                                          enrollmentStatus.purchase_details
                                            .installments.length
                                        }{" "}
                                        {t("installment(s) available")}
                                      </Typography>
                                    </Grid>
                                  )}
                              </Grid>
                            </CardContent>
                          </Card>
                        )}

                      <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ mb: 2 }}
                        onClick={() =>
                          router.push(`/courses/${courseData.id}/curriculum`)
                        }
                      >
                        {t("Continue Learning")}
                      </Button>
                    </Box>
                  ) : (
                    /* User is not enrolled - show enrollment form */
                    <Box sx={{ mb: 2 }}>
                      {/* Group Selection Button (if required) */}
                      {courseData.group_assignment_mode === "before_enroll" && (
                        <>
                          {courseData.groups.length === 0 ? (
                            /* No groups available */
                            <Alert severity="warning" sx={{ mb: 2 }}>
                              {t("No groups available")}
                            </Alert>
                          ) : (
                            /* Show selected group or button to select */
                            <Box sx={{ mb: 2 }}>
                              {selectedGroupId ? (
                                <Card
                                  variant="outlined"
                                  sx={{
                                    p: 2,
                                    backgroundColor: "primary.50",
                                    border: "2px solid",
                                    borderColor: "primary.main",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Box>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        gutterBottom
                                      >
                                        {t("Selected Group")}
                                      </Typography>
                                      <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                      >
                                        {
                                          courseData.groups.find(
                                            (g: CourseGroup) =>
                                              g.id === selectedGroupId
                                          )?.name
                                        }
                                      </Typography>
                                    </Box>
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      onClick={() => setGroupModalOpen(true)}
                                    >
                                      {t("Change")}
                                    </Button>
                                  </Box>
                                </Card>
                              ) : (
                                <Button
                                  variant="outlined"
                                  fullWidth
                                  size="large"
                                  onClick={() => setGroupModalOpen(true)}
                                  startIcon={<Groups />}
                                  sx={{ mb: 1 }}
                                >
                                  {t("Select Course Group")}
                                </Button>
                              )}
                            </Box>
                          )}
                        </>
                      )}

                      <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ mb: 2 }}
                        onClick={handleEnrollment}
                        disabled={isEnrollmentDisabled()}
                        startIcon={
                          enrollmentSuccess ? (
                            <CheckCircle />
                          ) : courseData?.course_setting?.is_free !== 1 ||
                            (selectedGroupId &&
                              courseData?.groups.find(
                                (g: CourseGroup) => g.id === selectedGroupId
                              )?.setting.is_free !== 1) ? (
                            // <AttachMoney />
                            <SelectAllSharp />
                          ) : undefined
                        }
                      >
                        {enrollmentLoading
                          ? t("Processing...")
                          : enrollmentSuccess
                          ? t("Enrolled Successfully!")
                          : courseData?.group_assignment_mode ===
                              "before_enroll" && courseData.groups.length === 0
                          ? t("No Groups Available")
                          : courseData?.group_assignment_mode ===
                              "before_enroll" && !selectedGroupId
                          ? t("Select Group to Continue")
                          : getDisplayPrice().isFree
                          ? t("Enroll Now")
                          : t("Purchase Course")}
                      </Button>
                    </Box>
                  )}

                  {/* Enrollment Error Display */}
                  {enrollmentError && (
                    <Alert
                      severity="error"
                      sx={{ mb: 2 }}
                      action={
                        <Button
                          size="small"
                          color="inherit"
                          onClick={resetEnrollment}
                        >
                          {t("Try Again")}
                        </Button>
                      }
                    >
                      {enrollmentError}
                    </Alert>
                  )}

                  {/* Enrollment Success Display */}
                  {enrollmentSuccess && (
                    <Alert
                      severity="success"
                      sx={{ mb: 2 }}
                      action={
                        <Button
                          size="small"
                          color="inherit"
                          onClick={() => router.push("/profile")}
                        >
                          {t("View My Courses")}
                        </Button>
                      }
                    >
                      {t("Thank you for enrolling in our course!")}
                    </Alert>
                  )}

                  <Typography variant="body2" color="text.secondary">
                    {courseData.enrollments_count}{" "}
                    {courseData.enrollments_count > 1
                      ? t("students enrolled")
                      : t("student enrolled")}
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Course Details Grid */}
        <Grid container spacing={3}>
          {/* Course Information */}
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  {t("Course Information")}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <AccessTime color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {t("Duration")}
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {courseData.duration} {t("days")}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <School color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {t("Topics")}
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {courseData.topics_count} {t("topics")}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <CalendarToday color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {t("Start Date")}
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {formatDate(courseData.start_date)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <CalendarToday color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {t("End Date")}
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {formatDate(courseData.end_date)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {courseData.group_sessions_count > 0 && (
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <Groups color="primary" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {t("Group Sessions")}
                          </Typography>
                          <Typography variant="body1" fontWeight="500">
                            {courseData.group_sessions_count} {t("sessions")}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Category Information */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  {t("Category")}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={courseData.category.image}
                    alt={courseData.category.name}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Typography variant="body1" fontWeight="500">
                    {courseData.category.name}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Course Levels */}
            {courseData.levels.length > 0 && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {t("Course Levels")}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {courseData.levels.map((level: CourseLevel) => (
                      <Chip
                        key={level.id}
                        label={getCourseLevelById(level.id, level.name)}
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Target Audiences */}
            {courseData.target_audiences.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {t("Target Audience")}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {courseData.target_audiences.map(
                      (audience: TargetAudience) => (
                        <Chip
                          key={audience.id}
                          label={audience.name}
                          variant="outlined"
                          color="secondary"
                        />
                      )
                    )}
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Instructor Information */}
          {/* <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  {t("Instructor")}
                </Typography>

                {courseData.instructor ? (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Avatar
                        src={courseData.instructor.image}
                        alt={`${courseData.instructor.first_name} ${courseData.instructor.last_name}`}
                        sx={{ width: 60, height: 60 }}
                      />
                      <Box>
                        <Typography variant="h6" fontWeight="500">
                          {courseData.instructor.first_name}{" "}
                          {courseData.instructor.last_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {courseData.instructor.email}
                        </Typography>
                      </Box>
                    </Box>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {t("Instructor information not available")}
                  </Typography>
                )}

                <Divider sx={{ my: 2 }} />

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => router.push("/courses")}
                >
                  {t("Back to Courses")}
                </Button>
              </CardContent>
            </Card>
          </Grid> */}
        </Grid>
      </Box>

      {/* Group Selection Modal */}
      {courseData &&
        courseData.group_assignment_mode === "before_enroll" &&
        courseData.groups.length > 0 && (
          <GroupSelectionModal
            open={groupModalOpen}
            onClose={() => setGroupModalOpen(false)}
            groups={courseData.groups}
            selectedGroupId={selectedGroupId}
            onSelectGroup={(groupId) => setSelectedGroupId(groupId)}
            onConfirm={handleEnrollment}
          />
        )}

      {/* Payment Modal */}
      {courseData && (
        <PaymentModal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          courseId={courseData.id}
          coursePrice={parseFloat(getDisplayPrice().price?.toString() || "0")}
          courseName={
            typeof courseData.name === "string"
              ? courseData.name
              : courseData.name?.en || courseData.name?.ar || "Course"
          }
          courseGroupId={selectedGroupId || undefined}
        />
      )}
    </>
  );
};

export default StudentCourseDetailsPage;
