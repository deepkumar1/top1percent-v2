import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";

const CategoriesListPageLazy = lazy(() => import("../pages/categories-list-page"));

export const Route = createFileRoute("/categories/")({
  head: () => ({
    meta: [
      { title: "Categories — Top 1 Percent" },
      { name: "description", content: "Browse articles by topic — Java, Spring, Angular, AI, system design, and more." },
      { property: "og:title", content: "Categories — Top 1 Percent" },
      { property: "og:description", content: "Browse articles by topic on Top 1 Percent." },
      { property: "og:url", content: "/categories" },
    ],
    links: [{ rel: "canonical", href: "/categories" }],
  }),
  component: () => (
    <Suspense fallback={<div className="container-wide py-24 text-center" />}>
      <CategoriesListPageLazy />
    </Suspense>
  ),
});