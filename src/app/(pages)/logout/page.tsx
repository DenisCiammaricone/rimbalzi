'use client'
import { signOut, useSession } from "next-auth/react"
import { redirect } from "next/navigation";

export default function logOut() {
    const { data: session, status } = useSession();

    if (status === "authenticated") {
        console.log(session)
        return (
            <div className="w-full h-full min-h-screen flex flex-col items-center justify-center">
                <h1>Logout</h1>
                <p>Sicuro di voler effettuare il logout?</p>
                <button onClick={() => { signOut() }}>Si</button>
            </div>
        )
    } else if (status === "unauthenticated") {
        redirect("/login")
    } else {
        return (
            <div className='flex min-h-screen justify-center items-center text-3xl font-bold'>
                <svg viewBox="25 25 50 50">
                    <circle r="20" cy="50" cx="50"></circle>
                </svg>
            </div>
        )
    }
}
