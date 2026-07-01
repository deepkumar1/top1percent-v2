import apiClient from "./client";

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
};

export type RegisterResponseData = {
  id: string;
  username: string;
  email: string;
};

export type LoginResponseData = {
  id: string;
  email: string;
  name?: string;
  username?: string;
  role?: string;
  authorUsername?: string;
};

export const authApi = {
  register(data: RegisterRequest) {
    return apiClient
      .post<ApiResponse<RegisterResponseData>>("/users/newuser", data)
      .then((res) => res.data);
  },

  login(email: string, password: string) {
    return apiClient
      .post<ApiResponse<LoginResponseData>>("/users/login", { email, password })
      .then((res) => res.data);
  },
};
