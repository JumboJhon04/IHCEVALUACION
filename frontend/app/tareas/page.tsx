import { AppShell } from "@/components/app-shell"
import { TareasView } from "@/components/tareas-view"

export const metadata = {
  title: "Tareas y Guion | Usability Test Dashboard",
}

export default function TareasPage() {
  return (
    <AppShell>
      <main className="flex-1 p-6 overflow-auto">
        <TareasView />
      </main>
    </AppShell>
  )
}
