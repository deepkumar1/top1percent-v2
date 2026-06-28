import { LoginNew } from "@/components/ui/login";

export default function LoginPage({ redirect = "/" }: { redirect?: string }) {
  return <LoginNew redirect={redirect} />;
}
