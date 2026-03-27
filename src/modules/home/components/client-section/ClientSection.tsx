import React from "react";
import Image from "next/image";

import { Box } from "@mui/material";
import Marquee from "react-fast-marquee";

export const ClientSection = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        py: { xs: "15px", md: "30px" },
      }}
    >
      <Marquee speed={100}>
        <Box
          sx={{
            width: "90%",
            display: "flex",
            justifyContent: "space-between",
            columnGap: "24px",
          }}
        >
          <Box
            sx={{
              width: { xs: "60px", md: "150px" },
              height: "100px",
              position: "relative",
            }}
          >
            <Image
              src="/assets/clients/client7.png"
              layout="fill"
              objectFit="contain"
              alt="client 7"
            />
          </Box>
          <Box
            sx={{
              width: { xs: "100px", md: "200px" },
              height: "100px",
              position: "relative",
            }}
          >
            <Image
              src="/assets/clients/client8.png"
              layout="fill"
              objectFit="contain"
              alt="client 8"
            />
          </Box>
          <Box
            sx={{
              width: { xs: "100px", md: "200px" },
              height: "100px",
              position: "relative",
            }}
          >
            <Image
              src="/assets/clients/client9.png"
              layout="fill"
              objectFit="contain"
              alt="client 9"
            />
          </Box>
          <Box
            sx={{
              width: { xs: "100px", md: "200px" },
              height: "100px",
              position: "relative",
            }}
          >
            <Image
              src="/assets/clients/client10.png"
              layout="fill"
              objectFit="contain"
              alt="client 10"
            />
          </Box>
          <Box
            sx={{
              width: { xs: "100px", md: "200px" },
              height: "100px",
              position: "relative",
            }}
          >
            <Image
              src="/assets/clients/client11.png"
              layout="fill"
              objectFit="contain"
              alt="client 11"
            />
          </Box>
          <Box
            sx={{
              width: { xs: "100px", md: "200px" },
              height: "100px",
              position: "relative",
            }}
          >
            <Image
              src="/assets/clients/client12.png"
              layout="fill"
              objectFit="contain"
              alt="client 12"
            />
          </Box>
        </Box>
      </Marquee>
    </Box>
  );
};
