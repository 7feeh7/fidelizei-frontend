export interface User {
  id: number | string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

export interface SignInPayload {
  username: string;
  password: string;
}

export interface SignInResponse {
  access_token: string;
  refresh_token?: string;
  user: User;
}

export interface ResetPasswordPayload {
  email: string;
  code: string;
  new_password: string;
}

export interface AuthServices {
  signIn(payload: SignInPayload): Promise<SignInResponse>;
  requestNewPassword(email: string): Promise<void>;
  resetPassword(payload: ResetPasswordPayload): Promise<void>;
}
