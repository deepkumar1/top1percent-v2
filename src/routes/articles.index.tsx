import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";

const ArticlesListPageLazy = lazy(() => import("../pages/articles-list-page"));

export const Route = createFileRoute("/articles/")({
  head: () => ({
    meta: [
      { title: "All articles — Top 1 Percent" },
      { name: "description", content: "Every essay, postmortem, and design walkthrough published on Top 1 Percent." },
      { property: "og:title", content: "All articles — Top 1 Percent" },
      { property: "og:description", content: "Every essay, postmortem, and design walkthrough published on Top 1 Percent." },
      { property: "og:url", content: "/articles" },
    ],
    links: [{ rel: "canonical", href: "/articles" }],
  }),
  component: () => (
    <Suspense fallback={<div className="container-wide py-24 text-center" />}>
      <ArticlesListPageLazy />
    </Suspense>
  ),
});