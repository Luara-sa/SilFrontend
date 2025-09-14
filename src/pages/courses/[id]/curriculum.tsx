import React from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
} from "@mui/material";
import {
  ExpandMore,
  PlayCircleOutline,
  MenuBook,
  ArrowBack,
  School,
  ShoppingCart,
  Lock,
  CheckCircle,
  PictureAsPdf,
  Quiz,
  VideoCall,
  AccessTime,
  CalendarToday,
} from "@mui/icons-material";
import { useCourseCurriculum } from "hooks/useStudentCourses";
import { CourseChapter, CourseTopic, CourseSession } from "interface/common";
import { Seo, HtmlRenderer } from "components/shared";
import useTranslation from "next-translate/useTranslation";

const CourseCurriculumPage = () => {
  const { t } = useTranslation("course");
  const router = useRouter();
  const { id } = router.query;

  const { curriculum, loading, error, isNotPurchased, refetch } =
    useCourseCurriculum(id ? String(id) : null);

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

  // Handle course not purchased case
  if (isNotPurchased) {
    return (
      <Box sx={{ maxWidth: "800px", mx: "auto", p: 3 }}>
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Lock sx={{ fontSize: 64, color: "warning.main", mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Course Not Purchased
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You need to enroll in this course to access the curriculum and
              learning materials.
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                startIcon={<ShoppingCart />}
                onClick={() => router.push(`/courses/${id}/student-details`)}
                size="large"
              >
                Enroll Now
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push("/courses")}
                size="large"
              >
                Browse Courses
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: "800px", mx: "auto", p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={refetch}>
          Try Again
        </Button>
      </Box>
    );
  }

  if (!curriculum) {
    return (
      <Box sx={{ maxWidth: "800px", mx: "auto", p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Curriculum not found
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

  const getTopicIcon = (type: string) => {
    switch (type) {
      case "video":
        return <PlayCircleOutline color="primary" />;
      case "reading":
        return <MenuBook color="secondary" />;
      case "pdf":
        return <PictureAsPdf color="error" />;
      case "quiz":
        return <Quiz color="warning" />;
      default:
        return <School color="inherit" />;
    }
  };

  const getTopicColor = (type: string) => {
    switch (type) {
      case "video":
        return "primary";
      case "reading":
        return "secondary";
      case "pdf":
        return "error";
      case "quiz":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <>
      <Seo
        title={`Course Curriculum - Course ${id}`}
        description="View course curriculum and learning materials"
      />

      <Box sx={{ maxWidth: "800px", mx: "auto", p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push(`/courses/${id}/student-details`)}
            sx={{ mb: 2 }}
          >
            Back to Course Details
          </Button>

          <Typography variant="h4" gutterBottom fontWeight="bold">
            Course Curriculum
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {curriculum.chapters.length === 0
              ? "No curriculum available yet"
              : `${curriculum.chapters.length} chapter${
                  curriculum.chapters.length > 1 ? "s" : ""
                } available`}
          </Typography>
        </Box>

        {/* No Curriculum Available */}
        {curriculum.chapters.length === 0 && (
          <Card>
            <CardContent sx={{ textAlign: "center", py: 6 }}>
              <School sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Curriculum Coming Soon
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The course curriculum is being prepared and will be available
                soon. Check back later for updates.
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Curriculum Chapters */}
        {curriculum.chapters.map((chapter: CourseChapter, index: number) => (
          <Accordion key={chapter.id} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Typography variant="h6" fontWeight="500">
                  {index + 1}. {chapter.name}
                </Typography>
                <Chip
                  label={`${chapter.topics_count} topic${
                    chapter.topics_count > 1 ? "s" : ""
                  }`}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {chapter.topics.map(
                  (topic: CourseTopic, topicIndex: number) => {
                    // Check if this topic should be accessible
                    const isFirstTopic = topicIndex === 0;

                    // Check if previous topic is completed (for progression)
                    let isAccessible = isFirstTopic;
                    let isCompleted = topic.progress_status === "completed";

                    if (!isFirstTopic && topicIndex > 0) {
                      const previousTopic = chapter.topics[topicIndex - 1];
                      // Check if previous topic is completed using progress_status from API
                      isAccessible =
                        previousTopic.progress_status === "completed";
                    }

                    const isQuizTopic = topic.type === "quiz";

                    return (
                      <React.Fragment key={topic.id}>
                        <ListItem
                          sx={{
                            cursor: isAccessible ? "pointer" : "not-allowed",
                            opacity: isAccessible ? 1 : 0.5,
                            "&:hover": isAccessible
                              ? {
                                  backgroundColor: "action.hover",
                                }
                              : {},
                            borderRadius: 1,
                            mb: 1,
                          }}
                          onClick={() => {
                            if (!isAccessible) return;
                            // Handle topic click - navigate to topic page with chapter context
                            router.push(
                              `/courses/${id}/topics/${topic.id}?chapterId=${chapter.id}&type=${topic.type}`
                            );
                          }}
                        >
                          <ListItemIcon>
                            {!isAccessible ? (
                              <Lock color="disabled" />
                            ) : isCompleted ? (
                              <CheckCircle color="success" />
                            ) : (
                              getTopicIcon(topic.type)
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Typography variant="body1" fontWeight="500">
                                  {topic.name}
                                </Typography>
                                <Chip
                                  label={topic.type}
                                  size="small"
                                  color={getTopicColor(topic.type) as any}
                                />
                              </Box>
                            }
                            secondary={
                              topic.description ? (
                                <HtmlRenderer
                                  content={topic.description}
                                  sx={{
                                    color: "text.secondary",
                                    fontSize: "0.875rem",
                                    lineHeight: 1.43,
                                    "& p": {
                                      margin: "4px 0",
                                      "&:first-of-type": { marginTop: 0 },
                                      "&:last-of-type": { marginBottom: 0 },
                                    },
                                  }}
                                />
                              ) : null
                            }
                          />
                        </ListItem>
                        {topicIndex < chapter.topics.length - 1 && (
                          <Divider sx={{ ml: 7 }} />
                        )}
                      </React.Fragment>
                    );
                  }
                )}
              </List>

              {/* Sessions Section */}
              {chapter.sessions && chapter.sessions.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, px: 2, fontWeight: 600 }}
                  >
                    Live Sessions
                  </Typography>
                  <List>
                    {chapter.sessions.map((session: CourseSession) => (
                      <ListItem
                        key={session.id}
                        sx={{
                          borderRadius: 1,
                          mb: 1,
                          backgroundColor: "action.hover",
                        }}
                      >
                        <ListItemIcon>
                          <VideoCall color="info" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                flexWrap: "wrap",
                              }}
                            >
                              <Typography variant="body1" fontWeight="500">
                                {session.name}
                              </Typography>
                              {session.zoom_link && (
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="primary"
                                  startIcon={<VideoCall />}
                                  onClick={() =>
                                    session.zoom_link &&
                                    window.open(session.zoom_link, "_blank")
                                  }
                                  sx={{ ml: "auto" }}
                                >
                                  Join Session
                                </Button>
                              )}
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              {session.description && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 1 }}
                                >
                                  {session.description}
                                </Typography>
                              )}
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 2,
                                  alignItems: "center",
                                }}
                              >
                                {session.date && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 0.5,
                                    }}
                                  >
                                    <CalendarToday sx={{ fontSize: 16 }} />
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {new Date(
                                        session.date
                                      ).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                )}
                                {session.start_time && session.end_time && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 0.5,
                                    }}
                                  >
                                    <AccessTime sx={{ fontSize: 16 }} />
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {session.start_time} - {session.end_time}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </AccordionDetails>
          </Accordion>
        ))}

        {/* Summary Card */}
        {curriculum.chapters.length > 0 && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Course Summary
              </Typography>
              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Chapters
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {curriculum.chapters.length}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Topics
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {curriculum.chapters.reduce(
                      (acc: number, chapter: CourseChapter) =>
                        acc + chapter.topics_count,
                      0
                    )}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Video Topics
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {curriculum.chapters.reduce(
                      (acc: number, chapter: CourseChapter) =>
                        acc +
                        chapter.topics.filter(
                          (topic: CourseTopic) => topic.type === "video"
                        ).length,
                      0
                    )}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Reading Topics
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {curriculum.chapters.reduce(
                      (acc: number, chapter: CourseChapter) =>
                        acc +
                        chapter.topics.filter(
                          (topic: CourseTopic) => topic.type === "reading"
                        ).length,
                      0
                    )}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    PDF Topics
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {curriculum.chapters.reduce(
                      (acc: number, chapter: CourseChapter) =>
                        acc +
                        chapter.topics.filter(
                          (topic: CourseTopic) => topic.type === "pdf"
                        ).length,
                      0
                    )}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </>
  );
};

export default CourseCurriculumPage;
