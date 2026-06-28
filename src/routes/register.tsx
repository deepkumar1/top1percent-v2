import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";

const RegisterPageLazy = lazy(() => import("../pages/register-page"));

export const Route = createFileRoute("/register")({
  component: () => (
    <Suspense fallback={<div className="container-wide py-24 text-center" />}>
      <RegisterPageLazy />
    </Suspense>
  ),
});
