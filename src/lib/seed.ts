import type { Article, Author, Category } from "./mock-data";

const STORAGE_KEY = "wordspark-forge-data";

const SEED_AUTHORS: Author[] = [
  { username: "ananya-rao", name: "Ananya Rao", headline: "Principal Engineer · JVM Performance | Distributed Systems", location: "San Francisco, CA", company: "Stripe", bio: "Principal Engineer. Distributed systems, JVM performance, calm code review. Writing about what I wish someone had told me十年前.", followers: 24180, following: 142, articlesCount: 86, totalViews: 892000, totalLikes: 45200, totalComments: 3800, readingTime: 520, totalBookmarks: 18400, badges: ["Top 1%", "Verified", "Editor's Pick"], social: { twitter: "ananya", github: "ananya-rao", linkedin: "ananyarao" }, skills: ["Java", "Kafka", "Distributed Systems", "JVM Tuning", "Spring Boot"], interests: ["System Design", "Performance", "Open Source"], experience: [{ title: "Principal Engineer", company: "Stripe", startDate: "2021-03", description: "Led migration to event-driven architecture processing 2M+ events/sec" }, { title: "Staff Engineer", company: "Uber", startDate: "2017-06", endDate: "2021-02", description: "Built real-time pricing engine" }], education: [{ degree: "M.S. Computer Science", institution: "Stanford University", year: "2014" }], achievements: [{ name: "Top Writer", icon: "🏆", description: "Top 1% contributor" }, { name: "10K Views", icon: "👁️", description: "Over 10K article views" }, { name: "Featured Author", icon: "⭐", description: "Featured on homepage" }], joinedAt: "2021-03-15", lastActive: "2026-06-28" },
  { username: "marcus-lee", name: "Marcus Lee", headline: "Staff Engineer · Spring Boot | Kafka | Fintech", location: "New York, NY", company: "Bloomberg", bio: "Staff Engineer at a fintech. Writes about Spring, Kafka, and shipping reliably.", followers: 18420, following: 89, articlesCount: 54, totalViews: 415000, totalLikes: 22100, totalComments: 2100, readingTime: 380, totalBookmarks: 9200, badges: ["Top 1%", "Verified"], social: { twitter: "marcuslee", github: "marcuslee", linkedin: "marcuslee" }, skills: ["Spring Boot", "Kafka", "Java", "Microservices", "AWS"], interests: ["Fintech", "Architecture", "DevOps"], experience: [{ title: "Staff Engineer", company: "Bloomberg", startDate: "2019-08", description: "Leading platform engineering for financial data pipelines" }], education: [{ degree: "B.S. Computer Engineering", institution: "MIT", year: "2012" }], achievements: [{ name: "Spring Expert", icon: "🍃", description: "Spring Boot contributor" }, { name: "100 Articles", icon: "📝", description: "Published 100+ articles" }], joinedAt: "2021-06-01", lastActive: "2026-06-27" },
  { username: "priya-shah", name: "Priya Shah", headline: "Frontend Architect · Angular | TypeScript | Design Systems", location: "London, UK", company: "Google", bio: "Frontend architect. Angular, signals, accessible design systems.", followers: 15630, following: 211, articlesCount: 41, totalViews: 298000, totalLikes: 16400, totalComments: 1900, readingTime: 290, totalBookmarks: 7200, badges: ["Verified"], social: { twitter: "priyacodes", linkedin: "priyashah" }, skills: ["Angular", "TypeScript", "RxJS", "Signals", "Accessibility"], interests: ["Design Systems", "Web Standards", "DX"], experience: [{ title: "Frontend Architect", company: "Google", startDate: "2022-01", description: "Angular core team — signals and change detection" }], education: [{ degree: "B.S. Computer Science", institution: "Imperial College London", year: "2015" }], achievements: [{ name: "Angular Expert", icon: "🅰️", description: "Angular core team member" }], joinedAt: "2022-01-10", lastActive: "2026-06-25" },
  { username: "daniel-okafor", name: "Daniel Okafor", headline: "Platform Engineer · Kubernetes | SRE | Observability", location: "Berlin, Germany", bio: "Platform engineer. Kubernetes, observability, and developer experience.", followers: 12940, following: 76, articlesCount: 38, totalViews: 215000, totalLikes: 12800, totalComments: 1500, readingTime: 260, totalBookmarks: 5800, badges: ["Verified"], social: { github: "danokafor", linkedin: "danielokafor" }, skills: ["Kubernetes", "Go", "Prometheus", "Terraform", "Docker"], interests: ["Platform Engineering", "SRE", "Cloud Native"], experience: [{ title: "Platform Engineer", company: "Zalando", startDate: "2020-03", description: "Operating 40+ Kubernetes clusters" }], education: [{ degree: "M.S. Software Engineering", institution: "TU Berlin", year: "2018" }], achievements: [{ name: "K8s Contributor", icon: "☸️", description: "CNCF landscape contributor" }], joinedAt: "2022-08-20", lastActive: "2026-06-26" },
  { username: "lena-kowalski", name: "Lena Kowalski", headline: "AI Engineer · LLMs | RAG | Agentic Workflows", location: "Toronto, Canada", bio: "AI engineer working on retrieval, evals, and agentic workflows.", followers: 21380, following: 130, articlesCount: 47, totalViews: 524000, totalLikes: 31200, totalComments: 2800, readingTime: 340, totalBookmarks: 14300, badges: ["Top 1%", "Verified"], social: { twitter: "lenak", linkedin: "lenakowalski" }, skills: ["Python", "PyTorch", "LangChain", "RAG", "Vector Databases"], interests: ["AI Safety", "Evals", "Open Source LLMs"], experience: [{ title: "AI Engineer", company: "Cohere", startDate: "2022-06", description: "Building RAG evaluation pipelines" }], education: [{ degree: "Ph.D. Machine Learning", institution: "University of Toronto", year: "2021" }], achievements: [{ name: "Top Writer", icon: "🏆", description: "Top 1% contributor" }, { name: "AI Expert", icon: "🤖", description: "Recognized AI thought leader" }], joinedAt: "2022-06-15", lastActive: "2026-06-28" },
  { username: "jonas-meyer", name: "Jonas Meyer", headline: "Author · System Design | Engineering Leadership", location: "Zurich, Switzerland", bio: "Author of two books on system design. Helping engineers level up.", followers: 31200, following: 58, articlesCount: 102, totalViews: 1250000, totalLikes: 68400, totalComments: 5600, readingTime: 780, totalBookmarks: 28100, badges: ["Top 1%", "Verified", "Author"], social: { website: "jonasmeyer.dev", linkedin: "jonasmeyer" }, skills: ["System Design", "Architecture", "Interview Prep", "Leadership"], interests: ["Mentoring", "Writing", "Public Speaking"], experience: [{ title: "Author & Consultant", company: "Self-Employed", startDate: "2018-01", description: "Published two books on distributed systems" }, { title: "Engineering Director", company: "Swisscom", startDate: "2012-06", endDate: "2017-12", description: "Led 80+ engineers across 12 teams" }], education: [{ degree: "M.S. Computer Science", institution: "ETH Zurich", year: "2010" }], achievements: [{ name: "Top Writer", icon: "🏆", description: "Top 1% contributor" }, { name: "Featured Author", icon: "⭐", description: "Featured on homepage" }, { name: "100 Articles", icon: "📝", description: "Published 100+ articles" }, { name: "Best Author", icon: "📚", description: "Awarded Best Technical Author 2025" }], joinedAt: "2020-09-01", lastActive: "2026-06-28" },
];

