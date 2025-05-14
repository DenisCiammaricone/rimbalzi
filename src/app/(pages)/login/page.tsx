'use client'
import ErrorText from '@/app/components/ErrorText';
import { signIn, useSession } from "next-auth/react";
import React, { Suspense, useState } from 'react';
import { redirect } from 'next/navigation';

export default function LoginPage() {
    const { data: session, status } = useSession();
    const [loginError, setLoginError] = useState("");
    if(status === "authenticated") {
        redirect('/')
    }
    if(status === "loading") {
        return (
            <div className='flex min-h-screen justify-center items-center text-3xl font-bold'>
                <svg viewBox="25 25 50 50">
                    <circle r="20" cy="50" cx="50"></circle>
                </svg>
            </div>
        )
    }
    return (
        < Suspense >
            <div id="login-register-formBox" className='flex flex-col gap-5 2xl:w-1/6 xl:w-1/4 lg:w-1/4 md:w-1/3 sm:w-full mx-auto p-5 mt-20 '>
                <h1 className="mx-auto">Login</h1>
                <form className="flex flex-col gap-2 mx-auto" onSubmit={async (event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const data = {
                        redirect: false as const,
                        email: formData.get('email'),
                        password: formData.get('password')
                    };
                    const res = await signIn("credentials", data)
                    if (res?.error) {
                        if(res.error === "CredentialsSignin") {
                            setLoginError("Credenziali non valide")
                        } else {
                            // Configuration Error
                            setLoginError("Errore nel login... Contatta un amministratore" )
                        }
                    } else {
                        redirect('/')
                    }
                }}>
                    <div>
                        <input id="email" name="email" type="email" placeholder="Email" />
                    </div>
                    <div>
                        <input id="password" name="password" type="password" placeholder="Password" />
                    </div>
                    <button type="submit">Login</button>
                    {<ErrorText error={loginError}></ErrorText>}
                </form>

                <hr></hr>
                <p></p>
                <div className='mx-auto'>Non hai un account? <a className="link" href='/register'><i>Registrati ora!</i></a></div>
            </div >
        </Suspense >
    );
};
