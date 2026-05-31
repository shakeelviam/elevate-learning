import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ChatInterface } from '@/components/ChatInterface'

export default async function ChatPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await currentUser()
  const userName = user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ?? 'Staff'
  const role = ((user?.publicMetadata as Record<string, string> | undefined)?.role ?? 'staff')
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1)

  return <ChatInterface userName={userName} roleLabel={roleLabel} />
}
