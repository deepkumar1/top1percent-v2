import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";

const WritePageLazy = lazy(() => import("../pages/write-page"));

export const Route = createFileRoute("/write/")({
  component: () => (
    <Suspense fallback={<div className="container-wide py-24 text-center" />}>
      <WritePageLazy />
    </Suspense>
  ),
});