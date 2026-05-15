import { AppShell } from "@/components/app-shell"
import { ObservacionesView } from "@/components/observaciones-view"

export const metadata = {
  title: "Registro de Observación | Usability Test Dashboard",
}

export default function ObservacionesPage() {
  return (
    <AppShell>
      <main className="flex-1 p-6 overflow-auto">
        <ObservacionesView />
      </main>
    </AppShell>
  )
}
