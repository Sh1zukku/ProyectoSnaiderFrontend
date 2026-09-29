import { Outlet } from "react-router";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
        <Outlet />
      </div>
    </div>
  )
}
