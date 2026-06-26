import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/mock-data";
import { useApp } from "@/lib/app-context";

export const Route = createFileRoute("/categories/")({
  head: () => ({
    meta: [
      { title: "Categories — Top 1 Percent" },
      { name: "description", content: "Browse articles by topic — Java, Spring, Angular, AI, system design, and more." },
      { property: "og:title", content: "Categories — Top 1 Percent" },
      { property: "og:description", content: "Browse articles by topic on Top 1 Percent." },
      { property: "og:url", content: "/categories" },
    ],
    links: [{ rel: "canonical", href: "/categories" }],
  }),
  component: CategoriesIndex,
});

function CategoriesIndex() {
  const { articles } = useApp();
  return (
    <div className="container-wide py-10">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Explore</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight md:text-5xl">Categories</h1>
        <p className="mt-3 text-muted-foreground">Pick a topic and dive in. {CATEGORIES.length} curated categories, growing each week.</p>
      </header>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => {
          const count = articles.filter((a) => a.category === c.slug).length;
          return (
            <Link
              key={c.slug}
              to="/categories/$slug"
              params={{ slug: c.slug }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-border-strong hover:shadow-elevated"
            >
              <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${c.color} opacity-15 transition-opacity group-hover:opacity-30`} />
              <div className="relative">
                <p className="text-3xl">{c.icon}</p>
                <h2 className="mt-4 font-serif text-2xl font-semibold tracking-tight">{c.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                <p className="mt-5 text-xs font-medium text-primary">{count} {count === 1 ? "article" : "articles"} →</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}