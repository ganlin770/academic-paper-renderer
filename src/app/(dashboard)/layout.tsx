import { Suspense } from 'react'
import { requireAuth } from '@/lib/auth'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <DashboardSidebar user={user} />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader user={user} />
        
        <main className="flex-1 overflow-y-auto">
          <Suspense fallback={<div className="p-6">Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  )
}