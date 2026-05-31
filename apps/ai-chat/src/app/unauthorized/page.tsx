import { UserButton } from '@clerk/nextjs'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="w-14 h-14 rounded-xl bg-[#2E80D8] flex items-center justify-center mb-2">
        <span className="text-white font-black text-xl">E8</span>
      </div>
      <h1 className="text-2xl font-black text-[#1F6CBD]">Access Restricted</h1>
      <p className="text-gray-500 max-w-sm">
        Elev8 AI is available to authorised staff and management only.
        Contact your administrator to request access.
      </p>
      <div className="mt-2">
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </div>
  )
}
