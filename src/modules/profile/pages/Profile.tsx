import React from "react";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";

import { Box, Typography, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import { _AuthService } from "services/auth.service";

import { useMe } from "hooks/useMe";
import { useStudentProfile } from "hooks/useStudentProfile";
import { StringDouble } from "interface/common";

export const Profile = () => {
  const { me } = useMe();
  const { updateProfile, isUpdating } = useStudentProfile();
  const { t } = useTranslation("profile");
  const { locale } = useRouter();

  const handleRefreshProfile = async () => {
    try {
      await updateProfile();
    } catch (error) {
      console.error("Failed to refresh profile:", error);
    }
  };

  const dataTodisplay = [
    {
      label: { en: "First Name", ar: "الاسم الأول" },
      value: me?.first_name,
    },
    {
      label: { en: "Last Name", ar: "الاسم الأخير" },
      value: me?.last_name,
    },
    {
      label: { en: "UserName", ar: "إسم المستخدم" },
      value: me?.username,
    },
    {
      label: { en: "Email", ar: "البريد الإلكتروني" },
      value: me?.email,
    },
    {
      label: { en: "Phone Prefix", ar: "رمز الهاتف" },
      value: me?.prefix_phone_number,
    },
    {
      label: { en: "Phone", ar: "الهاتف" },
      value: me?.phone,
    },
    {
      label: { en: "Extra Phone", ar: "الهاتف الإضافي" },
      value: me?.extra_phone,
    },
    {
      label: { en: "Id Number", ar: "رقم التعريف الشخصي" },
      value: me?.id_number,
    },
    {
      label: { en: "Gender", ar: "الجنس" },
      value: me?.gender,
    },
    {
      label: { en: "Enrollments Count", ar: "عدد التسجيلات" },
      value: me?.enrollments_count?.toString(),
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#FFFEFA",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "10px",
        height: "100%",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: "15px",
          pt: "25px",
          px: "30px",
          borderBottom: "1px solid #EEEEEE",
        }}
      >
        <Typography
          sx={{ color: "primary.main", fontSize: "30px", fontWeight: "700" }}
        >
          {t("profile")}
        </Typography>
        <Button
          onClick={handleRefreshProfile}
          disabled={isUpdating}
          variant="outlined"
          startIcon={<RefreshIcon />}
          size="small"
          sx={{
            borderColor: "primary.main",
            color: "primary.main",
            "&:hover": {
              borderColor: "primary.dark",
              backgroundColor: "primary.light",
            },
          }}
        >
          {isUpdating ? "Updating..." : "Refresh"}
        </Button>
      </Box>
      {/* Registration Date */}
      <Box sx={{ px: "30px", mt: "20px" }}>
        <Typography
          sx={{ fontSize: "18px", fontWeight: "700", color: "primary.main" }}
        >
          {t("register date")}
        </Typography>
        <Typography>
          {me?.created_at
            ? new Date(me.created_at).toLocaleDateString()
            : "22 JAN 2022 | 14 Muharram 1443"}
        </Typography>
      </Box>
      {/* Form */}
      <Box sx={{ mt: "30px", px: "30px", pb: "50px" }}>
        {me && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              rowGap: "20px",
              columnGap: "20px",
              justifyContent: "stretch",
            }}
          >
            {dataTodisplay.map((item, index) => (
              <MyProfileInfoCard
                label={item?.label[locale as keyof StringDouble]}
                value={item?.value}
                key={index}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

const MyProfileInfoCard = (props: {
  label: string;
  value: string | undefined;
}) => {
  if (props?.value)
    return (
      <Box>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "400",
            color: "#1E5B63",
            paddingBottom: "5px",
          }}
        >
          {props?.label}
        </Typography>
        <Box
          sx={{
            borderRadius: "8px",
            backgroundColor: "#EFEFEF",
            py: "17px",
            px: "15px",
            minWidth: "290px",
          }}
        >
          <Typography sx={{ fontSize: "16px" }}>{props?.value}</Typography>
        </Box>
      </Box>
    );

  return <></>;
};
