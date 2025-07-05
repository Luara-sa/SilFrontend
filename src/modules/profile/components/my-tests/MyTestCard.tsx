import React from "react";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import { Box, Button, Typography } from "@mui/material";
import { BootstrapTooltip } from "components/styled";
import Link from "next/link";

interface Props {
  name: string;
  mark: number;
  date: string;
  id: number;
}

export const MyTestCard = (props: Props) => {
  const { t } = useTranslation("profile");
  return (
    <Box
      sx={{
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "5px",
        px: "15px",
        minWidth: "290px",
        width: "100%",
        backgroundColor: "#FFFEFA",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: "13px",
          borderBottom: "0.5px solid #EEEEEE",
        }}
      >
        {/* Name section */}
        <Box sx={{ display: "flex", columnGap: "15px" }}>
          <Box
            sx={{
              position: "relative",
              width: "45px",
              minWidth: "45px",
              height: "45px",
              "& img": { borderRadius: "5px" },
            }}
          >
            {/* <Image
              src="/assets/images/product.png"
              objectFit="cover"
              layout="fill"
            /> */}
          </Box>
          <Box>
            <BootstrapTooltip
              title={props.name && props.name?.length > 30 && props.name}
            >
              <Typography
                sx={{ color: "gray.50", fontSize: "14px", fontWeight: "700" }}
              >
                {props.name && props.name?.length > 30
                  ? props.name?.substring(0, 30) + "..."
                  : props.name}
              </Typography>
            </BootstrapTooltip>
            <Typography sx={{ fontSize: "10px", color: "gray.50" }}>
              {props.date}
            </Typography>
          </Box>
        </Box>
        {/* Points Section */}
        <Box>
          <Box sx={{ display: "flex", columnGap: "5px", minWidth: "90px" }}>
            <Typography sx={{ color: "primary.main" }}>My Mark</Typography>
            <Typography sx={{ fontWeight: "700", color: "primary.main" }}>
              {props.mark}%
            </Typography>
          </Box>
        </Box>
      </Box>
      {/* Bottom Section */}
      <Box sx={{ py: "8px" }}>
        <Link href={`/test/review/${props.id}`}>
          <Button
            variant="default"
            sx={{
              height: "35px",
              borderRadius: "10px",
              fontWeight: "700",
              fontSize: "13px",
              px: "20px",
            }}
          >
            {t("review")}
          </Button>
        </Link>
      </Box>
    </Box>
  );
};
