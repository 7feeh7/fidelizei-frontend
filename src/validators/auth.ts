import * as Yup from "yup";

export const PASSWORD_LENGTH = 8;
export const CODE_LENGTH = 6;

const email = Yup.string()
  .email("Email inválido")
  .required("Email obrigatório");

const code = Yup.string()
  .length(CODE_LENGTH, `O código deve ter ${CODE_LENGTH} dígitos`)
  .required("Código obrigatório");

const password = Yup.string()
  .min(
    PASSWORD_LENGTH,
    `A senha deve conter no mínimo ${PASSWORD_LENGTH} caracteres`
  )
  .required("O campo senha é obrigatório");

const new_password = password
  .matches(/\d/, "A senha deve conter ao menos um número")
  .matches(/[^A-Za-z0-9]/, "A senha deve conter ao menos um caractere especial");

export const signInValidator = Yup.object({
  email,
  password,
});

export const emailValidator = Yup.object({
  email,
});

export const codeValidator = Yup.object({
  email,
  code,
});

export const newPasswordValidator = Yup.object({
  new_password,
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("new_password")], "As senhas não conferem")
    .required("Confirme a nova senha"),
});

export const profileValidator = Yup.object({
  name: Yup.string().trim().required("Nome obrigatório"),
  email,
  password: Yup.string().test(
    "optional-password",
    "",
    function validateOptionalPassword(value) {
      if (!value) {
        return true;
      }

      try {
        new_password.validateSync(value);
        return true;
      } catch (error) {
        return this.createError({
          message: (error as Yup.ValidationError).message,
        });
      }
    }
  ),
  password_confirmation: Yup.string().when("password", {
    is: (value: string) => Boolean(value?.length),
    then: (schema) =>
      schema
        .oneOf([Yup.ref("password")], "As senhas não conferem")
        .required("Confirme a nova senha"),
    otherwise: (schema) => schema.optional(),
  }),
});
