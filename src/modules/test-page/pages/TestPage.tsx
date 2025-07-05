import React, { useEffect, useRef, useState } from "react";

import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import shallow from "zustand/shallow";

import { Box, Button } from "@mui/material";

import { _WithAuthService } from "services/withAuth.service";
import { _StudentRoleService } from "services/studentRole.service";
import { testStore } from "store/testStore";
import { eventEmitter } from "services/eventEmitter";

import ConditionalRender, { Case } from "components/custom/conditionalRender";

import { TestHeroSection } from "modules";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { ExperimentalPopup } from "../components/test/ExperimentalPopup/ExperimentalPopup";
import { McqQuestion } from "../components/test/questions/McqQuestion";
import { BlankQuestion } from "../components/test/questions/blank-question/BlankQuestion";
import { TrueFalseQuestion } from "../components/test/questions/TrueFalseQuestion";
import { CancelButton } from "../components/test/cancel-button/CancelButton";
import { CompleteTestPopup } from "../components/complete-popup/CompleteTestPopup";
import ButtonLoader from "components/custom/ButtonLoader";
import { TraditionalQuestion } from "../components/test/questions/TraditionalQuestion";
// =======
// import { McqQuestion, TestHeroSection } from "modules";
// import { CancelButton } from "../components/cancel-button/CancelButton";
// import { CompleteTestPopup } from "../components/complete-popup/CompleteTestPopup";
// import ButtonLoader from "components/custom/ButtonLoader";

// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// >>>>>>> New-intercepotr

export const TestPage = () => {
  const { t } = useTranslation("test");
  const router = useRouter();

  const completeTestPopupRef = useRef<any>(null);

  const [isExperimentalPop, setIsExperimentalPop] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const isPlacement = router.query.isPlacement === "1";

  const handleCloseExperimentalPopup = () => setIsExperimentalPop(false);
  const handleOpenExperimentalPopup = () => setIsExperimentalPop(true);

  const [
    test,
    setTest,
    clearTest,
    answers,
    clearAnswer,
    mark,
    setMark,
    clearMark,
    claculateTotalDefaultPoint,
  ] = testStore(
    (state) => [
      state.test,
      state.setTest,
      state.clearTest,
      state.answers,
      state.clearAnswer,
      state.mark,
      state.setMark,
      state.clearMark,
      state.claculateTotalDefaultPoint,
    ],
    shallow
  );

  useEffect(() => {
    if (router.isReady)
      if (isPlacement) {
        _WithAuthService
          .getPlacementTests()
          .then((res) => {
            setTest(res.result.data.data[0]);
            claculateTotalDefaultPoint(res.result.data.data[0]);
          })
          .catch((err) => console.error(err));
      } else if (router.query.testId)
        _WithAuthService
          .getTestDetailsbyId(router.query.testId as string)
          .then((res) => {
            setTest(res.result);
            claculateTotalDefaultPoint(res.result);
          })
          .catch((err) => console.error(err));

    return () => {
      clearTest();
      clearAnswer();
      clearMark();
    };
  }, [router.query]);

  const handleSubmit = () => {
    if (Array.isArray(answers) && answers.length > 0) {
      if (test?.is_experimental === 1) {
        handleOpenExperimentalPopup();
      } else {
        setIsSubmitLoading(true);
        _StudentRoleService
          .userPassedTest({
            test_id: test?.id,
            answers: answers,
          })
          .then((res) => {
            setMark(res.result.mark);
            completeTestPopupRef?.current?.handleOpen();
          })
          .catch((err) => console.log(err))
          .finally(() => setIsSubmitLoading(false));
      }
    } else {
      eventEmitter.emit("enqueueSnackbar", {
        message: "You have to answer to at least one question",
        variant: "error",
        snack: {
          autoHideDuration: 3000,
          preventDuplicate: true,
        },
      });
    }
  };

  return (
    <Box>
      <CompleteTestPopup mark={mark} ref={completeTestPopupRef} />
      <TestHeroSection />
      <ExperimentalPopup
        handleClose={handleCloseExperimentalPopup}
        open={isExperimentalPop}
        onSuccess={() => completeTestPopupRef?.current?.handleOpen()}
      />
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
          {test && (
            <Box
              sx={{ display: "flex", flexDirection: "column", rowGap: "20px" }}
            >
              {test.questions.map((question, index) => (
                <ConditionalRender condition={question.type} key={index}>
                  <Case condition="multiple_choice">
                    <McqQuestion
                      question={question}
                      key={question.id}
                      questionNumber={index + 1}
                      isPlacement={isPlacement}
                    />
                  </Case>
                  <Case condition="blanks">
                    <BlankQuestion
                      question={question}
                      questionNumber={4}
                      isPlacement={isPlacement}
                    />
                  </Case>
                  <Case condition="true_false">
                    <TrueFalseQuestion
                      question={question}
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
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: "30px",
            }}
          >
            <CancelButton />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: { xs: "column", xl: "row" },
                rowGap: "20px",
                columnGap: "10px",
                justifyContent: "space-between",
              }}
            >
              <Button
                onClick={() => clearAnswer()}
                startIcon={<img src="/assets/icons/reset.svg" />}
                sx={{ px: "40px", borderRadius: "3px" }}
              >
                {t("reset")}
              </Button>
              <ButtonLoader
                loading={isSubmitLoading}
                disableOnLoading
                onClick={() => handleSubmit()}
                startIcon={<CheckCircleOutlineIcon />}
                sx={{
                  borderRadius: "10px",
                  // px: "20px",
                  px: "40px",
                  backgroundColor: "#4CAF50",
                  color: "gray.active",
                  "&:hover": { backgroundColor: "#4CAF50" },
                }}
              >
                {t("done")}
              </ButtonLoader>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
