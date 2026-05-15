"use client"

import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react"
import type { Toast } from "@/hooks/use-toasts"

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const STYLES = {
  success: "bg-success text-success-foreground border-success",
  error: "bg-destructive text-destructive-foreground border-destructive",
  warning: "bg-warning text-warning-foreground border-warning",
  info: "bg-info text-info-foreground border-info",
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div
      role="region"
      aria-label="Notificaciones"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]"
    >
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type]
        return (
          <div
            key={toast.id}
            role="alert"
            className={cn(
              "flex items-start gap-3 px-4 py-3 rounded-lg border shadow-md animate-in slide-in-from-right-5",
              STYLES[toast.type]
            )}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">{toast.title}</p>
              {toast.message && (
                <p className="text-xs mt-0.5 opacity-90 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => onRemove(toast.id)}
              aria-label="Cerrar notificación"
              className="shrink-0 opacity-80 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-current rounded"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
