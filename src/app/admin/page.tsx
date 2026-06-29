import { isAdminAuthenticated } from "@/lib/auth";
import { getAllMatches } from "@/lib/tournament";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return (
      <div className="min-h-screen bg-rullo-dark">
        <AdminLogin />
      </div>
    );
  }

  const matches = await getAllMatches();

  return (
    <div className="min-h-screen bg-rullo-dark">
      <AdminDashboard matches={matches} />
    </div>
  );
}
