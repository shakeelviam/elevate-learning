import { redirect } from 'next/navigation'
import { getSession } from '../../lib/session'
import { ExamHub } from '../../components/test-lab/ExamHub'

export const metadata = { title: 'Test Lab' }

export default async function ExamPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <ExamHub
      username={session.credential.username}
      fastApiToken={session.fastApiToken}
    />
  )
}
