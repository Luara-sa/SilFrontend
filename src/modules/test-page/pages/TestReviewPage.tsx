import React, { useEffect } from "react";

import { useRouter } from "next/router";

import { Box, Typography } from "@mui/material";

import { _WithAuthService } from "services/withAuth.service";
import { _StudentRoleService } from "services/studentRole.service";

import ConditionalRender, { Case } from "components/custom/conditionalRender";

import { TestHeroSection } from "modules";

import { BlankQuestion } from "../components/test-review/questions/blank-question/BlankQuestion";
import { testReviewStore } from "store/test-review/testreviewStore";
import { TrueFalseQuestion } from "../components/test-review/questions/TrueFalseQuestion";
import { McqQuestion } from "../components/test-review/questions/McqQuestion";
import { TraditionalQuestion } from "../components/test-review/questions/TraditionalQuestion";

export const TestReviewPage = () => {
  // const { t } = useTranslation("test");
  const router = useRouter();

  const isPlacement = router.query.isPlacement === "1";

  const [test, setTest] = testReviewStore((state) => [
    state.test,
    state.setTest,
  ]);

  useEffect(() => {
    if (router.isReady)
      if (router.query.id)
        _WithAuthService
          .getUserTest(router.query.id as string)
          .then((res) => {
            setTest(res.result);
          })
          .catch((err) => console.error(err));

    return () => {
      setTest(undefined);
    };
  }, [router.isReady]);

  const hasQuestion =
    test && Array.isArray(test?.questions) && test?.questions?.length > 0;

  return (
    <Box>
      <TestHeroSection />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: "50px",
        }}
      >
        <Box
          sx={{
            width: { xs: "100vw", lg: "68vw" },
            display: "flex",
            flexDirection: "column",
            padding: "25px",
            boxShadow: " 0px 2px 10px rgba(0, 0, 0, 0.25)",
            borderRadius: "10px",
            backgroundColor: "#fff",
          }}
        >
          {hasQuestion ? (
            <Box
              sx={{ display: "flex", flexDirection: "column", rowGap: "20px" }}
            >
              {test.questions.map((question, index) => (
                <ConditionalRender condition={question.type} key={index}>
                  <Case condition="multiple_choice">
                    <McqQuestion
                      question={question}
                      type={question.type}
                      key={question.id}
                      questionNumber={index + 1}
                      isPlacement={isPlacement}
                    />
                  </Case>
                  <Case condition="blanks">
                    <BlankQuestion
                      question={question}
                      type={question.type}
                      questionNumber={4}
                      isPlacement={isPlacement}
                    />
                  </Case>
                  <Case condition="true_false">
                    <TrueFalseQuestion
                      question={question}
                      type={question.type}
                      key={question.id}
                      questionNumber={index + 1}
                      isPlacement={isPlacement}
                    />
                  </Case>
                  <Case condition="traditional">
                    <TraditionalQuestion
                      key={question.id}
                      question={question}
                      questionNumber={index + 1}
                      isPlacement={isPlacement}
                    />
                  </Case>
                </ConditionalRender>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  color: "primary.main",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                There is no questions
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
