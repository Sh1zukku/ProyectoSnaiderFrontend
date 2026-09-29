import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface PageShellProps {
  title: string
  description?: ReactNode
  meta?: ReactNode
  actions?: ReactNode
  children: ReactNode
  size?: "default" | "narrow"
}

export function PageShell({
  title,
  description,
  meta,
  actions,
  children,
  size = "default",
}: PageShellProps) {
  return (
    <main
      className={cn(
        "mx-auto flex w-full flex-1 flex-col gap-8 px-6 py-10",
        size === "narrow" ? "max-w-3xl" : "max-w-7xl",
      )}
    >
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          {description ? (
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
              {description}
            </p>
          ) : null}
          {meta ? <p className="pt-1 text-sm text-muted-foreground">{meta}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </header>
      {children}
    </main>
  )
}

export function CountLabel({ count, noun }: { count: number; noun: string }) {
  return (
    <>
      <span className="font-mono tabular-nums text-foreground">{count}</span>{" "}
      {count === 1 ? noun : `${noun}s`}
    </>
  )
}
