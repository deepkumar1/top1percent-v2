import type { Category } from "@/lib/mock-data";
import apiClient from "./client";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
};

export const categoriesApi = {
  list() {
    return apiClient
      .get<ApiResponse<Category[]>>("/categories")
      .then((r) => r.data);
  },
  create(data: Omit<Category, "id">) {
    return apiClient
      .post<ApiResponse<Category>>("/categories/newcategory", data)
      .then((r) => r.data);
  },
};