const SEED_CATEGORIES: Category[] = [
  { slug: "system-design", name: "System Design", description: "Architecture, distributed systems, and design patterns.", color: "from-indigo-600 to-fuchsia-600", icon: "🏗️" },
  { slug: "spring-boot", name: "Spring Boot", description: "Spring ecosystem, JVM, and backend engineering.", color: "from-emerald-500 to-teal-600", icon: "🍃" },
  { slug: "angular", name: "Angular", description: "Angular, TypeScript, and frontend architecture.", color: "from-rose-500 to-pink-600", icon: "🅰️" },
  { slug: "genai", name: "Generative AI", description: "LLMs, RAG, agents, and practical AI engineering.", color: "from-fuchsia-600 to-purple-600", icon: "🤖" },
  { slug: "kubernetes", name: "Kubernetes", description: "Container orchestration, platform engineering, and SRE.", color: "from-indigo-500 to-blue-700", icon: "☸️" },
  { slug: "typescript", name: "TypeScript", description: "Type systems, patterns, and type-level programming.", color: "from-blue-600 to-indigo-600", icon: "📘" },
  { slug: "docker", name: "Docker", description: "Containers, images, and CI/CD pipelines.", color: "from-sky-500 to-blue-600", icon: "🐳" },
  { slug: "career", name: "Career", description: "Engineering career growth, leadership, and interviews.", color: "from-amber-500 to-orange-600", icon: "🚀" },
  { slug: "microservices", name: "Microservices", description: "Service boundaries, communication, and operational complexity.", color: "from-violet-600 to-pink-600", icon: "🔌" },
  { slug: "interview-questions", name: "Interview Questions", description: "System design, coding, and behavioral interview prep.", color: "from-rose-600 to-red-600", icon: "💼" },
  { slug: "cloud", name: "Cloud", description: "Cloud infrastructure, cost optimization, and DevOps.", color: "from-cyan-500 to-blue-700", icon: "☁️" },
];

