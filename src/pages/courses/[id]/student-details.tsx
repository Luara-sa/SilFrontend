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
} from "@mui/icons-material";
import {
  useDetailedStudentCourse,
  useCourseEnrollment,
  useCourseEnrollmentStatus,
} from "hooks/useStudentCourses";
import { CourseGroup, CourseLevel, TargetAudience } from "interface/common";
import { Seo } from "components/shared";
import useTranslation from "next-translate/useTranslation";

const StudentCourseDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation("course");

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
  } = useCourseEnrollmentStatus(id ? String(id) : null);

  // State for group selection
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  // Reset enrollment state when course changes
  useEffect(() => {
    resetEnrollment();
    setSelectedGroupId(null);
  }, [id]); // Remove resetEnrollment from dependencies

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
          Try Again
        </Button>
      </Box>
    );
  }

  if (!courseData) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Course not found
        </Typography>
        <Button
          variant="outlined"
          onClick={() => router.push("/courses")}
          sx={{ mt: 2 }}
        >
          Back to Courses
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

    // Check if group selection is required but not selected
    if (
      courseData.group_assignment_mode === "before_enroll" &&
      courseData.groups.length > 0 &&
      !selectedGroupId
    ) {
      return; // Don't proceed with enrollment
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
        console.log("Enrollment successful:", response.message);
      }
    } catch (error) {
      console.error("Enrollment failed:", error);
    }
  };

  // Check if enrollment is disabled due to missing group selection
  const isEnrollmentDisabled = () => {
    if (enrollmentLoading || enrollmentSuccess) return true;

    // If group assignment is required before enrollment and there are groups available
    if (
      courseData?.group_assignment_mode === "before_enroll" &&
      courseData.groups.length > 0 &&
      !selectedGroupId
    ) {
      return true;
    }

    return false;
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
                    label={
                      courseData.mode.charAt(0).toUpperCase() +
                      courseData.mode.slice(1)
                    }
                    color={getModeColor(courseData.mode) as any}
                    variant="outlined"
                  />
                  <Chip
                    label={courseData.learning_structure.replace("_", " ")}
                    variant="outlined"
                  />
                  <Chip label={courseData.delivery_mode} variant="outlined" />
                  {courseData.course_setting.is_free === 1 && (
                    <Chip label="Free" color="success" />
                  )}
                  {courseData.course_setting.is_live === 1 && (
                    <Chip label="Live" color="error" />
                  )}
                  {courseData.course_setting.is_upcoming === 1 && (
                    <Chip label="Upcoming" color="warning" />
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
                    ({courseData.reviews.total_rating} reviews)
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                {/* Price Card */}
                <Card variant="outlined" sx={{ p: 3, textAlign: "center" }}>
                  <Box sx={{ mb: 2 }}>
                    {courseData.course_setting.is_free === 1 ? (
                      <Typography
                        variant="h3"
                        color="success.main"
                        fontWeight="bold"
                      >
                        Free
                      </Typography>
                    ) : (
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {courseData.course_price.discounted_price ||
                            courseData.course_price.price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {courseData.course_price.currency}
                        </Typography>
                        {courseData.course_price.discounted_price && (
                          <Typography
                            variant="body2"
                            sx={{ textDecoration: "line-through" }}
                            color="text.secondary"
                          >
                            {courseData.course_price.price}
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
                          You are enrolled in this course!
                        </Typography>
                      </Alert>

                      {/* Progress Information */}
                      <Card sx={{ mb: 2 }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Your Progress
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Status
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
                                Progress
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
                                Completed Tasks
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

                      <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ mb: 2 }}
                        onClick={() =>
                          router.push(`/courses/${courseData.id}/curriculum`)
                        }
                      >
                        Continue Learning
                      </Button>
                    </Box>
                  ) : (
                    /* User is not enrolled - show enrollment form */
                    <Box sx={{ mb: 2 }}>
                      {/* Group Selection (if required) */}
                      {courseData.group_assignment_mode === "before_enroll" &&
                        courseData.groups.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Select Schedule Group</InputLabel>
                              <Select
                                value={
                                  selectedGroupId
                                    ? selectedGroupId.toString()
                                    : ""
                                }
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setSelectedGroupId(
                                    value === "" ? null : Number(value)
                                  );
                                }}
                                label="Select Schedule Group"
                                displayEmpty
                              >
                                <MenuItem value="">
                                  <em>Select a group</em>
                                </MenuItem>
                                {courseData.groups.map((group: CourseGroup) => (
                                  <MenuItem
                                    key={group.id}
                                    value={group.id.toString()}
                                  >
                                    <Box>
                                      <Typography
                                        variant="body2"
                                        fontWeight="500"
                                      >
                                        {group.name}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        {formatDate(group.start_date)} -{" "}
                                        {formatDate(group.end_date)}
                                        {group.schedules.length > 0 &&
                                          ` • ${group.schedules[0].day} ${group.schedules[0].start_time}-${group.schedules[0].end_time}`}
                                      </Typography>
                                    </Box>
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        )}

                      <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ mb: 2 }}
                        onClick={handleEnrollment}
                        disabled={isEnrollmentDisabled()}
                        startIcon={
                          enrollmentSuccess ? <CheckCircle /> : undefined
                        }
                      >
                        {enrollmentLoading
                          ? "Enrolling..."
                          : enrollmentSuccess
                          ? "Enrolled Successfully!"
                          : courseData?.group_assignment_mode ===
                              "before_enroll" &&
                            courseData.groups.length > 0 &&
                            !selectedGroupId
                          ? "Select Group to Enroll"
                          : "Enroll Now"}
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
                          Try Again
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
                          View My Courses
                        </Button>
                      }
                    >
                      Thank you for enrolling in our course!
                    </Alert>
                  )}

                  <Typography variant="body2" color="text.secondary">
                    {courseData.enrollments_count > 1
                      ? `${courseData.enrollments_count} students enrolled`
                      : `${courseData.enrollments_count} student enrolled`}
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
                  Course Information
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
                          Duration
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {courseData.duration} days
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
                          Topics
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {courseData.topics_count} topics
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
                          Start Date
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
                          End Date
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
                            Group Sessions
                          </Typography>
                          <Typography variant="body1" fontWeight="500">
                            {courseData.group_sessions_count} sessions
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
                  Category
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
                    Course Levels
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {courseData.levels.map((level: CourseLevel) => (
                      <Chip
                        key={level.id}
                        label={level.name}
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
                    Target Audience
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
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Instructor
                </Typography>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
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

                <Divider sx={{ my: 2 }} />

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => router.push("/courses")}
                >
                  Back to Courses
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default StudentCourseDetailsPage;
