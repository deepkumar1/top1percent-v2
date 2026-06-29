import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatNumber(n: number | null | undefined) {
  if (n == null) return "0";
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "k";
  return n.toString();
}

const GRADIENTS = [
  "from-violet-500 to-fuchsia-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-blue-700",
  "from-fuchsia-500 to-purple-700",
  "from-slate-600 to-slate-900",
  "from-cyan-500 to-blue-600",
  "from-amber-500 to-orange-600",
  "from-sky-500 to-indigo-600",
  "from-teal-500 to-cyan-600",
];

function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getAvatarGradient(username: string | undefined): string {
  if (!username) return GRADIENTS[0];
  return GRADIENTS[hashString(username) % GRADIENTS.length];
}

export function getInitials(name: string | undefined | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return parts.map((p) => p[0]).join("").toUpperCase().slice(0, 2);
  }
  return name.slice(0, 2).toUpperCase();
}
