import { AppShell } from "@/components/app-shell"
import { HallazgosView } from "@/components/hallazgos-view"

export const metadata = {
  title: "Gestión de Hallazgos | Usability Test Dashboard",
}

export default function HallazgosPage() {
  return (
    <AppShell>
      <main className="flex-1 p-6 overflow-auto">
        <HallazgosView />
      </main>
    </AppShell>
  )
}
