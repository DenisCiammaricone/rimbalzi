import { getUserPermissions, getUserGroupById, isUserInGroupById } from "@/actions/user"
import { auth } from "@/auth"
 
export default async function Page() {
  const session = await auth()
  if (!session) return <div>Not authenticated</div>
 
  console.log(" id: " + session.user.id)
  return (
    <div>
      <pre>{JSON.stringify(session, null,2)}</pre>
    </div>
  )
}