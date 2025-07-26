import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Paper,
} from "@mui/material";
import {
  ArrowBack,
  PlayCircleOutline,
  MenuBook,
  CheckCircle,
  Lock,
  ShoppingCart,
  PictureAsPdf,
} from "@mui/icons-material";
import { useCourseCurriculum, useTopicContent } from "hooks/useStudentCourses";
import { CourseTopic } from "interface/common";
import { Seo, HtmlRenderer } from "components/shared";
import {
  convertToEmbedUrl,
  getIframePermissions,
} from "utils/videoUrlConverter";
import { toast } from "react-toastify";

const TopicPage = () => {
  const router = useRouter();
  const {
    id,
    topicId,
    chapterId: queryChapterId,
    type: queryType,
  } = router.query;
  const [currentTopic, setCurrentTopic] = useState<CourseTopic | null>(null);
  const [chapterId, setChapterId] = useState<number | null>(null);

  const {
    curriculum,
    loading: curriculumLoading,
    error: curriculumError,
    isNotPurchased,
  } = useCourseCurriculum(id ? String(id) : null);

  // Find topic in curriculum to get basic info and chapter ID
  useEffect(() => {
    // If chapter ID is provided in query, use it directly
    if (queryChapterId) {
      setChapterId(Number(queryChapterId));
    }

    if (curriculum?.chapters && topicId) {
      // Find the topic in the curriculum by ID AND type
      for (const chapter of curriculum.chapters) {
        const topic = chapter.topics.find(
          (t: CourseTopic) =>
            t.id === Number(topicId) &&
            (queryType ? t.type === queryType : true) // Match type if provided in query
        );
        if (topic) {
          setCurrentTopic(topic);
          // Set chapter ID if not already set from query
          if (!queryChapterId) {
            setChapterId(chapter.id);
          }
          break;
        }
      }
    }
  }, [curriculum, topicId, queryChapterId, queryType]);

  // Fetch detailed topic content based on type
  // Use type from query params if available, otherwise use current topic type
  const topicType = (queryType as "video" | "reading") || currentTopic?.type;

  const {
    topicContent,
    loading: contentLoading,
    error: contentError,
    refetch,
  } = useTopicContent(
    id ? String(id) : null,
    chapterId,
    topicId ? String(topicId) : null,
    topicType as "video" | "reading" | null
  );

  const loading = curriculumLoading || contentLoading;
  const error = curriculumError || contentError;

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
              You need to enroll in this course to access the topics and
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
        <Button variant="outlined" onClick={() => router.back()}>
          Go Back
        </Button>
      </Box>
    );
  }

  if (!currentTopic) {
    return (
      <Box sx={{ maxWidth: "800px", mx: "auto", p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Topic not found
        </Typography>
        <Button
          variant="outlined"
          onClick={() => router.push(`/courses/${id}/curriculum`)}
          sx={{ mt: 2 }}
        >
          Back to Curriculum
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
      default:
        return <CheckCircle color="inherit" />;
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
      default:
        return "default";
    }
  };

  return (
    <>
      <Seo
        title={currentTopic.name}
        description={currentTopic.description || "Course topic content"}
      />

      <Box sx={{ maxWidth: "1000px", mx: "auto", p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push(`/courses/${id}/curriculum`)}
            sx={{ mb: 2 }}
          >
            Back to Curriculum
          </Button>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            {getTopicIcon(topicType || currentTopic.type)}
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {currentTopic.name}
            </Typography>
            <Chip
              label={topicType || currentTopic.type}
              color={getTopicColor(topicType || currentTopic.type) as any}
            />
          </Box>

          {/* {currentTopic.description && (
            <HtmlRenderer
              content={currentTopic.description}
              sx={{ color: "text.secondary" }}
            />
          )} */}
        </Box>

        {/* Content */}
        <Card>
          <CardContent>
            {contentLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ ml: 2 }}>
                  Loading {currentTopic?.type} content...
                </Typography>
              </Box>
            ) : contentError ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {contentError}
                <Button onClick={refetch} sx={{ ml: 1 }}>
                  Retry
                </Button>
              </Alert>
            ) : topicContent ? (
              <>
                {/* Video Content */}
                {topicContent.type === "video" && topicContent.video_url ? (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Video Content
                    </Typography>

                    {/* Video Description */}
                    {topicContent.description && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          {topicContent.description}
                        </Typography>
                      </Box>
                    )}

                    <Box
                      sx={{
                        position: "relative",
                        paddingBottom: "56.25%", // 16:9 aspect ratio
                        height: 0,
                        overflow: "hidden",
                        borderRadius: 1,
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <iframe
                        src={
                          convertToEmbedUrl(topicContent.video_url || "")
                            .embedUrl
                        }
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          border: "none",
                        }}
                        allow={getIframePermissions(
                          convertToEmbedUrl(topicContent.video_url || "")
                            .platform
                        )}
                        allowFullScreen
                        title={topicContent.name}
                        onLoad={() => {
                          console.log("Video loaded successfully");
                        }}
                        onError={(e) => {
                          console.error("Video failed to load:", e);
                          const videoInfo = convertToEmbedUrl(
                            topicContent.video_url || ""
                          );
                          console.log("Original URL:", topicContent.video_url);
                          console.log("Embed URL:", videoInfo.embedUrl);
                          console.log("Platform:", videoInfo.platform);
                        }}
                      />
                    </Box>

                    {/* Video Info */}
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Video Source: {topicContent.video_src_type || "Unknown"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Having trouble viewing the video?{" "}
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => {
                            if (topicContent.video_url) {
                              window.open(topicContent.video_url, "_blank");
                            }
                          }}
                        >
                          Open in new tab
                        </Button>
                      </Typography>
                    </Box>

                    {/* Related Topics */}
                    {topicContent.related_topics &&
                      topicContent.related_topics.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="h6" gutterBottom>
                            Related Topics
                          </Typography>
                          <Box
                            sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                          >
                            {topicContent.related_topics.map(
                              (relatedTopic: any) => (
                                <Chip
                                  key={relatedTopic.id}
                                  label={relatedTopic.name}
                                  variant="outlined"
                                  color={
                                    getTopicColor(relatedTopic.type) as any
                                  }
                                  icon={getTopicIcon(relatedTopic.type)}
                                  onClick={() => {
                                    router.push(
                                      `/courses/${id}/topics/${relatedTopic.id}`
                                    );
                                  }}
                                  sx={{ cursor: "pointer" }}
                                />
                              )
                            )}
                          </Box>
                        </Box>
                      )}
                  </Box>
                ) : topicContent.type === "reading" ? (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Reading Material
                    </Typography>

                    <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
                      <Box sx={{ mb: 2 }}>
                        {topicContent.description ? (
                          <HtmlRenderer content={topicContent.description} />
                        ) : (
                          <Typography variant="body1" paragraph>
                            Reading content will be available here.
                          </Typography>
                        )}
                      </Box>
                    </Paper>

                    {/* Related Topics */}
                    {topicContent.related_topics &&
                      topicContent.related_topics.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="h6" gutterBottom>
                            Related Topics
                          </Typography>
                          <Box
                            sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                          >
                            {topicContent.related_topics.map(
                              (relatedTopic: any) => (
                                <Chip
                                  key={relatedTopic.id}
                                  label={relatedTopic.name}
                                  variant="outlined"
                                  color={
                                    getTopicColor(relatedTopic.type) as any
                                  }
                                  icon={getTopicIcon(relatedTopic.type)}
                                  onClick={() => {
                                    router.push(
                                      `/courses/${id}/topics/${relatedTopic.id}`
                                    );
                                  }}
                                  sx={{ cursor: "pointer" }}
                                />
                              )
                            )}
                          </Box>
                        </Box>
                      )}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      Unsupported content type
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Content type: {topicContent.type}
                    </Typography>
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  Content not available
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This topic&apos;s content is being prepared and will be
                  available soon.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            onClick={() => router.push(`/courses/${id}/curriculum`)}
          >
            Back to Curriculum
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              // Mark topic as completed (you can add this functionality later)
              // show a toast message
              toast.success("Topic completed!");
              // show a modal to confirm the action
              // show a modal to confirm the action
            }}
          >
            Mark as Complete
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default TopicPage;
