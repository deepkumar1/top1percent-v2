import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";
import { DEMO_USERS } from "@/lib/auth";

const DEMO_ACCOUNTS = DEMO_USERS.map(({ email: e, password: p, role, name }) => ({
  email: e,
  password: p,
  role,
  name,
}));

export const LoginNew = ({ redirect = "/" }: { redirect?: string }) => {
  const navigate = useNavigate();
  const { login, currentUser } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) {
      toast.success(`Welcome back, ${currentUser.name}!`);
      navigate({ to: redirect });
    }
  }, [currentUser, navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    const ok = await login(email, password);

    if (!ok) {
      setError("Invalid email or password.");
      toast.error("Invalid email or password.");
    }
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
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="pr-8"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>

        <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Demo accounts
          </p>
          <ul className="mt-3 space-y-2 text-sm">
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
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </p>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link to="/" className="text-primary hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
};