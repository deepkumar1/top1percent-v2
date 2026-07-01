import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";

const RegisterPageLazy = lazy(() => import("../pages/register-page"));

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>): { admin?: boolean } => {
    if (search.admin === "true") return { admin: true };
    return {};
  },
  component: () => {
    const { admin } = Route.useSearch();
    return (
      <Suspense fallback={<div className="container-wide py-24 text-center" />}>
        <RegisterPageLazy adminCreate={admin} />
      </Suspense>
    );
  },
});
