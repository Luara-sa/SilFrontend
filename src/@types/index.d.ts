import type { NextComponentType, NextPageContext } from "next";
import React from "react";

declare module "next" {
  export declare type NextPage<P = {}, IP = P> = NextComponentType<
    NextPageContext,
    IP,
    P
  > & {
    layout?: React.ComponentType;
  };
}
