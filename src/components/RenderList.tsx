import { CircularProgress, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import isEmpty from "lodash/isEmpty";
import { PropsWithChildren, ReactNode } from "react";

export const DefaultRenderContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "center",
  width: "100%",
  height: "15vh",
  borderRadius: 4,
  fontStyle: "italic",
  background: theme.palette.background.paper,
}));

interface RenderListProps {
  emptyContent: string | ReactNode;
  list: unknown[];
  isLoading?: boolean;
}
function RenderList(props: PropsWithChildren<RenderListProps>) {
  if (props.isLoading) {
    return (
      <DefaultRenderContainer>
        <CircularProgress />
      </DefaultRenderContainer>
    );
  }
  if (isEmpty(props.list)) {
    if (typeof props.emptyContent === "string") {
      return (
        <DefaultRenderContainer>
          <Typography>{props.emptyContent}</Typography>
        </DefaultRenderContainer>
      );
    } else {
      return <> {props.emptyContent} </>;
    }
  }
  return <>{props.children}</>;
}

export default RenderList;
