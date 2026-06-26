import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_USERS } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  // ✅ FIXED: Checks the redirect path to prevent an infinite loop crash
  validateSearch: (search: Record<string, unknown>) => {
    const fallback = "/";
    const target = typeof search.redirect === "string" ? search.redirect : fallback;
    return {
      redirect: target.startsWith("/login") ? fallback : target,
    };
  },
  component: LoginPage,
});

// ✅ FIXED: Processing this array staticly prevents overhead recalculations during render loops
const DEMO_ACCOUNTS = DEMO_USERS.map(({ email: e, password: p, role, name }) => ({
  email: e,
  password: p,
  role,
  name,
}));

function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = login(email, password);
    if (!ok) {
      setError("Invalid email or password.");
      return;
    }
    navigate({ to: redirect });
  };

  return (
    <div className="container-wide flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8">
        <h1 className="font-serif text-3xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to create posts or manage the publication.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>

        <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Demo accounts
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {/* ✅ FIXED: Reads directly from the safe DEMO_ACCOUNTS array */}
            {DEMO_ACCOUNTS.map((a) => (
              <li key={a.email} className="flex flex-col gap-0.5">
                <span className="font-medium">{a.name}</span>
                <span className="text-muted-foreground">
                  {a.email} · {a.password} · {a.role}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/" className="text-primary hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
