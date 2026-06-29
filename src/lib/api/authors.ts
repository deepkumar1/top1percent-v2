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
  headline?: string;
  location?: string;
  company?: string;
  avatarGradient?: string;
  initials?: string;
  coverImage?: string;
  badges?: string[];
  social?: { twitter?: string; github?: string; website?: string; linkedin?: string };
  skills?: string[];
  interests?: string[];
  experience?: { title: string; company: string; startDate: string; endDate?: string; description?: string }[];
  education?: { degree: string; institution: string; year: string }[];
};

export type AuthorData = {
  id: string;
  username: string;
  name: string;
  bio: string;
  headline?: string;
  location?: string;
  company?: string;
  avatarGradient: string;
  initials: string;
  coverImage?: string;
  followers: number;
  following: number;
  articlesCount: number;
  totalViews?: number;
  totalLikes?: number;
  totalComments?: number;
  readingTime?: number;
  totalBookmarks?: number;
  badges?: string[];
  social?: { twitter?: string; github?: string; website?: string; linkedin?: string };
  skills?: string[];
  interests?: string[];
  experience?: { title: string; company: string; startDate: string; endDate?: string; description?: string }[];
  education?: { degree: string; institution: string; year: string }[];
  achievements?: { name: string; icon: string; description: string }[];
  joinedAt?: string;
  lastActive?: string;
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

  getFollowers(username: string) {
    return apiClient
      .get<ApiResponse<AuthorData[]>>(`/authors/${username}/followers`)
      .then((r) => r.data);
  },

  getFollowing(username: string) {
    return apiClient
      .get<ApiResponse<AuthorData[]>>(`/authors/${username}/following`)
      .then((r) => r.data);
  },

  follow(username: string) {
    return apiClient
      .post<ApiResponse<null>>(`/authors/${username}/follow`)
      .then((r) => r.data);
  },

  unfollow(username: string) {
    return apiClient
      .post<ApiResponse<null>>(`/authors/${username}/unfollow`)
      .then((r) => r.data);
  },

  getActivity(username: string) {
    return apiClient
      .get<ApiResponse<{ type: string; description: string; timestamp: string; link?: string }[]>>(`/authors/${username}/activity`)
      .then((r) => r.data);
  },
};
