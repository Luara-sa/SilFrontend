import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@mui/material";

import { BeDelegateLogged } from "./BeDelegateLogged";
import { BeDelegateRegister } from "./BeDelegateRegister";
import { BeDelegateVariants } from "./BeDelegateVariants";

import { _StudentRoleService } from "services/studentRole.service";
import { meStore } from "store/meStore";
import { useMe } from "hooks/useMe";

import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import { courseStore } from "store/courseStore";
import useTranslation from "next-translate/useTranslation";

export const BeDelegateAction = () => {
  const { loading, me, isLogged } = useMe();

  const course = courseStore((state) => state.course);

  const [open, setOpen] = useState(false);

  const isAbleToDelegate = Boolean(course?.delegate_course_link === null);
  const isAccountRejected = me?.delegate_active === 3;

  const hasDelegateVariants = useMemo(() => {
    if (isLogged) {
      if (isAccountRejected) return false;
      if (isAbleToDelegate) return false;
      return true;
    }
    return false;
  }, [isAbleToDelegate, isLogged, isAccountRejected]);

  const hasBeDelegateButton = useMemo(() => {
    if (isLogged) {
      if (hasDelegateVariants) return false;
      if (isAbleToDelegate) return true;
      else return false;
    }
    return true;
  }, [isAbleToDelegate, isLogged, hasDelegateVariants]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { t } = useTranslation("course");

  const status = (beDelegateActive: number) => {
    if (isAccountRejected) {
      return "rejected";
    }
    if (beDelegateActive === 0) {
      return "wraning";
    } else if (beDelegateActive === 1) {
      return "success";
    } else {
      return "rejected";
    }
  };

  console.log(
    "course?.delegate_course_link?.active",
    course?.delegate_course_link?.link
  );

  return (
    <>
      {hasDelegateVariants && (
        <BeDelegateVariants
          status={status(course?.delegate_course_link?.active as number)}
          link={course?.delegate_course_link?.link}
        />
      )}
      {hasBeDelegateButton && (
        <>
          <Button
            onClick={handleOpen}
            variant="contained"
            fullWidth
            startIcon={<VolunteerActivismOutlinedIcon />}
            sx={{
              borderRadius: "10px",
              fontSize: [13, 13, 14, 13, 13],
              fontWeight: "700",
              "&:hover": {
                backgroundColor: "#488289",
              },
            }}
          >
            {t("be delegate")}
          </Button>
          {!loading &&
            (isLogged ? (
              <BeDelegateLogged handleClose={handleClose} open={open} />
            ) : (
              <BeDelegateRegister handleClose={handleClose} open={open} />
            ))}
        </>
      )}
    </>
  );
};
