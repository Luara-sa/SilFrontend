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
import { useCourseCurriculum } from "hooks/useStudentCourses";
import { CourseTopic } from "interface/common";
import { Seo, HtmlRenderer } from "components/shared";
import {
  convertToEmbedUrl,
  getIframePermissions,
} from "utils/videoUrlConverter";

const TopicPage = () => {
  const router = useRouter();
  const { id, topicId } = router.query;
  const [currentTopic, setCurrentTopic] = useState<CourseTopic | null>(null);

  const { curriculum, loading, error, isNotPurchased } = useCourseCurriculum(
    id ? String(id) : null
  );

  useEffect(() => {
    if (curriculum?.chapters && topicId) {
      // Find the topic in the curriculum
      for (const chapter of curriculum.chapters) {
        const topic = chapter.topics.find(
          (t: CourseTopic) => t.id === Number(topicId)
        );
        if (topic) {
          setCurrentTopic(topic);
          break;
        }
      }
    }
  }, [curriculum, topicId]);

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
            {getTopicIcon(currentTopic.type)}
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {currentTopic.name}
            </Typography>
            <Chip
              label={currentTopic.type}
              color={getTopicColor(currentTopic.type) as any}
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
            {currentTopic.type === "video" && currentTopic.video_url ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Video Content
                </Typography>
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
                      convertToEmbedUrl(currentTopic.video_url || "").embedUrl
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
                      convertToEmbedUrl(currentTopic.video_url || "").platform
                    )}
                    allowFullScreen
                    title={currentTopic.name}
                    onLoad={() => {
                      console.log("Video loaded successfully");
                    }}
                    onError={(e) => {
                      console.error("Video failed to load:", e);
                      const videoInfo = convertToEmbedUrl(
                        currentTopic.video_url || ""
                      );
                      console.log("Original URL:", currentTopic.video_url);
                      console.log("Embed URL:", videoInfo.embedUrl);
                      console.log("Platform:", videoInfo.platform);
                    }}
                  />
                </Box>

                {/* Fallback link */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Having trouble viewing the video?{" "}
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => {
                        if (currentTopic.video_url) {
                          window.open(currentTopic.video_url, "_blank");
                        }
                      }}
                    >
                      Open in new tab
                    </Button>
                  </Typography>
                </Box>
              </Box>
            ) : currentTopic.type === "pdf" && currentTopic.video_url ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  PDF Document
                </Typography>
                <Box
                  sx={{
                    position: "relative",
                    height: "600px",
                    overflow: "hidden",
                    borderRadius: 1,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <iframe
                    src={`${currentTopic.video_url}#view=FitH`}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                    title={currentTopic.name}
                  />
                </Box>
                {/* PDF download link */}
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<PictureAsPdf />}
                    onClick={() => {
                      if (currentTopic.video_url) {
                        window.open(currentTopic.video_url, "_blank");
                      }
                    }}
                  >
                    Download PDF
                  </Button>
                </Box>
              </Box>
            ) : currentTopic.type === "reading" ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Reading Material
                </Typography>
                <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
                  <Box sx={{ mb: 2 }}>
                    {currentTopic.description ? (
                      <HtmlRenderer content={currentTopic.description} />
                    ) : (
                      <Typography variant="body1" paragraph>
                        Reading content will be available here.
                      </Typography>
                    )}
                  </Box>
                  <Alert severity="info">
                    <Typography variant="body2">
                      This is a reading-based topic. The full content and
                      materials will be provided by your instructor.
                    </Typography>
                  </Alert>
                </Paper>
              </Box>
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
              alert("Topic completed! This feature will be implemented.");
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
