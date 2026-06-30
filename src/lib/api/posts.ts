import type { ArticleStatus, Comment } from "@/lib/mock-data";
import apiClient from "./client";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
};

export type PostPayload = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  authorUsername: string;
  category: string;
  tags: string[];
  readingMinutes: number;
  coverGradient: string;
  authorMessage?: string;
  submittedBy?: string;
};

export type ArticleData = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  authorUsername: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readingMinutes: number;
  likes: number;
  bookmarks: number;
  comments: Comment[];
  coverGradient: string;
  status: ArticleStatus;
};

export const postsApi = {
  create(data: PostPayload) {
    return apiClient
      .post<ApiResponse<ArticleData>>("/posts/newpost", data)
      .then((r) => r.data);
  },

  list() {
    return apiClient
      .get<ApiResponse<ArticleData[]>>("/posts")
      .then((r) => r.data);
  },

  get(slug: string) {
    return apiClient
      .get<ApiResponse<ArticleData>>(`/posts/${slug}`)
      .then((r) => r.data);
  },

  update(slug: string, data: Partial<PostPayload>) {
    return apiClient
      .put<ApiResponse<ArticleData>>(`/posts/${slug}`, data)
      .then((r) => r.data);
  },

  delete(slug: string) {
    return apiClient
      .delete<ApiResponse<null>>(`/posts/${slug}`)
      .then((r) => r.data);
  },

  approve(slug: string, adminMessage?: string) {
    return apiClient
      .put<ApiResponse<ArticleData>>(`/posts/${slug}/approve`, { adminMessage })
      .then((r) => r.data);
  },

  sendForRework(slug: string, adminMessage: string) {
    return apiClient
      .post<ApiResponse<ArticleData>>(`/posts/${slug}/rework`, { adminMessage })
      .then((r) => r.data);
  },
};
