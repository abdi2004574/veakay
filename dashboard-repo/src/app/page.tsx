import { redirect } from "next/navigation";
import { getServerToken } from "@/lib/auth";

export default function Home() {
  const token = getServerToken();
  if (!token) {
    redirect("/login");
  }
  redirect("/dashboard");
}