import {
  Checkbox,
  FormControlLabel,
  Link,
  Stack,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PasswordField from "components/Forms/PasswordField";
import TextField from "components/Forms/TextField";
import ActionButton from "components/ActionButton";
import AuthContainer from "containers/AuthContainer";
import AuthBox from "containers/AuthBox";
import { useAuth } from "contexts/AuthContext";
import { useSnackbarContext } from "contexts/SnackbarContext";
import { rememberedLoginStorage } from "hooks/storage/rememberedLogin";
import { SignInPayload } from "interfaces/auth";
import { signInValidator } from "validators/auth";

function Login() {
  const rememberedLogin = rememberedLoginStorage.get();
  const [remember, setRemember] = useState(Boolean(rememberedLogin));

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInPayload>({
    resolver: yupResolver(signInValidator),
    mode: "onBlur",
    defaultValues: {
      email: rememberedLogin?.email ?? "",
      password: rememberedLogin?.password ?? "",
    },
  });
  const { signIn } = useAuth();
  const { snackError } = useSnackbarContext();

  // após o login o UnProtectedMiddleware redireciona para a rota de origem
  async function onSubmit(data: SignInPayload) {
    try {
      await signIn(data);
      if (remember) {
        rememberedLoginStorage.set({
          email: data.email,
          password: data.password,
        });
      } else {
        rememberedLoginStorage.destroy();
      }
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
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Link
              component="span"
              underline="hover"
              aria-disabled
              sx={{
                color: "text.disabled",
                cursor: "default",
                pointerEvents: "none",
              }}
            >
              Esqueci minha senha
            </Link>
            <FormControlLabel
              control={
                <Checkbox
                  checked={remember}
                  onChange={(_, checked) => {
                    setRemember(checked);
                    if (!checked) {
                      rememberedLoginStorage.destroy();
                    }
                  }}
                  size="small"
                />
              }
              label="Lembrar"
            />
          </Stack>
        </Stack>
      </AuthBox>
    </AuthContainer>
  );
}

export default Login;
