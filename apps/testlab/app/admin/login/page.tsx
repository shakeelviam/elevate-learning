import AdminLoginForm from './AdminLoginForm'

export const metadata = { title: 'Admin Login — Test Lab' }

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
      <AdminLoginForm />
    </div>
  )
}
