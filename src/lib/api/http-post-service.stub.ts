import type { Article } from "@/lib/mock-data";
import type { SessionUser } from "@/lib/auth";
import type {
  ApprovePostInput,
  PostService,
  ReworkPostInput,
  SubmitPostInput,
  UpdatePostInput,
} from "./types";

/**
 * HTTP implementation skeleton — wire this up when your backend is ready.
 *
 * Example:
 *   const postService = new HttpPostService(import.meta.env.VITE_API_URL, getAccessToken);
 *   const article = await postService.submit(input, user);
 *
 * Keep the same PostService interface so UI code in app-context can swap implementations.
 */
export class HttpPostService implements PostService {
  constructor(
    private baseUrl: string,
    private getToken: () => string | null,
  ) {}

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<T>;
  }

  submit(input: SubmitPostInput, user: SessionUser): Article {
    void user;
    void input;
    throw new Error("HttpPostService.submit: implement GET/POST /api/posts");
  }

  updateAsAuthor(slug: string, input: UpdatePostInput, user: SessionUser): Article {
    void slug;
    void input;
    void user;
    throw new Error("HttpPostService.updateAsAuthor: implement PATCH /api/posts/:slug");
  }

  deleteAsAuthor(slug: string, user: SessionUser): void {
    void slug;
    void user;
    throw new Error("HttpPostService.deleteAsAuthor: implement DELETE /api/posts/:slug");
  }

  approve(input: ApprovePostInput, user: SessionUser): Article {
    void input;
    void user;
    throw new Error("HttpPostService.approve: implement POST /api/posts/:slug/approve");
  }

  sendForRework(input: ReworkPostInput, user: SessionUser): Article {
    void input;
    void user;
    throw new Error("HttpPostService.sendForRework: implement POST /api/posts/:slug/rework");
  }

  updateAsAdmin(slug: string, input: UpdatePostInput, user: SessionUser): Article {
    void slug;
    void input;
    void user;
    throw new Error("HttpPostService.updateAsAdmin: implement PATCH /api/admin/posts/:slug");
  }

  deleteAsAdmin(slug: string, user: SessionUser): void {
    void slug;
    void user;
    throw new Error("HttpPostService.deleteAsAdmin: implement DELETE /api/admin/posts/:slug");
  }

  listOwnPosts(user: SessionUser, _articles: Article[]): Article[] {
    void user;
    throw new Error("HttpPostService.listOwnPosts: implement GET /api/posts/mine");
  }

  listForReview(user: SessionUser, _articles: Article[]): Article[] {
    void user;
    throw new Error("HttpPostService.listForReview: implement GET /api/admin/posts/review-queue");
  }
}
