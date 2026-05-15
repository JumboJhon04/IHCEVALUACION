import { AppShell } from "@/components/app-shell"
import { PlanView } from "@/components/plan-view"

export const metadata = {
  title: "Plan de Prueba | Usability Test Dashboard",
}

export default function PlanPage() {
  return (
    <AppShell>
      <main className="flex-1 p-6 overflow-auto">
        <PlanView />
      </main>
    </AppShell>
  )
}
