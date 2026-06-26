import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="container-wide grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary font-serif text-sm font-bold text-secondary-foreground">
              1<span className="text-primary">%</span>
            </span>
            <span className="font-serif text-lg font-semibold tracking-tight">
              Top <span className="text-primary">1</span> Percent
            </span>
          </Link>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            A premium publication for engineers who want to think clearly, ship reliably, and grow into the top 1% of their craft.
          </p>
        </div>

        <div>
          <h4 className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/articles" className="text-foreground/80 hover:text-foreground">Articles</Link></li>
            <li><Link to="/categories" className="text-foreground/80 hover:text-foreground">Categories</Link></li>
            <li><Link to="/search" className="text-foreground/80 hover:text-foreground">Search</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">Company</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><span className="text-foreground/80">About</span></li>
            <li><span className="text-foreground/80">Careers</span></li>
            <li><span className="text-foreground/80">Contact</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-wide flex flex-col items-start justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Top 1 Percent. Built for engineers who care.</p>
          <p>Made with intention. Read with curiosity.</p>
        </div>
      </div>
    </footer>
  );
}
