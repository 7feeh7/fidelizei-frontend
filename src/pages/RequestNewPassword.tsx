import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ActionButton from "components/ActionButton";
import TextField from "components/Forms/TextField";
import AuthBox from "containers/AuthBox";
import AuthContainer from "containers/AuthContainer";
import { useSnackbarContext } from "contexts/SnackbarContext";
import { useQueryParams } from "hooks/useQueryParams";
import siteMap from "routes/siteMap";
import { authServices } from "services/auth";
import { emailValidator } from "validators/auth";

interface FormValues {
  email: string;
}

function RequestNewPassword() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(emailValidator),
    mode: "onBlur",
    defaultValues: { email: "" },
  });
  const navigate = useNavigate();
  const queryParams = useQueryParams();
  const { snackError } = useSnackbarContext();

  async function onSubmit({ email }: FormValues) {
    try {
      await authServices.requestNewPassword(email);
      queryParams.navigate(siteMap.auth.confirmCode, { email });
    } catch (error) {
      snackError("Não foi possível enviar o código.", error);
    }
  }

  function onCancel() {
    navigate(siteMap.auth.login);
  }

  return (
    <AuthContainer>
      <AuthBox
        title="Redefinir Senha"
        subtitle="Enviaremos um email com um código para redefinir a sua senha. Qual o email cadastrado no sistema?"
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
        <TextField
          control={control}
          name="email"
          type="email"
          label="Email"
          autoFocus
        />
      </AuthBox>
    </AuthContainer>
  );
}

export default RequestNewPassword;
