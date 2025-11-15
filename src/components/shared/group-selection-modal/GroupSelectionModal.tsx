import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  Chip,
  Avatar,
  Grid,
  Divider,
  Alert,
} from "@mui/material";
import {
  CalendarToday,
  AccessTime,
  Person,
  AttachMoney,
  Groups,
  Schedule,
  Close,
} from "@mui/icons-material";
import useTranslation from "next-translate/useTranslation";
import { CourseGroup } from "interface/common";

interface GroupSelectionModalProps {
  open: boolean;
  onClose: () => void;
  groups: CourseGroup[];
  selectedGroupId: number | null;
  onSelectGroup: (groupId: number) => void;
  onConfirm: () => void;
}

export const GroupSelectionModal: React.FC<GroupSelectionModalProps> = ({
  open,
  onClose,
  groups,
  selectedGroupId,
  onSelectGroup,
  onConfirm,
}) => {
  const { t, lang } = useTranslation("course");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      lang === "ar" ? "ar-SA" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  const getDayName = (day: string) => {
    const days: { [key: string]: { en: string; ar: string } } = {
      sunday: { en: "Sunday", ar: "الأحد" },
      monday: { en: "Monday", ar: "الإثنين" },
      tuesday: { en: "Tuesday", ar: "الثلاثاء" },
      wednesday: { en: "Wednesday", ar: "الأربعاء" },
      thursday: { en: "Thursday", ar: "الخميس" },
      friday: { en: "Friday", ar: "الجمعة" },
      saturday: { en: "Saturday", ar: "السبت" },
    };
    return lang === "ar" ? days[day]?.ar : days[day]?.en;
  };

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          {t("Select Course Group")}
        </Typography>
        <Button
          onClick={onClose}
          sx={{ minWidth: "auto", p: 1 }}
          color="inherit"
        >
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t("group selection description")}
        </Typography>

        <RadioGroup
          value={selectedGroupId?.toString() || ""}
          onChange={(e) => onSelectGroup(Number(e.target.value))}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {groups.map((group) => (
              <Card
                key={group.id}
                sx={{
                  border: 2,
                  borderColor:
                    selectedGroupId === group.id
                      ? "primary.main"
                      : "transparent",
                  transition: "all 0.3s",
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: 3,
                    borderColor: "primary.light",
                  },
                }}
                onClick={() => onSelectGroup(group.id)}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <FormControlLabel
                        value={group.id.toString()}
                        control={<Radio />}
                        label=""
                        sx={{ m: 0 }}
                      />
                      <Typography variant="h6" fontWeight="bold">
                        {group.name}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: lang === "ar" ? "left" : "right" }}>
                      {group.setting.is_free === 1 ? (
                        <Chip
                          label={t("Free")}
                          color="success"
                          size="small"
                          sx={{ fontWeight: "bold" }}
                        />
                      ) : (
                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="primary"
                          >
                            {group.setting.has_discount === 1 &&
                            group.setting.discounted_price
                              ? group.setting.discounted_price
                              : group.setting.price}{" "}
                            {t("sar")}
                          </Typography>
                          {group.setting.has_discount === 1 &&
                            group.setting.discounted_price && (
                              <Typography
                                variant="body2"
                                sx={{ textDecoration: "line-through" }}
                                color="text.secondary"
                              >
                                {group.setting.price} {t("sar")}
                              </Typography>
                            )}
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    {/* Instructor */}
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Person color="primary" fontSize="small" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {t("Instructor")}
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            {group.instructor.first_name}{" "}
                            {group.instructor.last_name}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Max Students */}
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Groups color="primary" fontSize="small" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {t("Max Students")}
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            {group.max_students_count} {t("students")}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Start Date */}
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarToday color="primary" fontSize="small" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {t("Start Date")}
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            {formatDate(group.start_date)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {/* End Date */}
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarToday color="primary" fontSize="small" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {t("End Date")}
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            {formatDate(group.end_date)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Mode */}
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Schedule color="primary" fontSize="small" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {t("Course Mode")}
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            {t(`mode.${group.setting.mode}`)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Registration Deadline */}
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <AccessTime color="primary" fontSize="small" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {t("Registration Deadline")}
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            {formatDate(group.expire_joined_date)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Schedules */}
                  {group.schedules && group.schedules.length > 0 && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Box>
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          gutterBottom
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Schedule color="primary" />
                          {t("Class Schedule")}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            mt: 1,
                          }}
                        >
                          {group.schedules.map((schedule) => (
                            <Chip
                              key={schedule.id}
                              label={`${getDayName(schedule.day)}: ${
                                schedule.start_time
                              } - ${schedule.end_time}`}
                              variant="outlined"
                              size="small"
                              color="primary"
                            />
                          ))}
                        </Box>
                      </Box>
                    </>
                  )}

                  {/* Upcoming Badge */}
                  {group.setting.is_upcoming === 1 && (
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={t("Upcoming")}
                        color="warning"
                        size="small"
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        </RadioGroup>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="large"
          sx={{ minWidth: "120px" }}
        >
          {t("cancel")}
        </Button>
        <Button
          onClick={() => {
            if (selectedGroupId) {
              onConfirm();
              onClose();
            }
          }}
          variant="contained"
          size="large"
          disabled={!selectedGroupId}
          sx={{ minWidth: "120px" }}
        >
          {t("Confirm Selection")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

