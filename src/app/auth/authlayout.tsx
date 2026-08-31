import { ThemeProvider } from "@/components/theme-provider";
import { Outlet } from "react-router";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
          <Outlet />
        </div>
      </ThemeProvider>
    </div>
  )
}