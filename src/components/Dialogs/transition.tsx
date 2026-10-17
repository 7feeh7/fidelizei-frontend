import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import Slide from "@mui/material/Slide";

export const mainTransition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
