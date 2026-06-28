import { Link } from "@tanstack/react-router";
import { getCategory } from "@/lib/mock-data";
import { ArticleCard } from "@/components/article-card";
import { useApp } from "@/lib/app-context";
import { getPublishedArticles } from "@/lib/articles";

export default function CategoryPage({ slug }: { slug: string }) {
  const { articles, CATEGORIES } = useApp();
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="container-wide py-24 text-center">
        <h1 className="font-serif text-3xl font-semibold">Category not found</h1>
        <Link to="/categories" className="mt-4 inline-block text-primary hover:underline">Browse all categories</Link>
      </div>
    );
  }

  const categoryArticles = getPublishedArticles(articles).filter((a) => a.category === category.slug);
  return (
    <div>
      <header className={`relative overflow-hidden border-b border-border bg-gradient-to-br ${category.color}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_60%)]" />
        <div className="container-wide relative py-20 text-white">
          <p className="text-4xl">{category.icon}</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-tight md:text-6xl">{category.name}</h1>
          <p className="mt-3 max-w-xl text-lg text-white/85">{category.description}</p>
          <p className="mt-4 text-sm text-white/70">{categoryArticles.length} {categoryArticles.length === 1 ? "article" : "articles"}</p>
        </div>
      </header>
      <div className="container-wide py-14">
        {categoryArticles.length === 0 ? (
          <p className="text-muted-foreground">No articles in this category yet.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {categoryArticles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
