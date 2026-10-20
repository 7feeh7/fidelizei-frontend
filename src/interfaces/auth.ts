export interface User {
  id: number | string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignInResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

export interface MeResponse {
  id: string;
  name: string;
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  code: string;
  new_password: string;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  password?: string;
}

export interface AuthServices {
  signIn(payload: SignInPayload): Promise<SignInResponse>;
  getMe(): Promise<MeResponse>;
  updateProfile(id: string, payload: UpdateProfilePayload): Promise<void>;
  requestNewPassword(email: string): Promise<void>;
  resetPassword(payload: ResetPasswordPayload): Promise<void>;
}
