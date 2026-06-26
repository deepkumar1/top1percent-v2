import type { Article, ArticleStatus } from "@/lib/mock-data";
import type { SessionUser } from "@/lib/auth";

/** Shared DTOs — mirror these in your backend API. */

export type PostMessage = {
  id: string;
  fromUserId: string;
  fromName: string;
  fromRole: "admin" | "author";
  body: string;
  createdAt: string;
};

export type PostFormPayload = {
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
};

export type SubmitPostInput = PostFormPayload;

export type UpdatePostInput = Partial<PostFormPayload>;

export type ApprovePostInput = {
  slug: string;
  adminMessage?: string;
};

export type ReworkPostInput = {
  slug: string;
  adminMessage: string;
};

/** Service contract — swap LocalPostService for HttpPostService when connecting a backend. */
export interface PostService {
  submit(input: SubmitPostInput, user: SessionUser): Article;
  updateAsAuthor(slug: string, input: UpdatePostInput, user: SessionUser): Article;
  deleteAsAuthor(slug: string, user: SessionUser): void;
  approve(input: ApprovePostInput, user: SessionUser): Article;
  sendForRework(input: ReworkPostInput, user: SessionUser): Article;
  updateAsAdmin(slug: string, input: UpdatePostInput, user: SessionUser): Article;
  deleteAsAdmin(slug: string, user: SessionUser): void;
  listOwnPosts(user: SessionUser, articles: Article[]): Article[];
  listForReview(user: SessionUser, articles: Article[]): Article[];
}

export type { Article, ArticleStatus, SessionUser };
