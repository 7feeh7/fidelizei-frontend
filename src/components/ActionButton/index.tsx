import { Stack } from "@mui/material";
import { ActionButtonProps } from "./types_d";
import { RoundedButton } from "components/Button/RoundedButton";
export type { ActionButtonBaseProps, ActionButtonProps } from "./types_d";

function ActionButton({
  resolveMsg = "Sim",
  rejectMsg = "Não",
  rejectLoading,
  resolveLoading,
  rejectDisabled,
  resolveDisabled,
  resolveType = "button",
  justifyContent = "flex-end",
  onResolve,
  onReject,
}: ActionButtonProps) {
  const showResolve = Boolean(onResolve) || resolveType === "submit";

  return (
    <Stack direction="row" justifyContent={justifyContent} spacing={2}>
      {onReject && (
        <RoundedButton
          type="button"
          variant="outlined"
          onClick={onReject}
          loading={rejectLoading}
          disabled={rejectDisabled}
        >
          {rejectMsg}
        </RoundedButton>
      )}

      {showResolve && (
        <RoundedButton
          type={resolveType}
          onClick={onResolve}
          loading={resolveLoading}
          disabled={resolveDisabled}
        >
          {resolveMsg}
        </RoundedButton>
      )}
    </Stack>
  );
}

export default ActionButton;
