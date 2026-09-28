import { ThemeProvider } from "@/components/theme-provider";
import { Outlet } from "react-router";
import { AdminHeader } from "@/components/admin/CustomHeaderAdmin";

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <div className="min-h-screen bg-background">
          <AdminHeader />
          <Outlet />
        </div>
      </ThemeProvider>
    </div>
  )
}