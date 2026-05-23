import { redirect } from 'next/navigation'
import { db } from '../../../lib/db'
import { getAdminSession } from '../../../lib/auth'
import AdminDashboard from './AdminDashboard'

export const metadata = { title: 'Admin Dashboard — Test Lab' }

export default async function AdminDashboardPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const credentials = await db.tlCredential.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { sessions: true } } },
  })

  return (
    <AdminDashboard
      credentials={credentials}
      isSuperAdmin={session.isSuperAdmin}
      adminUsername={session.username}
    />
  )
}
