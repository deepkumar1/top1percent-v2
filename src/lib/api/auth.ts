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

export type LoginResponse = {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: string;
  success: boolean;
  data: LoginResponse;
};

export function decodeJwtUser(token: string): {
  id: number;
  username: string;
  email: string;
  role: string;
} {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.id ?? payload.userId ?? 0,
      username: payload.sub ?? payload.username ?? "",
      email: payload.email ?? "",
      role: payload.role ?? "",
    };
  } catch {
    return { id: 0, username: "", email: "", role: "" };
  }
}

export function mapSpringRole(role: string | string[]): "admin" | "author" {
  const roles = Array.isArray(role) ? role : [role];
  if (roles.some((r) => r.includes("ADMIN"))) return "admin";
  return "author";
}

export const authApi = {
  register(data: RegisterRequest) {
    return apiClient
      .post<ApiResponse<RegisterResponseData>>("/users/register", data)
      .then((res) => res.data);
  },

  login(email: string, password: string) {
    return apiClient
      .post<LoginResponse>("/users/login", { email, password })
      .then((res) => res?.data || {} as LoginResponse);
  },
};
