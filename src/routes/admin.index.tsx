import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";

const AdminPageLazy = lazy(() => import("../pages/admin-page"));

export const Route = createFileRoute("/admin/")({
  component: () => (
    <Suspense fallback={<div className="container-wide py-24 text-center" />}>
      <AdminPageLazy />
    </Suspense>
  ),
});