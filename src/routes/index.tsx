import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";

const HomePage = lazy(() => import("../pages/home-page"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Top 1 Percent — Engineering writing worth your time" },
      { name: "description", content: "Deeply considered articles on Java, Spring, Angular, AI, system design, and the craft of software — from engineers in the top 1% of their field." },
      { property: "og:title", content: "Top 1 Percent — Engineering writing worth your time" },
      { property: "og:description", content: "A premium publication for engineers who want to think clearly and ship reliably." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: () => (
    <Suspense fallback={<div className="container-wide py-24 text-center" />}>
      <HomePage />
    </Suspense>
  ),
});