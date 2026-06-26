import type { Article } from "@/lib/mock-data";
import type { SessionUser } from "@/lib/auth";

export function isPostOwner(user: SessionUser, article: Article): boolean {
  if (article.submittedBy && article.submittedBy === user.id) return true;
  if (user.authorUsername && article.authorUsername === user.authorUsername) return true;
  return false;
}

export function canAuthorEditPost(user: SessionUser, article: Article): boolean {
  if (user.role !== "author" && user.role !== "admin") return false;
  return isPostOwner(user, article);
}

export function canAuthorDeletePost(user: SessionUser, article: Article): boolean {
  return canAuthorEditPost(user, article);
}

export function canAdminApprovePost(user: SessionUser, article: Article): boolean {
  if (user.role !== "admin") return false;
  // Admin cannot approve their own submission — another admin must review.
  return article.submittedBy !== user.id;
}

export function canAdminModeratePost(user: SessionUser): boolean {
  return user.role === "admin";
}
