import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";

const CategoriesLayoutLazy = lazy(() => import("../pages/categories-layout"));

export const Route = createFileRoute("/categories")({
  component: () => (
    <Suspense fallback={<div className="container-wide py-24 text-center" />}>
      <CategoriesLayoutLazy />
    </Suspense>
  ),
});
