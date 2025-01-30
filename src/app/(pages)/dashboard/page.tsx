import { isUserInGroupById } from '@/actions/user';
import { auth } from '@/auth';
import { redirect } from 'next/navigation'

export default async function dashboard() {
    const session = await auth()
    if (!session) return redirect('/401')

    if(await isUserInGroupById(Number(session.user.id), "teacher")){
        return <div><h1>Sono Insegnante</h1></div>
    } else {
        return <div><h1>Non sono un Insegnante</h1></div>
    }
}