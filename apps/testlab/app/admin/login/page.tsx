import AdminLoginForm from './AdminLoginForm'

export const metadata = { title: 'Admin Login — Test Lab' }

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 p-4">
      <AdminLoginForm />
    </div>
  )
}
