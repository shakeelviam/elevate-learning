import { db } from '../../../lib/db'
import AdminDashboard from './AdminDashboard'

export const metadata = { title: 'Admin Dashboard — Test Lab' }

export default async function AdminDashboardPage() {
  const credentials = await db.tlCredential.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { sessions: true } } },
  })

  return <AdminDashboard credentials={credentials} />
}
