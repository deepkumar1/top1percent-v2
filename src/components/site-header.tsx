import { Link, useNavigate } from "@tanstack/react-router";
import { Search, PenLine, Menu, LogOut, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, getAvatarGradient } from "@/lib/utils";

export function SiteHeader() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { currentUser, logout } = useApp();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background">
      <div className="container-wide flex h-16 items-center justify-between gap-4">
        <Link to="/" className="group flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary font-serif text-sm font-bold text-secondary-foreground">
            1<span className="text-primary">%</span>
          </span>
          <span className="font-serif text-lg font-semibold tracking-tight">
            Top <span className="text-primary">1</span> Percent
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
          <Link to="/articles" className="font-bold transition-all px-3 py-2 rounded-md hover:bg-muted hover:text-foreground" activeProps={{ className: "text-foreground" }}>Articles</Link>
          <Link to="/categories" className="font-bold transition-all px-3 py-2 rounded-md hover:bg-muted hover:text-foreground" activeProps={{ className: "text-foreground" }}>Categories</Link>
          <Link to="/search" className="font-bold transition-all px-3 py-2 rounded-md hover:bg-muted hover:text-foreground" activeProps={{ className: "text-foreground" }}>Search</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/search"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Link>
            <Link
                to={currentUser ? "/write" : "/login"}
                search={currentUser ? undefined : { redirect: "/write" }}
                className="hidden h-9 items-center gap-2 rounded-full bg-secondary px-4 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/90 sm:inline-flex"
              >
                <PenLine className="h-4 w-4" />
                Write
              </Link>

          {currentUser ? (
            <>
              {currentUser.role === "admin" && (
                <Link
                  to="/admin"
                  className="hidden h-9 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition-colors hover:bg-muted sm:inline-flex"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}
              <Avatar className="hidden h-8 w-8 sm:inline-flex">
  <AvatarFallback className={`bg-gradient-to-br ${getAvatarGradient(currentUser.name)} text-xs font-bold text-white`}>
    {getInitials(currentUser.name)}
  </AvatarFallback>
</Avatar>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { logout(); navigate({ to: "/" }); toast.success("Signed out."); }}
                className="hidden h-9 gap-1.5 sm:inline-flex"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </>
          ) : (
            <>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted md:hidden"
            aria-label="Menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container-wide flex flex-col gap-1 py-3 text-sm">
            <Link onClick={() => setOpen(false)} to="/articles" className="rounded-md px-3 py-2 hover:bg-muted">Articles</Link>
            <Link onClick={() => setOpen(false)} to="/categories" className="rounded-md px-3 py-2 hover:bg-muted">Categories</Link>
            <Link onClick={() => setOpen(false)} to="/search" className="rounded-md px-3 py-2 hover:bg-muted">Search</Link>
            {currentUser?.role === "admin" && (
              <Link onClick={() => setOpen(false)} to="/admin" className="rounded-md px-3 py-2 hover:bg-muted">Admin</Link>
            )}
            {currentUser ? (
              <button
                type="button"
                onClick={() => { logout(); setOpen(false); navigate({ to: "/" }); toast.success("Signed out."); }}
                className="rounded-md px-3 py-2 text-left hover:bg-muted"
              >
                Sign out <strong>({currentUser.name})</strong>
              </button>
            ) : (
              <></>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}