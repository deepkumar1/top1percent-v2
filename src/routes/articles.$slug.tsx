import { lazy, Suspense } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

const ArticleDetailPageLazy = lazy(() => import("../pages/article-detail-page"));

export const Route = createFileRoute("/articles/$slug")({
  component: () => {
    const { slug } = Route.useParams();
    return (
      <Suspense fallback={<div className="container-wide py-24 text-center" />}>
        <ArticleDetailPageLazy slug={slug} />
      </Suspense>
    );
  },
  notFoundComponent: () => (
    <div className="container-wide py-24 text-center">
      <h1 className="font-serif text-3xl font-semibold">Article not found</h1>
      <Link to="/articles" className="mt-4 inline-block text-primary hover:underline">Browse all articles</Link>
    </div>
  ),
});