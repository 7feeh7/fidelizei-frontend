import { StackProps } from "@mui/system";

export interface ActionButtonBaseProps {
  resolveMsg?: string;
  rejectMsg?: string;
  rejectDisabled?: boolean;
  resolveDisabled?: boolean;
  rejectLoading?: boolean;
  resolveLoading?: boolean;
  /** "submit" envia o <form> pai (o botão aparece mesmo sem onResolve) */
  resolveType?: "button" | "submit";
  onResolve?: () => void;
  onReject?: () => void;
}
export interface ActionButtonProps extends StackProps, ActionButtonBaseProps {}
