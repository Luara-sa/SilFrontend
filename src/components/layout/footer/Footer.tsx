import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import useTranslation from "next-translate/useTranslation";

import { Box, Button, Typography, useTheme } from "@mui/material";

import { _CategoriesService } from "services/categories.service";
import { categoryStore } from "store/categoryStore";
import { filterStore } from "store/filterStore";
import { StringDouble } from "interface/common";

export const Footer = () => {
  const theme = useTheme();
  const { locale, push } = useRouter();
  const { t } = useTranslation("footer");

  const setInitFilterParams = filterStore((state) => state.setInitFilterParams);
  const [categories, setCategories] = categoryStore((state) => [
    state.categories,
    state.setCategories,
  ]);

  const params: any = {
    page: 1,
    limit: 20,
    cat_ids: [],
    section: "",
    subscription: "",
    price: [],
    rate: "",
    hours: [],
    level: "",
    tags: "",
  };

  const getCategories = () => {
    _CategoriesService
      .getCategories()
      .then((res) => {
        console.log(res);
        setCategories(res.result);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleCategoryClick = (id: number) => {
    params.cat_ids.push(id);
    setInitFilterParams(JSON.stringify(params));
    push("/courses");
  };

  return (
    <Box
      sx={{
        background: theme.palette.bg_header_front?.main,
        display: "flex",
        justifyContent: "center",
        marginTop: "auto",
      }}
    >
      <Box sx={{ width: "80%" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "auto", md: "40% auto  auto " },
            // grid
            // display: "flex",
            // justifyContent: "space-between",
            pt: "50px",
            pb: "27px",
          }}
        >
          <Box
            sx={{
              justifySelf: { xs: "center", md: "start" },
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: { md: "9.167vw", xs: "31.308vw" },
                height: "100px",
              }}
            >
              <Image
                src="/assets/images/logo-white.svg"
                layout="fill"
                objectFit="contain"
                alt="student"
              />
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: "gray.active",
                maxWidth: "350px",
                mt: "33px",
                display: { xs: "none", md: "block" },
                pr: "20px",
              }}
            >
              Gastropub chillwave lumbersexual umami lyft. Poke austin direct
              trade, marfa raclette letterpress actually. Chartreuse sriracha
              pinterest twee lo-fi try-hard. Meditation banh mi kitsch, prism
              organic hot chicken literally heirloom occupy af semiotics food
              truck.
            </Typography>
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <Link href="/courses">
                <Button
                  variant="contained"
                  color="warning"
                  sx={{
                    borderRadius: "8px",
                    mt: "30px",
                    color: "primary.main",
                    fontWeight: "700",
                    fontSize: "0.938vw",
                  }}
                >
                  {t("explore courses")}
                </Button>
              </Link>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "space-evenly", md: "space-between" },
              // flexDirection: ,
            }}
          >
            <Box sx={{ justifySelf: "start", mt: "30px" }}>
              <Typography
                sx={{
                  fontSize: [18, 18, "1.354vw", "1.354vw", "1.354vw"],
                  fontWeight: "700",
                  color: { xs: "warning.main", md: "gray.active" },
                }}
              >
                {t("pages")}
              </Typography>
              <Box
                sx={{
                  mt: "30px",
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "15px",
                }}
              >
                <Link href="/">
                  <Typography
                    sx={{
                      fontSize: [16, 17, "1.042vw", "1.042vw", "1.042vw"],
                      color: "gray.active",
                      cursor: "pointer",
                    }}
                  >
                    {t("home")}
                  </Typography>
                </Link>
                <Link href="/">
                  <Typography
                    sx={{
                      fontSize: [16, 17, "1.042vw", "1.042vw", "1.042vw"],
                      color: "gray.active",
                      cursor: "pointer",
                    }}
                  >
                    {t("about")}
                  </Typography>
                </Link>
                <Link href="/courses">
                  <Typography
                    sx={{
                      fontSize: [16, 17, "1.042vw", "1.042vw", "1.042vw"],
                      color: "gray.active",
                      cursor: "pointer",
                    }}
                  >
                    {t("courses")}
                  </Typography>
                </Link>
                <Link href="/contact-us">
                  <Typography
                    sx={{
                      fontSize: [16, 17, "1.042vw", "1.042vw", "1.042vw"],
                      color: "gray.active",
                      cursor: "pointer",
                    }}
                  >
                    {t("contact")}
                  </Typography>
                </Link>
              </Box>
            </Box>
            <Box sx={{ justifySelf: "start", mt: "30px" }}>
              <Typography
                sx={{
                  fontSize: [18, 18, "1.354vw", "1.354vw", "1.354vw"],
                  fontWeight: "700",
                  color: { xs: "warning.main", md: "gray.active" },
                }}
              >
                {t("categoris")}
              </Typography>
              <Box
                sx={{
                  mt: "30px",
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "15px",
                }}
              >
                {categories?.map((category, index) => (
                  <Typography
                    onClick={() => handleCategoryClick(category?.id)}
                    sx={{
                      fontSize: [16, 17, "1.042vw", "1.042vw", "1.042vw"],
                      color: "gray.active",
                      cursor: "pointer",
                    }}
                    key={index}
                  >
                    {category?.name[locale as keyof StringDouble]}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              justifySelf: { xs: "center", md: "end" },
              disply: "flex",
              flexDirection: "column",
              // justifyContent: { xs: "center", md: "start" },
              // alignItems: { xs: "center", md: "start" },
              mt: "30px",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: "700",
                color: "gray.active",
                textAlign: { xs: "center", md: "start" },
              }}
            >
              {t("download app")}
            </Typography>
            <Box
              sx={{
                mt: "30px",
                display: "flex",
                flexDirection: "column",
                // justifyContent: "center",
                alignItems: "center",
                rowGap: "15px",
              }}
            >
              <Box
                sx={{
                  cursor: "pointer",
                  width: { lg: "180px", xs: "180px" },
                  height: { lg: "52px", xs: "52px" },
                  position: "relative",
                }}
              >
                <Image
                  src="/assets/images/apple-store.svg"
                  layout="fill"
                  objectFit="contain"
                  alt="apple store"
                  objectPosition="bottom"
                />
              </Box>
              <Box
                sx={{
                  cursor: "pointer",
                  width: { lg: "180px", xs: "180px" },
                  height: { lg: "52px", xs: "52px" },
                  position: "relative",
                }}
              >
                <Image
                  src="/assets/images/google-play.svg"
                  layout="fill"
                  objectFit="contain"
                  alt="Google play"
                  objectPosition="bottom"
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            rowGap: { xs: "10px", md: "0" },
            justifyContent: { xs: "center", md: "space-between" },
            alignItems: "center",
            p: "30px 0px 35px 0px",
            borderTop: "1px solid",
            borderColor: "gray.main",
          }}
        >
          <Typography
            sx={{
              fontSize: [16, 17, "0.990vw", "0.990vw", "0.990vw"],
              color: "gray.active",
            }}
          >
            © {new Date().getFullYear()} SIL Inc. All rights reserved.
          </Typography>
          <Typography
            sx={{
              fontSize: [19, 19, "0.990vw", "0.990vw", "0.990vw"],
              color: "gray.active",
            }}
          >
            POWERED BY IRIS
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
