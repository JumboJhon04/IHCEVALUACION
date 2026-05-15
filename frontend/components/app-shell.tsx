"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ClipboardList,
  ListChecks,
  Eye,
  FileSearch,
  Menu,
  X,
  Target,
  Users,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Vista general",
  },
  {
    href: "/plan",
    label: "Plan de Prueba",
    icon: ClipboardList,
    description: "Gestión de planes",
  },
  {
    href: "/tareas",
    label: "Tareas y Guion",
    icon: ListChecks,
    description: "Escenarios y scripts",
  },
  {
    href: "/participantes",
    label: "Participantes",
    icon: Users,
    description: "Perfiles de usuarios",
  },
  {
    href: "/observaciones",
    label: "Observaciones",
    icon: Eye,
    description: "Registro en vivo",
  },
  {
    href: "/hallazgos",
    label: "Hallazgos",
    icon: FileSearch,
    description: "Síntesis y análisis",
  },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-dvh flex bg-background bg-[radial-gradient(circle_at_20%_0%,rgba(24,119,242,0.08),transparent_45%),radial-gradient(circle_at_80%_100%,rgba(8,145,178,0.08),transparent_40%)]">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/55 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        role="navigation"
        aria-label="Navegación principal"
        className={cn(
          "fixed inset-y-0 left-0 z-40 h-dvh min-h-dvh w-full max-w-full bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:sticky md:top-0 md:w-72 md:max-w-[18rem] md:translate-x-0 md:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(170deg,rgba(17,97,206,0.22)_0%,rgba(4,30,62,0)_42%)]" aria-hidden="true" />

        {/* Sidebar header - Logo area */}
        <div className="relative flex items-center gap-3 px-6 py-6 border-b border-sidebar-border/45">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sidebar-primary to-sidebar-primary/70 shadow-lg shadow-sidebar-primary/25">
            <Target className="w-5 h-5 text-sidebar-primary-foreground" aria-hidden="true" focusable="false" />
          </div>
          <div className="flex-1">
            <p className="text-base font-bold leading-tight text-sidebar-foreground tracking-tight">U-Test</p>
            <p className="text-sm text-sidebar-foreground/80 leading-tight">Usability Testing</p>
          </div>
          <button
            className="md:hidden text-sidebar-foreground/70 hover:text-sidebar-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-ring rounded-lg p-1.5 hover:bg-sidebar-accent transition-colors"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" aria-hidden="true" focusable="false" />
          </button>
        </div>

        {/* Nav section label */}
        <div className="relative px-6 pt-6 pb-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-sidebar-foreground/70">
            Navegación
          </p>
        </div>

        {/* Nav links */}
        <nav className="relative flex-1 px-4 space-y-1.5 overflow-y-auto pb-5" aria-label="Secciones">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar focus-visible:bg-sidebar-accent focus-visible:text-sidebar-accent-foreground relative overflow-hidden",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/30"
                    : "text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary-foreground rounded-r-full" />
                )}
                
                <div className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-lg transition-colors shrink-0 group-focus-visible:bg-sidebar-accent",
                  isActive 
                    ? "bg-sidebar-primary-foreground/20" 
                    : "bg-sidebar-accent/50 group-hover:bg-sidebar-accent"
                )}>
                  <Icon className="w-[18px] h-[18px]" aria-hidden="true" focusable="false" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "truncate font-medium",
                    isActive ? "text-sidebar-primary-foreground" : ""
                  )}>
                    {item.label}
                  </p>
                  <p className={cn(
                    "text-sm truncate group-focus-visible:text-sidebar-accent-foreground",
                    isActive ? "text-sidebar-primary-foreground/85" : "text-sidebar-foreground/70"
                  )}
                  aria-hidden="true"
                  >
                    {item.description}
                  </p>
                </div>

                <ChevronRight className={cn(
                  "w-4 h-4 shrink-0 transition-transform",
                  isActive ? "text-sidebar-primary-foreground/70" : "text-sidebar-foreground/30 group-hover:translate-x-0.5"
                )}
                aria-hidden="true"
                focusable="false"
                />
              </Link>
            )
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="relative px-6 py-5 border-t border-sidebar-border/45 bg-sidebar/70 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-sm font-semibold text-sidebar-accent-foreground">UX</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground/80 truncate">v1.0.0</p>
              <p className="text-sm text-sidebar-foreground/65 truncate">UX Research Tool</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 bg-background/65 md:backdrop-blur-[1px]">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center gap-4 px-4 md:px-6 py-3 bg-card/80 backdrop-blur-md border-b border-border/80 h-16">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden border border-border/70 bg-background/70"
            onClick={() => setSidebarOpen(true)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            aria-label="Abrir menú de navegación"
          >
            <Menu className="w-5 h-5" aria-hidden="true" focusable="false" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              {navItems.find((n) => n.href === pathname)?.label ?? "Dashboard"}
            </span>
          </div>
        </header>

        {/* Page content */}
        {children}
      </div>
    </div>
  )
}
