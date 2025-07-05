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
              src="/assets/clients/client1.svg"
              layout="fill"
              objectFit="contain"
              alt="client 1"
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
              src="/assets/clients/client2.svg"
              layout="fill"
              objectFit="contain"
              alt="client 2"
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
              src="/assets/clients/client3.svg"
              layout="fill"
              objectFit="contain"
              alt="client 3"
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
              src="/assets/clients/client4.svg"
              layout="fill"
              objectFit="contain"
              alt="client 4"
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
              src="/assets/clients/client5.svg"
              layout="fill"
              objectFit="contain"
              alt="client 5"
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
              src="/assets/clients/client6.svg"
              layout="fill"
              objectFit="contain"
              alt="client 6"
            />
          </Box>
        </Box>
      </Marquee>
    </Box>
  );
};
