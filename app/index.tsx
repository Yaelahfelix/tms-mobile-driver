import { Redirect } from "expo-router";
import { useAuth } from "@/lib/auth";

export default function Index() {
  const { token, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!token) {
    return <Redirect href="/tabs/auth/login" />;
  }

  return <Redirect href="/tabs" />;
}
