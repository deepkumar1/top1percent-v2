export type UserRole = "admin" | "author";

export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  authorUsername?: string;
};

export const DEMO_USERS: User[] = [
  {
    id: "admin-1",
    email: "admin@top1percent.com",
    password: "admin123",
    name: "Site Admin",
    role: "admin",
    authorUsername: "jonas-meyer",
  },
  {
    id: "admin-2",
    email: "editor@top1percent.com",
    password: "admin123",
    name: "Senior Editor",
    role: "admin",
  },
  {
    id: "author-1",
    email: "author@top1percent.com",
    password: "author123",
    name: "Ananya Rao",
    role: "author",
    authorUsername: "ananya-rao",
  },
  {
    id: "author-2",
    email: "marcus@top1percent.com",
    password: "author123",
    name: "Marcus Lee",
    role: "author",
    authorUsername: "marcus-lee",
  },
];

export function authenticateUser(email: string, password: string): User | null {
  const user = DEMO_USERS.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
  );

  return user || null;
}

export type SessionUser = Omit<User, "password">;

export function toSessionUser(user: User): SessionUser {
  const { password: _, ...session } = user;
  return session;
}
