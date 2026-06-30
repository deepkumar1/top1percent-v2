import apiClient from "./client";

export type CommentData = {
  id: string;
  articleId: string;
  articleSlug: string;
  authorUsername: string;
  content: string;
  createdAt: string;
};

export type PageData<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
};

export const commentsApi = {
  create(articleId: string, articleSlug: string, authorUsername: string, content: string) {
    return apiClient
      .post<ApiResponse<CommentData>>("/articles/comments", { articleId, articleSlug, authorUsername, content })
      .then((r) => r.data);
  },

  list(articleSlug?: string, page = 0, size = 10) {
    return apiClient
      .get<ApiResponse<PageData<CommentData>>>("/articles/comments", {
        params: { articleSlug, page, size, sort: "createdAt,desc" },
      })
      .then((r) => r.data);
  },

  get(id: string) {
    return apiClient
      .get<ApiResponse<CommentData>>(`/articles/comments/${id}`)
      .then((r) => r.data);
  },

  update(id: string, content: string) {
    return apiClient
      .put<ApiResponse<CommentData>>(`/articles/comments/${id}`, { content })
      .then((r) => r.data);
  },

  delete(id: string) {
    return apiClient
      .delete<ApiResponse<null>>(`/articles/comments/${id}`)
      .then((r) => r.data);
  },
};
