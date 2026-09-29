import { Outlet } from "react-router";
import { AdminHeader } from "@/components/admin/CustomHeaderAdmin";

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <AdminHeader />
      <Outlet />
    </div>
  )
}
