import type { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useApp } from "@/lib/app-context";
import type { UserRole } from "@/lib/auth";

export function RequireAuth({
  role,
  redirectTo = "/login",
  children,
}: {
  role?: UserRole;
  redirectTo?: string;
  children: ReactNode;
}) {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser) {
    return (
      <div className="container-wide py-24 text-center">
        <h1 className="font-serif text-3xl font-semibold">Sign in required</h1>
        <p className="mt-2 text-muted-foreground">You need to be signed in to access this page.</p>
        <Link
          to={redirectTo}
          search={{ redirect: location.pathname }}
          className="mt-6 inline-flex h-10 items-center rounded-full bg-secondary px-5 text-sm font-medium text-secondary-foreground hover:bg-secondary/90"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (role && currentUser.role !== role) {
    return (
      <div className="container-wide py-24 text-center">
        <h1 className="font-serif text-3xl font-semibold">Access denied</h1>
        <p className="mt-2 text-muted-foreground">
          You don&apos;t have permission to view this page.
        </p>
        <Link to="/" className="mt-6 inline-block text-primary hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  return children;
}
