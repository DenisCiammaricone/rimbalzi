'use client'
import ErrorText from '@/app/components/ErrorText';
import { signIn } from "next-auth/react";
import React, { Suspense, useState } from 'react';
import { redirect, useSearchParams } from 'next/navigation';


let credentialsError: boolean = false;
export default function LoginPage() {
    const [loginError, setLoginError] = useState("");
    const searchParams = useSearchParams();
    credentialsError = searchParams.get("code") === "credentials";
    return (
        < Suspense >
            <div id="login-register-formBox" className='flex flex-col gap-5 2xl:w-1/6 xl:w-1/4 lg:w-1/4 md:w-1/3 sm:w-full mx-auto p-5 mt-20 '>
                <h1 className="mx-auto">Login</h1>
                <form className="flex flex-col gap-2 mx-auto" onSubmit={async (event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const data = {
                        redirect: false,
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
