import { Search as SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { CATEGORIES } from "@/lib/mock-data";
import { ArticleCard } from "@/components/article-card";
import { useApp } from "@/lib/app-context";
import { getPublishedArticles } from "@/lib/articles";

export default function SearchPage() {
  const { articles, authors } = useApp();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("");
  const [author, setAuthor] = useState<string>("");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return getPublishedArticles(articles).filter((a) => {
      if (category && a.category !== category) return false;
      if (author && a.authorUsername !== author) return false;
      if (!term) return true;
      return (
        a.title.toLowerCase().includes(term) ||
        a.excerpt.toLowerCase().includes(term) ||
        a.tags.some((t) => t.toLowerCase().includes(term))
      );
    });
  }, [q, category, author, articles]);

  return (
    <div className="container-wide py-10">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Search</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight md:text-5xl">Find your next read</h1>
        <p className="mt-3 text-muted-foreground">Full-text search across titles, excerpts, and tags. Filter by topic or author.</p>
      </header>

      <div className="mt-10 grid gap-4 md:grid-cols-[1fr_220px_220px]">
        <label className="relative">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles, tags, ideas…"
            className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm outline-none transition-colors focus:border-primary"
            aria-label="Search articles"
          />
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-12 rounded-full border border-border bg-card px-4 text-sm outline-none focus:border-primary"
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <select
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="h-12 rounded-full border border-border bg-card px-4 text-sm outline-none focus:border-primary"
          aria-label="Filter by author"
        >
          <option value="">All authors</option>
          {authors.map((a) => <option key={a.username} value={a.username}>{a.name}</option>)}
        </select>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        {results.length} {results.length === 1 ? "result" : "results"}
      </p>

      <div className="mt-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {results.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>

      {results.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No articles match your filters. Try a different keyword.
        </div>
      )}
    </div>
  );
}
