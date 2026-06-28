import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AppProvider } from "@/lib/app-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="font-serif text-7xl font-semibold text-primary">404</p>
        <h1 className="mt-3 font-serif text-2xl font-semibold">This story doesn't exist</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for may have moved or never existed.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-secondary px-5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/90"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl font-semibold">Something didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex h-10 items-center justify-center rounded-full bg-secondary px-5 text-sm font-medium text-secondary-foreground hover:bg-secondary/90"
          >
            Try again
          </button>
          <a href="/" className="inline-flex h-10 items-center justify-center rounded-full border border-border px-5 text-sm font-medium hover:bg-muted">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Top 1 Percent — A premium publication for engineers" },
      { name: "description", content: "Read and write deeply considered articles on Java, Spring, Angular, AI, system design, and the craft of software." },
      { name: "author", content: "Top 1 Percent" },
      { property: "og:site_name", content: "Top 1 Percent" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#2563eb" },
      { property: "og:title", content: "Top 1 Percent — A premium publication for engineers" },
      { name: "twitter:title", content: "Top 1 Percent — A premium publication for engineers" },
      { property: "og:description", content: "Read and write deeply considered articles on Java, Spring, Angular, AI, system design, and the craft of software." },
      { name: "twitter:description", content: "Read and write deeply considered articles on Java, Spring, Angular, AI, system design, and the craft of software." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f7ae350c-ee4a-4da8-bf47-b44b89eed414/id-preview-514b8ff8--96363a1c-d966-49b4-86ae-fdca6c1a6297.lovable.app-1782400942160.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f7ae350c-ee4a-4da8-bf47-b44b89eed414/id-preview-514b8ff8--96363a1c-d966-49b4-86ae-fdca6c1a6297.lovable.app-1782400942160.png" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Top 1 Percent",
          description: "A premium publication for engineers.",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <>
      <HeadContent />
      {children}
      <Scripts />
    </>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider delayDuration={300}>
          <div className="flex min-h-dvh flex-col bg-background">
            <SiteHeader />
            <main className="flex-1">
              <Outlet />
            </main>
            <SiteFooter />
          </div>
          <Toaster />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}
