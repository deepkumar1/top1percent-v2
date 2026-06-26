import type { Article } from "@/lib/mock-data";
import type { SessionUser } from "@/lib/auth";
import type {
  ApprovePostInput,
  PostService,
  ReworkPostInput,
  SubmitPostInput,
  UpdatePostInput,
} from "./types";
import {
  applyAdminUpdate,
  applyApprove,
  applyAuthorUpdate,
  applyRework,
  assertAdminCanDelete,
  assertAuthorCanDelete,
  createSubmittedArticle,
  filterOwnPosts,
  filterReviewQueue,
} from "./post-actions";

/**
 * Local implementation backed by in-memory state + localStorage (via AppProvider).
 * Replace with HttpPostService calling REST endpoints when you connect a backend.
 */
export class LocalPostService implements PostService {
  constructor(
    private getArticles: () => Article[],
    private setArticles: (articles: Article[]) => void,
    private getUser: () => SessionUser | null,
  ) {}

  private requireUser(): SessionUser {
    const user = this.getUser();
    if (!user) throw new Error("Authentication required.");
    return user;
  }

  submit(input: SubmitPostInput, user?: SessionUser): Article {
    const u = user ?? this.requireUser();
    const article = createSubmittedArticle(input, u);
    this.setArticles([article, ...this.getArticles()]);
    return article;
  }

  updateAsAuthor(slug: string, input: UpdatePostInput, user?: SessionUser): Article {
    const u = user ?? this.requireUser();
    let updated!: Article;
    this.setArticles(
      this.getArticles().map((a) => {
        if (a.slug !== slug) return a;
        updated = applyAuthorUpdate(a, input, u);
        return updated;
      }),
    );
    if (!updated) throw new Error("Post not found.");
    return updated;
  }

  deleteAsAuthor(slug: string, user?: SessionUser): void {
    const u = user ?? this.requireUser();
    const article = this.getArticles().find((a) => a.slug === slug);
    if (!article) throw new Error("Post not found.");
    assertAuthorCanDelete(u, article);
    this.setArticles(this.getArticles().filter((a) => a.slug !== slug));
  }

  approve(input: ApprovePostInput, user?: SessionUser): Article {
    const u = user ?? this.requireUser();
    let updated!: Article;
    this.setArticles(
      this.getArticles().map((a) => {
        if (a.slug !== input.slug) return a;
        updated = applyApprove(a, u, input.adminMessage);
        return updated;
      }),
    );
    if (!updated) throw new Error("Post not found.");
    return updated;
  }

  sendForRework(input: ReworkPostInput, user?: SessionUser): Article {
    const u = user ?? this.requireUser();
    let updated!: Article;
    this.setArticles(
      this.getArticles().map((a) => {
        if (a.slug !== input.slug) return a;
        updated = applyRework(a, u, input.adminMessage);
        return updated;
      }),
    );
    if (!updated) throw new Error("Post not found.");
    return updated;
  }

  updateAsAdmin(slug: string, input: UpdatePostInput, user?: SessionUser): Article {
    const u = user ?? this.requireUser();
    let updated!: Article;
    this.setArticles(
      this.getArticles().map((a) => {
        if (a.slug !== slug) return a;
        updated = applyAdminUpdate(a, input, u);
        return updated;
      }),
    );
    if (!updated) throw new Error("Post not found.");
    return updated;
  }

  deleteAsAdmin(slug: string, user?: SessionUser): void {
    const u = user ?? this.requireUser();
    assertAdminCanDelete(u);
    this.setArticles(this.getArticles().filter((a) => a.slug !== slug));
  }

  listOwnPosts(user: SessionUser, articles: Article[]): Article[] {
    return filterOwnPosts(user, articles);
  }

  listForReview(user: SessionUser, articles: Article[]): Article[] {
    return filterReviewQueue(user, articles);
  }
}
