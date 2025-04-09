'use client'
import { signOut, useSession } from "next-auth/react"
import { redirect } from "next/navigation";

export default function logOut() {
    const { data: session, status } = useSession();

    if (status === "authenticated") {
        return (
            <div className="w-full h-full min-h-screen flex flex-col items-center justify-center"  id="logoutDiv">
                <h1>Logout</h1>
                <p>Sicuro di voler effettuare il logout?</p>
                <div className="flex gap-4 mt-4">
                    <button className="negative" onClick={() => redirect('/')}>No</button>
                    <button className="positive" onClick={() => { signOut({callbackUrl: 'https://labinformaticaescuola.it'}) }}>Si</button>
                </div>
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
