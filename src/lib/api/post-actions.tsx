import type { Article } from "@/lib/mock-data";
import type { SessionUser } from "@/lib/auth";
import type { PostMessage, SubmitPostInput, UpdatePostInput } from "./types";
import {
  canAdminApprovePost,
  canAuthorDeletePost,
  canAuthorEditPost,
  canAdminModeratePost,
  isPostOwner,
} from "./post-permissions";

function nowIso() {
  return new Date().toISOString();
}

function todayDate() {
  return new Date().toISOString().split("T")[0];
}

function newMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function appendMessage(
  messages: PostMessage[],
  user: SessionUser,
  body: string | undefined,
): PostMessage[] {
  if (!body?.trim()) return messages;
  return [
    ...messages,
    {
      id: newMessageId(),
      fromUserId: user.id,
      fromName: user.name,
      fromRole: user.role,
      body: body.trim(),
      createdAt: nowIso(),
    },
  ];
}

export function createSubmittedArticle(
  input: SubmitPostInput,
  user: SessionUser,
): Article {
  return {
    id: crypto.randomUUID(),
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    authorUsername: input.authorUsername,
    category: input.category,
    tags: input.tags,
    publishedAt: todayDate(),
    readingMinutes: input.readingMinutes,
    coverGradient: input.coverGradient,
    likes: 0,
    bookmarks: 0,
    comments: [],
    status: "pending",
    submittedBy: user.id,
    authorMessage: input.authorMessage?.trim() || undefined,
    adminFeedback: undefined,
    messages: appendMessage([], user, input.authorMessage),
  };
}

export function applyAuthorUpdate(
  article: Article,
  input: UpdatePostInput,
  user: SessionUser,
): Article {
  if (!canAuthorEditPost(user, article)) {
    throw new Error("You do not have permission to edit this post.");
  }

  return {
    ...article,
    ...input,
    tags: input.tags ?? article.tags,
    status: "pending",
    authorMessage: input.authorMessage?.trim() || article.authorMessage,
    adminFeedback: undefined,
    messages: appendMessage(article.messages ?? [], user, input.authorMessage),
  };
}

export function applyApprove(
  article: Article,
  user: SessionUser,
  adminMessage?: string,
): Article {
  if (!canAdminApprovePost(user, article)) {
    throw new Error("You cannot approve your own submission. Another admin must review it.");
  }

  return {
    ...article,
    status: "approved",
    adminFeedback: undefined,
    publishedAt: todayDate(),
    messages: appendMessage(article.messages ?? [], user, adminMessage),
  };
}

export function applyRework(
  article: Article,
  user: SessionUser,
  adminMessage: string,
): Article {
  if (!canAdminModeratePost(user)) {
    throw new Error("Only admins can send posts for rework.");
  }

  const feedback = adminMessage.trim();
  return {
    ...article,
    status: "needs_rework",
    adminFeedback: feedback || undefined,
    messages: appendMessage(article.messages ?? [], user, feedback),
  };
}

export function applyAdminUpdate(
  article: Article,
  input: UpdatePostInput,
  user: SessionUser,
): Article {
  if (!canAdminModeratePost(user)) {
    throw new Error("Only admins can perform this action.");
  }
  return {
    ...article,
    ...input,
    tags: input.tags ?? article.tags,
  };
}

export function assertAuthorCanDelete(user: SessionUser, article: Article) {
  if (!canAuthorDeletePost(user, article)) {
    throw new Error("You do not have permission to delete this post.");
  }
}

export function assertAdminCanDelete(user: SessionUser) {
  if (!canAdminModeratePost(user)) {
    throw new Error("Only admins can delete posts.");
  }
}

export function filterOwnPosts(user: SessionUser, articles: Article[]): Article[] {
  return articles.filter((a) => isPostOwner(user, a));
}

export function filterReviewQueue(user: SessionUser, articles: Article[]): Article[] {
  return articles.filter(
    (a) =>
      (a.status === "pending" || a.status === "needs_rework") &&
      canAdminApprovePost(user, a),
  );
}
