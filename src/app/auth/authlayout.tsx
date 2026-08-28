import { ThemeProvider } from "@/components/theme-provider";
import { Outlet } from "react-router";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Outlet />
      </ThemeProvider>
    </div>
  )
}