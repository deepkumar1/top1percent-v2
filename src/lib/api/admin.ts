import apiClient from "./client";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
};

export type AdminUserData = {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
};

export type AdminPostData = {
  id: string;
  slug: string;
  title: string;
  status: string;
  authorUsername: string;
  submittedBy: string;
  publishedAt: string;
};

export type AdminCommentData = {
  id: string;
  content: string;
  author: { id: string; name: string };
  createdAt: string;
};

export const adminApi = {
  listUsers() {
    return apiClient
      .get<ApiResponse<AdminUserData[]>>("/admin/users")
      .then((r) => r.data);
  },

  deleteUser(id: string) {
    return apiClient
      .delete<ApiResponse<null>>(`/admin/users/${id}`)
      .then((r) => r.data);
  },

  listPosts(status?: string) {
    return apiClient
      .get<ApiResponse<AdminPostData[]>>("/admin/posts", {
        params: { status },
      })
      .then((r) => r.data);
  },

  updatePostStatus(id: string, status: string) {
    return apiClient
      .put<ApiResponse<AdminPostData>>(`/admin/posts/${id}/status`, { status })
      .then((r) => r.data);
  },

  deletePost(id: string) {
    return apiClient
      .delete<ApiResponse<null>>(`/admin/posts/${id}`)
      .then((r) => r.data);
  },

  listComments() {
    return apiClient
      .get<ApiResponse<AdminCommentData[]>>("/admin/comments")
      .then((r) => r.data);
  },

  deleteComment(id: string) {
    return apiClient
      .delete<ApiResponse<null>>(`/admin/comments/${id}`)
      .then((r) => r.data);
  },
};
