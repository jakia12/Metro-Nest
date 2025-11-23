import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  // Redirect all users to overview page
  // The layout will show role-based sidebar
  redirect("/dashboard/overview");
}