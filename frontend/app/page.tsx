import { AppShell } from '@/components/app-shell'
import { DashboardView } from '@/components/dashboard-view'

export default function HomePage() {
  return (
    <AppShell>
      <main className="flex-1 p-6 overflow-auto">
        <DashboardView />
      </main>
    </AppShell>
  )
}
