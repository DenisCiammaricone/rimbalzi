import { auth } from '@/auth';
import { redirect } from 'next/navigation'

export default async function dashboard() {
    const session = await auth()
    if (!session) return redirect('/401')
    return (<div>

    </div>);
}