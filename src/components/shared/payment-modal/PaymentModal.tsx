import React, { useState, useCallback } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Divider,
  Alert,
  Input,
} from "@mui/material";
import {
  Close as CloseIcon,
  CreditCard as CreditCardIcon,
  Upload as UploadIcon,
  FileUpload as FileUploadIcon,
} from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import { _WithAuthService } from "services/withAuth.service";
import { eventEmitter } from "services/eventEmitter";
import { _axios } from "interceptors/http-config";

export type PaymentMethod = "paymob" | "tamara" | "offline";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  courseId: number;
  coursePrice: number;
  courseName: string;
  courseGroupId?: number;
}

interface PaymentOption {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  courseId,
  coursePrice,
  courseName,
  courseGroupId,
}) => {
  const { t } = useTranslation("checkout");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string>("");
  const [paymentWindowOpen, setPaymentWindowOpen] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  const paymentOptions: PaymentOption[] = [
    {
      id: "paymob",
      name: "Credit Card",
      description: "Pay securely with your credit or debit card",
      icon: <CreditCardIcon sx={{ fontSize: 40 }} />,
      color: "#1976d2",
    },
    {
      id: "tamara",
      name: "Tamara",
      description: "Buy now, pay later with Tamara",
      icon: (
        <Image
          src="/assets/images/tamara-en.svg"
          alt="Tamara"
          width={100}
          height={100}
          style={{
            objectFit: "cover",
            maxWidth: "100%",
            height: "auto",
          }}
          priority
        />
      ),
      color: "#10b981",
    },
    {
      id: "offline",
      name: "Bank Transfer",
      description: "Upload bank transfer receipt for verification",
      icon: <UploadIcon sx={{ fontSize: 40 }} />,
      color: "#f59e0b",
    },
  ];

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      setUploadError("");

      if (!file) return;

      // Validate file type (accept images and PDFs)
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        setUploadError(
          "Please upload a valid image (JPG, PNG, GIF) or PDF file"
        );
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setUploadError("File size must be less than 5MB");
        return;
      }

      setUploadedFile(file);
    },
    []
  );

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setLoading(true);

    try {
      // Build the redirect URL for successful payment
      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      const redirectUrl = `${baseUrl}/courses/${courseId}/student-details`;

      let paymentData: any = {
        course_id: courseId,
        payment_method: selectedMethod,
        redirect_url: redirectUrl,
        ...(courseGroupId && { course_group_id: courseGroupId }),
      };

      // Handle offline payment with file upload
      if (selectedMethod === "offline") {
        if (!uploadedFile) {
          setUploadError("Please upload a bank transfer receipt");
          setLoading(false);
          return;
        }

        // Create FormData for file upload
        const formData = new FormData();
        formData.append("course_id", courseId.toString());
        // Try different possible values - the API might expect something else
        formData.append("payment_method", "bank_transfer");
        formData.append("bank_document", uploadedFile);

        // Log the form data for debugging
        console.log("Uploading with payment_method:", "bank_transfer");
        console.log("File:", uploadedFile.name, uploadedFile.type);

        if (courseGroupId) {
          formData.append("course_group_id", courseGroupId.toString());
        }

        // Call the student/checkout endpoint directly using axios
        const response = await _axios.post("student/checkout", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        eventEmitter.emit("enqueueSnackbar", {
          message:
            "Bank transfer receipt uploaded successfully. Your enrollment is pending verification.",
          variant: "success",
          snack: {
            autoHideDuration: 5000,
            preventDuplicate: true,
          },
        });
      } else {
        // Handle credit card (paymob) and tamara payments
        // Build the redirect URLs using dedicated callback page
        const baseUrl =
          typeof window !== "undefined" ? window.location.origin : "";
        const successUrl = `${baseUrl}/payment/callback?success=true&course_id=${courseId}`;
        const failureUrl = `${baseUrl}/payment/callback?success=false&course_id=${courseId}`;

        // Store course ID in localStorage as backup
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "pending_payment_course_id",
            courseId.toString()
          );
        }

        const response = await _axios.post("student/checkout", {
          course_id: courseId,
          payment_method: selectedMethod,
          // Send multiple possible parameter names that the backend might use
          success_url: successUrl,
          failure_url: failureUrl,
          error_url: failureUrl,
          callback_url: successUrl,
          redirect_url: successUrl,
          ...(courseGroupId && { course_group_id: courseGroupId }),
        });

        // Log the response for debugging
        console.log("Payment response:", response.data);
        console.log("Success URL:", successUrl);
        console.log("Failure URL:", failureUrl);

        // Check if we have a gateway_url to open in new tab
        if (response.data?.gateway_url) {
          console.log(
            "Opening payment gateway in new tab:",
            response.data.gateway_url
          );

          // Open payment gateway in new tab
          const paymentWindow = window.open(
            response.data.gateway_url,
            "_blank",
            "noopener,noreferrer"
          );

          if (paymentWindow) {
            // Show waiting state in modal
            setPaymentWindowOpen(true);
            setSelectedMethod(null);
            setLoading(false);
          } else {
            console.error("Failed to open payment window - popup blocked!");
            setLoading(false);
          }
          return;
        } else {
          console.warn("No gateway_url in response:", response.data);
          eventEmitter.emit("enqueueSnackbar", {
            message: "Failed to initialize payment. Please try again.",
            variant: "error",
            snack: {
              autoHideDuration: 3000,
              preventDuplicate: true,
            },
          });
        }
      }

      // Only close modal for offline payment (after successful upload)
      if (selectedMethod === "offline") {
        onClose();

        // Optionally refresh the page for offline payment only
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      // For credit card and tamara, keep the modal open so user can see the response
    } catch (error: any) {
      console.error("Payment error:", error);

      let errorMessage = "Payment failed. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      eventEmitter.emit("enqueueSnackbar", {
        message: errorMessage,
        variant: "error",
        snack: {
          autoHideDuration: 5000,
          preventDuplicate: true,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading || paymentWindowOpen) return;
    setSelectedMethod(null);
    setUploadedFile(null);
    setUploadError("");
    onClose();
  };

  const handleCancelPayment = () => {
    setPaymentWindowOpen(false);
    setConfirmingPayment(false);
    onClose();
  };

  const handleConfirmPayment = async () => {
    setConfirmingPayment(true);

    try {
      // Reload page to refresh enrollment data
      window.location.reload();
    } catch (error) {
      setConfirmingPayment(false);
      eventEmitter.emit("enqueueSnackbar", {
        message: "Failed to verify payment. Please try again.",
        variant: "error",
        snack: {
          autoHideDuration: 3000,
          preventDuplicate: true,
        },
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="h2" fontWeight="600">
            Choose Payment Method
          </Typography>
          <IconButton
            onClick={handleClose}
            disabled={loading}
            sx={{ color: "gray.main" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {paymentWindowOpen ? (
          /* Waiting for Payment Confirmation State */
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px",
              textAlign: "center",
              p: 4,
            }}
          >
            {confirmingPayment ? (
              <>
                <CircularProgress size={80} sx={{ mb: 3 }} />
                <Typography variant="h5" gutterBottom fontWeight="600">
                  Verifying Payment...
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Please wait while we check your payment status
                </Typography>
              </>
            ) : (
              <>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    bgcolor: "primary.light",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h2">💳</Typography>
                </Box>
                <Typography variant="h5" gutterBottom fontWeight="600">
                  Complete Your Payment
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3, maxWidth: 500 }}
                >
                  A payment window has been opened in a new tab.
                  <br />
                  After completing your payment, click the button below to
                  refresh and check your enrollment status.
                </Typography>

                <Alert severity="info" sx={{ mb: 3, maxWidth: 500 }}>
                  <Typography variant="body2">
                    <strong>Instructions:</strong>
                  </Typography>
                  <Box
                    component="ol"
                    sx={{ textAlign: "left", mt: 1, mb: 0, pl: 2 }}
                  >
                    <li>Complete the payment in the other tab</li>
                    <li>Return to this window</li>
                    <li>Click &quot;Confirm Payment&quot; below</li>
                  </Box>
                </Alert>

                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleCancelPayment}
                    size="large"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleConfirmPayment}
                    size="large"
                    sx={{ minWidth: 180 }}
                  >
                    Confirm Payment
                  </Button>
                </Box>
              </>
            )}
          </Box>
        ) : (
          <>
            <Box mb={3} p={3} bgcolor="grey.50" borderRadius={2}>
              <Typography variant="h6" gutterBottom color="text.secondary">
                Course Details
              </Typography>
              <Typography variant="h5" gutterBottom fontWeight="600">
                {courseName}
              </Typography>
              <Typography variant="h4" color="primary" fontWeight="700">
                {coursePrice} ﷼
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {paymentOptions.map((option) => (
                <Grid
                  item
                  xs={12}
                  sm={4}
                  key={option.id}
                  sx={{ display: "flex" }}
                >
                  <Card
                    onClick={() => !loading && setSelectedMethod(option.id)}
                    sx={{
                      cursor: loading ? "not-allowed" : "pointer",
                      border: selectedMethod === option.id ? 2 : 1,
                      borderColor:
                        selectedMethod === option.id ? option.color : "divider",
                      backgroundColor:
                        selectedMethod === option.id
                          ? `${option.color}10`
                          : "background.paper",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": loading
                        ? {}
                        : {
                            borderColor: option.color,
                            transform: "translateY(-2px)",
                            boxShadow: 3,
                          },
                      opacity: loading ? 0.6 : 1,
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent
                      sx={{
                        textAlign: "center",
                        py: 3,
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                        minHeight: 220,
                      }}
                    >
                      {loading && selectedMethod === option.id && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            borderRadius: "inherit",
                          }}
                        >
                          <CircularProgress size={30} />
                        </Box>
                      )}
                      <Box
                        sx={{
                          color: option.color,
                          mb: 2,
                          height: 60,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {option.icon}
                      </Box>
                      <Typography variant="h6" gutterBottom fontWeight="600">
                        {option.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ px: 1 }}
                      >
                        {option.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* File Upload for Offline Payment */}
            {selectedMethod === "offline" && (
              <Box
                mt={3}
                p={3}
                border={1}
                borderColor="divider"
                borderRadius={2}
              >
                <Typography variant="h6" gutterBottom>
                  Upload Bank Transfer Receipt
                </Typography>

                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap={2}
                  sx={{
                    border: "2px dashed",
                    borderColor: uploadedFile ? "success.main" : "divider",
                    borderRadius: 2,
                    p: 3,
                    backgroundColor: uploadedFile
                      ? "success.light"
                      : "background.default",
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <FileUploadIcon
                    sx={{ fontSize: 48, color: "text.secondary" }}
                  />

                  {uploadedFile ? (
                    <Box textAlign="center">
                      <Typography
                        variant="body1"
                        color="success.main"
                        fontWeight="600"
                      >
                        ✓ {uploadedFile.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </Typography>
                    </Box>
                  ) : (
                    <Box textAlign="center">
                      <Typography variant="body1" gutterBottom>
                        Click to upload or drag and drop
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Supported formats: JPG, PNG, GIF, PDF (Max 5MB)
                      </Typography>
                    </Box>
                  )}

                  <Input
                    type="file"
                    onChange={handleFileUpload}
                    inputProps={{
                      accept: ".jpg,.jpeg,.png,.gif,.pdf",
                    }}
                    sx={{ display: "none" }}
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button
                      component="span"
                      variant={uploadedFile ? "outlined" : "contained"}
                      color={uploadedFile ? "success" : "primary"}
                      disabled={loading}
                    >
                      {uploadedFile ? "Change File" : "Choose File"}
                    </Button>
                  </label>
                </Box>

                {uploadError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {uploadError}
                  </Alert>
                )}
              </Box>
            )}
          </>
        )}
      </DialogContent>

      {!paymentWindowOpen && (
        <>
          <Divider />

          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose} disabled={loading} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              variant="contained"
              disabled={
                !selectedMethod ||
                loading ||
                (selectedMethod === "offline" && !uploadedFile)
              }
              startIcon={loading ? <CircularProgress size={20} /> : null}
              sx={{ minWidth: 140 }}
            >
              {loading ? "Processing..." : "Continue Payment"}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};
