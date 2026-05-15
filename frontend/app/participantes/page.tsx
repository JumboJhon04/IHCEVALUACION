import { ParticipantesView } from '@/components/participantes-view'
import { AppShell } from '@/components/app-shell'

export default function ParticipantesPage() {
  return (
    <AppShell>
      <main className="flex-1 p-6 overflow-auto">
        <ParticipantesView />
      </main>
    </AppShell>
  )
}
