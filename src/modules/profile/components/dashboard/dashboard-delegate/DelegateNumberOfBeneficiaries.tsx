import React, { useEffect } from "react";

import {
  Box,
  CircularProgress,
  circularProgressClasses,
  Typography,
} from "@mui/material";

import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";
import { _DelegateRoleService } from "services/delegateRole.service";
import { profileStore } from "store/profileStore";

export const DelegateNumberOfBeneficiaries = () => {
  const [delegate, setDelegate] = profileStore((state) => [
    state.delegate,
    state.setDelegate,
  ]);

  // useEffect(() => {
  //   _DelegateRoleService
  //     .getDelegateScore()
  //     .then((res) => console.log(res))
  //     .catch((err) => console.log(err));

  //   return () => {};
  // }, []);

  return (
    <Box
      sx={{
        border: "3px solid #B192FF",
        backgroundColor: "#E4DDFF",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "center",
        padding: { xs: "10px 14px 10px 14px", md: "10px 15px 10px 15px" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          columnGap: "15px",
          alignItems: "center",
          pr: { xs: "00", md: "20px" },
          borderRight: "0.5px solid rgba(122, 0, 230, 0.5)",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#4F3590",
            borderRadius: "5px",
            // padding: "3px 5px",
            width: "34px",
            height: "34px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <GroupOutlinedIcon sx={{ color: "gray.active", fontSize: "19px" }} />
        </Box>
        <Typography
          sx={{
            color: "#967CFD",
            fontSize: { xs: "12px", md: "24px" },
            fontWeight: "700",
          }}
        >
          Number Of Beneficiaries
        </Typography>
      </Box>
      <Box sx={{ display: "flex", columnGap: "20px", pl: "20px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", rowGap: "5px" }}>
          <Box sx={{ display: "flex", color: "#967CFD", alignItems: "center" }}>
            <ManIcon sx={{ fontSize: "18px" }} />
            <Typography sx={{ fontSize: "14px", fontWeight: "700" }}>
              60%
            </Typography>
          </Box>
          <Box sx={{ display: "flex", color: "#4F3590", alignItems: "center" }}>
            <WomanIcon sx={{ fontSize: "18px" }} />
            <Typography sx={{ fontSize: "14px", fontWeight: "700" }}>
              40%
            </Typography>
          </Box>
        </Box>
        <Box>
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
              variant="determinate"
              sx={{
                color: "#967CFD",
                zIndex: "1",
                borderRadius: "50px",
                [`& .${circularProgressClasses.circle}`]: {
                  strokeLinecap: "round",
                },
              }}
              size={40}
              thickness={10}
              value={60}
            />
            <CircularProgress
              variant="determinate"
              sx={{
                color: "#4F3590",
                position: "absolute",
                left: 0,
                borderRadius: "50%",
              }}
              size={40}
              thickness={10}
              value={100}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
