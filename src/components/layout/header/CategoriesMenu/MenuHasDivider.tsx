import { Divider } from "@mui/material";
import React from "react";
import { dividerStyle } from "./CategoriesMenuOptions";

export const HasDivider = (props: {
  categoryIndex: number;
  childIndex: number;
  categories: any[];
  category: any;
}) => {
  const { categories, category, categoryIndex, childIndex } = props;
  if (categoryIndex !== categories.length - 1)
    return <Divider sx={dividerStyle} />;
  if (
    categoryIndex === categories.length - 1 &&
    childIndex !== category.child.length - 1
  )
    return <Divider sx={dividerStyle} />;
  return <></>;
};
