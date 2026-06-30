import { lazy, Suspense } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

const CategoryDetailPageLazy = lazy(() => import("../pages/category-detail-page"));

export const Route = createFileRoute("/categories/$slug")({
  component: () => {
    const { slug } = Route.useParams();
    return (
      <Suspense fallback={<div className="container-wide py-24 text-center" />}>
        <CategoryDetailPageLazy slug={slug} />
      </Suspense>
    );
  },
  notFoundComponent: () => (
    <div className="container-wide py-24 text-center">
      <h1 className="font-serif text-3xl font-semibold">Category not found</h1>
      <Link to="/categories" className="mt-4 inline-block text-primary hover:underline">Browse all categories</Link>
    </div>
  ),
});
