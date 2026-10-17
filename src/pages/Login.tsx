import { Link, Stack } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import PasswordField from "components/Forms/PasswordField";
import TextField from "components/Forms/TextField";
import ActionButton from "components/ActionButton";
import AuthContainer from "containers/AuthContainer";
import AuthBox from "containers/AuthBox";
import { useAuth } from "contexts/AuthContext";
import { useSnackbarContext } from "contexts/SnackbarContext";
import { SignInPayload } from "interfaces/auth";
import siteMap from "routes/siteMap";
import { signInValidator } from "validators/auth";

function Login() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInPayload>({
    resolver: yupResolver(signInValidator),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });
  const { signIn } = useAuth();
  const { snackError } = useSnackbarContext();

  // após o login o UnProtectedMiddleware redireciona para a rota de origem
  async function onSubmit(data: SignInPayload) {
    try {
      await signIn(data);
    } catch (error) {
      snackError("Não foi possível entrar. Verifique usuário e senha.", error);
    }
  }

  return (
    <AuthContainer>
      <AuthBox
        title="Login"
        onSubmit={handleSubmit(onSubmit)}
        actions={
          <ActionButton
            resolveMsg="Entrar"
            resolveType="submit"
            resolveLoading={isSubmitting}
          />
        }
      >
        <Stack spacing={2}>
          <TextField
            control={control}
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            autoFocus
          />
          <PasswordField
            control={control}
            name="password"
            label="Senha"
            autoComplete="current-password"
          />
          <Link
            component={RouterLink}
            to={siteMap.auth.requestNewPassword}
            underline="hover"
          >
            Esqueci minha senha
          </Link>
        </Stack>
      </AuthBox>
    </AuthContainer>
  );
}

export default Login;
