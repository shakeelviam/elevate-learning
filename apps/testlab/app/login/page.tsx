import { redirect } from 'next/navigation'
import { getSession } from '../../lib/session'
import LoginForm from './LoginForm'

export const metadata = { title: 'Sign In — Test Lab' }

export default async function LoginPage() {
  const session = await getSession()
  if (session) redirect('/exam')

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 p-4">
      <LoginForm />
    </div>
  )
}
