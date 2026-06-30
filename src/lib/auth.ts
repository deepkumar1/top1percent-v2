export type UserRole = "admin" | "author";

export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  authorUsername?: string;
};

export type SessionUser = Omit<User, "password">;

export function toSessionUser(user: User): SessionUser {
  const { password: _, ...session } = user;
  return session;
}
