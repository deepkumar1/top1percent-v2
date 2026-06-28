import { LoginNew } from "@/components/ui/login";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => {
    const fallback = "/";
    const target = typeof search.redirect === "string" ? search.redirect : fallback;
    return {
      redirect: target.startsWith("/login") ? fallback : target,
    };
  },
  component: LoginPage,
});

function LoginPage() {
  const { redirect } = Route.useSearch();
  return <LoginNew redirect={redirect} />;
}

