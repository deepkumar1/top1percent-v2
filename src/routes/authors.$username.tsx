import { lazy, Suspense } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

const AuthorProfilePageLazy = lazy(() => import("../pages/author-profile-page"));

export const Route = createFileRoute("/authors/$username")({
  component: () => {
    const { username } = Route.useParams();
    return (
      <Suspense fallback={<div className="container-wide py-24 text-center" />}>
        <AuthorProfilePageLazy username={username} />
      </Suspense>
    );
  },
  notFoundComponent: () => (
    <div className="container-wide py-24 text-center">
      <h1 className="font-serif text-3xl font-semibold">Author not found</h1>
      <Link to="/articles" className="mt-4 inline-block text-primary hover:underline">Back to articles</Link>
    </div>
  ),
});