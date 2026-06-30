import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";

const LoginPageLazy = lazy(() => import("../pages/login-page"));

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => {
    const fallback = "/";
    const target = typeof search.redirect === "string" ? search.redirect : fallback;
    return {
      redirect: target.startsWith("/login") ? fallback : target,
    } as { redirect?: string };
  },
  component: () => {
    const { redirect } = Route.useSearch();
    return (
      <Suspense fallback={<div className="container-wide py-24 text-center" />}>
        <LoginPageLazy redirect={redirect} />
      </Suspense>
    );
  },
});

