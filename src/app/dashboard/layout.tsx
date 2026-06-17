import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main>
        <div className="dashboard-main">{children}</div>
      </main>
    </div>
  )
}
