import type { Article } from "./mock-data";

export type ArticleStatus = "approved" | "pending" | "needs_rework";

export const ARTICLE_STATUS_LABELS: Record<ArticleStatus, string> = {
  approved: "Live",
  pending: "Pending review",
  needs_rework: "Needs rework",
};

export const ARTICLE_STATUS_COLORS: Record<ArticleStatus, string> = {
  approved: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  needs_rework: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
};

export function normalizeArticle(article: Article): Article {
  return {
    ...article,
    status: article.status ?? "approved",
  };
}

export function normalizeArticles(articles: Article[]): Article[] {
  return articles.map(normalizeArticle);
}

export function isPublished(article: Article): boolean {
  return (article.status ?? "approved") === "approved";
}

export function getPublishedArticles(articles: Article[]): Article[] {
  return articles.filter(isPublished);
}

