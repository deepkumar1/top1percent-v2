import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";

const SearchPageLazy = lazy(() => import("../pages/search-page"));

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — Top 1 Percent" },
      { name: "description", content: "Search articles, authors, and categories across Top 1 Percent." },
      { property: "og:title", content: "Search — Top 1 Percent" },
      { property: "og:description", content: "Search articles, authors, and categories." },
      { property: "og:url", content: "/search" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/search" }],
  }),
  component: () => (
    <Suspense fallback={<div className="container-wide py-24 text-center" />}>
      <SearchPageLazy />
    </Suspense>
  ),
});