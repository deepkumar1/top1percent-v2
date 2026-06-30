import { ArticleCard } from "@/components/article-card";
import { useApp } from "@/lib/app-context";
import { getPublishedArticles } from "@/lib/articles";

export default function ArticlesIndex() {
  const { articles } = useApp();
  const published = getPublishedArticles(articles);
  return (
    <div className="container-wide py-10">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Library</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight md:text-5xl">All articles</h1>
        <p className="mt-3 text-muted-foreground">
          {published.length} articles, carefully edited and built to last. Sorted by most recent.
        </p>
      </header>
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {published.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </div>
  );
}
