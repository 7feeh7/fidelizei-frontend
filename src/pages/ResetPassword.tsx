import { Stack } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ActionButton from "components/ActionButton";
import PasswordField from "components/Forms/PasswordField";
import AuthBox from "containers/AuthBox";
import AuthContainer from "containers/AuthContainer";
import { useSnackbarContext } from "contexts/SnackbarContext";
import { useQueryParams } from "hooks/useQueryParams";
import siteMap from "routes/siteMap";
import { authServices } from "services/auth";
import { newPasswordValidator, PASSWORD_LENGTH } from "validators/auth";

interface FormValues {
  new_password: string;
  password_confirmation: string;
}

function ResetPassword() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(newPasswordValidator),
    mode: "onBlur",
    defaultValues: { new_password: "", password_confirmation: "" },
  });
  const navigate = useNavigate();
  const queryParams = useQueryParams();
  const { snackError, snackSuccess } = useSnackbarContext();
  const { email = "", code = "" } = queryParams.get();

  async function onSubmit({ new_password }: FormValues) {
    try {
      await authServices.resetPassword({ email, code, new_password });
      snackSuccess("Senha alterada com sucesso.");
      navigate(siteMap.auth.login);
    } catch (error) {
      snackError("Não foi possível alterar a senha.", error);
    }
  }

  function onCancel() {
    navigate(-1);
  }

  return (
    <AuthContainer>
      <AuthBox
        title="Cadastrar nova senha"
        subtitle={`Informe a nova senha com no mínimo ${PASSWORD_LENGTH} caracteres, incluindo ao menos um número e um caractere especial.`}
        onSubmit={handleSubmit(onSubmit)}
        actions={
          <ActionButton
            rejectMsg="Cancelar"
            resolveMsg="Enviar"
            resolveType="submit"
            resolveLoading={isSubmitting}
            onReject={onCancel}
          />
        }
      >
        <Stack spacing={2}>
          <PasswordField
            control={control}
            name="new_password"
            label="Nova senha"
            autoComplete="new-password"
            autoFocus
          />
          <PasswordField
            control={control}
            name="password_confirmation"
            label="Confirmar nova senha"
            autoComplete="new-password"
          />
        </Stack>
      </AuthBox>
    </AuthContainer>
  );
}

export default ResetPassword;
