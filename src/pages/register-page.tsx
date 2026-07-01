import { RegisterPage } from "@/components/ui/register";

export default function RegisterRoute({ adminCreate }: { adminCreate?: boolean }) {
  return <RegisterPage adminCreate={adminCreate} />;
}
