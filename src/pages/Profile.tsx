import PersonIcon from "@mui/icons-material/Person";
import { Avatar, Paper, Stack, Typography } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { RoundedButton } from "components/Button/RoundedButton";
import PasswordField from "components/Forms/PasswordField";
import TextField from "components/Forms/TextField";
import { useAuth } from "contexts/AuthContext";
import { useSnackbarContext } from "contexts/SnackbarContext";
import { User } from "interfaces/auth";
import { authServices } from "services/auth";
import { getApiErrorMessage } from "utils/apiError";
import { PASSWORD_LENGTH, profileValidator } from "validators/auth";

interface FormValues {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
}

interface ProfileFormProps {
  user: User;
  onProfileUpdated(): Promise<User>;
}

function ProfileForm({ user, onProfileUpdated }: ProfileFormProps) {
  const { snackError, snackSuccess } = useSnackbarContext();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(profileValidator),
    mode: "onBlur",
    defaultValues: {
      name: user.name,
      email: user.email,
      password: "",
      password_confirmation: "",
    },
  });

  async function onSubmit({ name, email, password }: FormValues) {
    try {
      await authServices.updateProfile(String(user.id), {
        name,
        email,
        ...(password ? { password } : {}),
      });
      await onProfileUpdated();
      reset({
        name,
        email,
        password: "",
        password_confirmation: "",
      });
      snackSuccess("Perfil atualizado com sucesso.");
    } catch (error) {
      snackError(
        getApiErrorMessage(error, "Não foi possível atualizar o perfil."),
        error
      );
    }
  }

  return (
    <Stack spacing={3} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h5" fontWeight={700}>
        Meu perfil
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={3} alignItems="center">
          <Avatar
            sx={{
              width: 96,
              height: 96,
              bgcolor: "grey.200",
              color: "grey.600",
            }}
          >
            <PersonIcon sx={{ fontSize: 56 }} />
          </Avatar>

          <Stack spacing={2} width="100%" maxWidth={480}>
            <TextField control={control} name="name" label="Nome" autoFocus />
            <TextField
              control={control}
              name="email"
              label="E-mail"
              type="email"
              autoComplete="email"
            />
            <Typography variant="body2" color="text.secondary">
              Deixe os campos de senha em branco para mantê-la inalterada. Para
              alterar, use no mínimo {PASSWORD_LENGTH} caracteres, incluindo ao
              menos um número e um caractere especial.
            </Typography>
            <PasswordField
              control={control}
              name="password"
              label="Nova senha"
              autoComplete="new-password"
            />
            <PasswordField
              control={control}
              name="password_confirmation"
              label="Confirmar nova senha"
              autoComplete="new-password"
            />
            <RoundedButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              fullWidth
            >
              Salvar
            </RoundedButton>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}

function Profile() {
  const { user, refreshUser } = useAuth();

  if (!user) {
    return null;
  }

  return <ProfileForm key={user.id} user={user} onProfileUpdated={refreshUser} />;
}

export default Profile;