const ARTICLE_CONTENT = `Most production incidents trace back to one of three things: a misunderstood timeout, a leaked resource, or a silent retry storm.

## The shape of the problem

When you onboard to a new service, you inherit a topology of upstream and downstream dependencies. Each edge in that graph has a budget — for latency, for failures, and for the number of in-flight requests.

> If you can't draw your dependency graph in five minutes, you don't understand your service yet.

## Timeouts are a contract

A timeout isn't a "just in case" — it's a promise to the caller. Tight timeouts. Bounded retries. Filtered to transient errors only.

## Retries should be a budget, not a habit

Pick **one** layer to own retries and disable them everywhere else.

## Closing thought

The boring practices — timeouts, bulkheads, circuit breakers — are what separate a service that survives a bad Tuesday from one that takes the whole org down.`;

const SEED_ARTICLES: Article[] = [
  { id: crypto.randomUUID(), slug: "production-resilience-three-mistakes", title: "The three mistakes that cause most production incidents", excerpt: "After a decade of on-call rotations, almost every postmortem comes back to one of three patterns.", content: ARTICLE_CONTENT, authorUsername: "ananya-rao", category: "system-design", tags: ["reliability", "java", "spring-boot"], publishedAt: "2026-06-21", readingMinutes: 9, likes: 1842, bookmarks: 612, comments: [], coverGradient: "from-indigo-600 via-violet-600 to-fuchsia-600", featured: true, trending: true },
  { id: crypto.randomUUID(), slug: "spring-boot-3-virtual-threads", title: "Virtual threads in Spring Boot 3.5: a field report", excerpt: "We migrated 14 services to Loom-backed virtual threads.", content: ARTICLE_CONTENT, authorUsername: "marcus-lee", category: "spring-boot", tags: ["java", "performance", "loom"], publishedAt: "2026-06-19", readingMinutes: 12, likes: 2410, bookmarks: 894, comments: [], coverGradient: "from-emerald-500 via-teal-600 to-cyan-700", featured: true, trending: true },
  { id: crypto.randomUUID(), slug: "angular-signals-architecture", title: "Architecting large Angular apps with signals", excerpt: "Signals change the shape of a well-designed Angular app.", content: ARTICLE_CONTENT, authorUsername: "priya-shah", category: "angular", tags: ["angular", "signals", "rxjs"], publishedAt: "2026-06-18", readingMinutes: 11, likes: 1620, bookmarks: 540, comments: [], coverGradient: "from-rose-500 via-pink-600 to-fuchsia-700", featured: true },
  { id: crypto.randomUUID(), slug: "rag-evals-that-matter", title: "RAG evals that actually predict production quality", excerpt: "Most teams measure the wrong things.", content: ARTICLE_CONTENT, authorUsername: "lena-kowalski", category: "genai", tags: ["llm", "rag", "evals"], publishedAt: "2026-06-17", readingMinutes: 14, likes: 2980, bookmarks: 1124, comments: [], coverGradient: "from-fuchsia-600 via-purple-600 to-indigo-700", trending: true },
  { id: crypto.randomUUID(), slug: "k8s-platform-team-of-three", title: "Running a Kubernetes platform with a team of three", excerpt: "Lessons from operating 40+ clusters with a tiny team.", content: ARTICLE_CONTENT, authorUsername: "daniel-okafor", category: "kubernetes", tags: ["kubernetes", "platform", "sre"], publishedAt: "2026-06-15", readingMinutes: 13, likes: 1340, bookmarks: 478, comments: [], coverGradient: "from-indigo-500 via-blue-600 to-sky-700", trending: true },
  { id: crypto.randomUUID(), slug: "system-design-rate-limiter", title: "Designing a distributed rate limiter, end to end", excerpt: "The full design walkthrough — token bucket, sliding window, Redis tradeoffs.", content: ARTICLE_CONTENT, authorUsername: "jonas-meyer", category: "system-design", tags: ["interviews", "redis", "design"], publishedAt: "2026-06-14", readingMinutes: 18, likes: 4120, bookmarks: 2103, comments: [], coverGradient: "from-slate-700 via-slate-800 to-slate-900", trending: true },
  { id: crypto.randomUUID(), slug: "typescript-discriminated-unions", title: "Discriminated unions are the API design tool you're not using", excerpt: "How a small TypeScript pattern eliminates entire categories of bugs.", content: ARTICLE_CONTENT, authorUsername: "priya-shah", category: "typescript", tags: ["typescript", "patterns"], publishedAt: "2026-06-12", readingMinutes: 8, likes: 1480, bookmarks: 612, comments: [], coverGradient: "from-blue-600 via-indigo-600 to-violet-700" },
  { id: crypto.randomUUID(), slug: "docker-multistage-prod", title: "Docker multistage builds for production Java services", excerpt: "Tiny images, fast builds, and a base layer strategy.", content: ARTICLE_CONTENT, authorUsername: "marcus-lee", category: "docker", tags: ["docker", "java", "ci"], publishedAt: "2026-06-10", readingMinutes: 7, likes: 980, bookmarks: 412, comments: [], coverGradient: "from-sky-500 via-blue-600 to-indigo-700" },
  { id: crypto.randomUUID(), slug: "career-staff-engineer-archetypes", title: "The four archetypes of a staff engineer", excerpt: "Tech lead, architect, solver, right-hand — the same title, very different jobs.", content: ARTICLE_CONTENT, authorUsername: "jonas-meyer", category: "career", tags: ["career", "leadership"], publishedAt: "2026-06-08", readingMinutes: 10, likes: 3210, bookmarks: 1840, comments: [], coverGradient: "from-amber-500 via-orange-600 to-rose-600" },
  { id: crypto.randomUUID(), slug: "microservices-when-not-to", title: "When not to use microservices", excerpt: "A modular monolith is almost always the right starting point.", content: ARTICLE_CONTENT, authorUsername: "ananya-rao", category: "microservices", tags: ["architecture"], publishedAt: "2026-06-06", readingMinutes: 11, likes: 2180, bookmarks: 920, comments: [], coverGradient: "from-violet-600 via-purple-600 to-pink-600" },
  { id: crypto.randomUUID(), slug: "interview-low-latency", title: "How I prepare for low-latency systems interviews", excerpt: "A four-week plan that focuses on what interviewers actually probe.", content: ARTICLE_CONTENT, authorUsername: "jonas-meyer", category: "interview-questions", tags: ["interviews", "career"], publishedAt: "2026-06-04", readingMinutes: 9, likes: 1740, bookmarks: 1023, comments: [], coverGradient: "from-rose-600 via-red-600 to-orange-600" },
  { id: crypto.randomUUID(), slug: "cloud-cost-cuts", title: "We cut our cloud bill 62% without rewriting anything", excerpt: "The unglamorous, high-leverage moves: right-sizing, commitment math.", content: ARTICLE_CONTENT, authorUsername: "daniel-okafor", category: "cloud", tags: ["cloud", "finops"], publishedAt: "2026-06-02", readingMinutes: 10, likes: 2640, bookmarks: 1380, comments: [], coverGradient: "from-cyan-500 via-sky-600 to-blue-700" },
];

export function seedIfEmpty() {
  if (typeof window === "undefined") return;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    likedArticles: [],
    bookmarkedArticles: [],
    followedAuthors: [],
    newsletterSubscribed: false,
    currentUser: null,
  }));
  sessionStorage.setItem("seed-authors", JSON.stringify(SEED_AUTHORS));
  sessionStorage.setItem("seed-categories", JSON.stringify(SEED_CATEGORIES));
  sessionStorage.setItem("seed-articles", JSON.stringify(SEED_ARTICLES));
}

export function getSeedAuthors(): Author[] {
  try {
    const raw = sessionStorage.getItem("seed-authors");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function getSeedCategories(): Category[] {
  try {
    const raw = sessionStorage.getItem("seed-categories");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function getSeedArticles(): Article[] {
  try {
    const raw = sessionStorage.getItem("seed-articles");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
