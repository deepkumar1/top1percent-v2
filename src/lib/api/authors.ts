import apiClient from "./client";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
};

export type AuthorPayload = {
  username: string;
  name: string;
  bio?: string;
  avatarGradient?: string;
  initials?: string;
};

export type AuthorData = {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatarGradient: string;
  initials: string;
  followers: number;
  following: number;
  articlesCount: number;
};

export const authorsApi = {
  create(data: AuthorPayload) {
    return apiClient
      .post<ApiResponse<AuthorData>>("/authors", data)
      .then((r) => r.data);
  },

  list() {
    return apiClient
      .get<ApiResponse<AuthorData[]>>("/authors")
      .then((r) => r.data);
  },

  get(id: string) {
    return apiClient
      .get<ApiResponse<AuthorData>>(`/authors/${id}`)
      .then((r) => r.data);
  },

  getByUsername(username: string) {
    return apiClient
      .get<ApiResponse<AuthorData>>(`/authors/username/${username}`)
      .then((r) => r.data);
  },

  update(id: string, data: Partial<AuthorPayload>) {
    return apiClient
      .put<ApiResponse<AuthorData>>(`/authors/${id}`, data)
      .then((r) => r.data);
  },

  delete(id: string) {
    return apiClient
      .delete<ApiResponse<null>>(`/authors/${id}`)
      .then((r) => r.data);
  },
};
