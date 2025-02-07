'use client'
import ErrorText from '@/app/components/errorText';
import { signIn } from "next-auth/react"
import { AuthError, CredentialsSignin } from 'next-auth';
import React from 'react';
import { set } from 'zod';
import { useSearchParams } from 'next/navigation';


let credentialsError: boolean = false;
export default function LoginPage() {
    const searchParams = useSearchParams();
    credentialsError = searchParams.get("code") === "credentials";
    return (
            <div id="login-register-formBox" className='flex flex-col gap-5 2xl:w-1/6 xl:w-1/4 lg:w-1/4 md:w-1/3 sm:w-full mx-auto p-5 mt-20 '>
                <h1 className="mx-auto">Login</h1>
                {/* <form className="flex flex-col gap-2 mx-auto"  action={async (formData) => {
                    "use server"
                    await signIn("credentials", formData).catch((e) => {if (e instanceof CredentialsSignin) { console.log("Invalid credentials") } else { console.log("An error occurred") }});
                }}> */}
                <form className="flex flex-col gap-2 mx-auto" onSubmit={async (event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const data = {
                        email: formData.get('email'),
                        password: formData.get('password')
                    };
                    await signIn("credentials", data);
                }}>
                    <div>
                        <input id="email" name="email" type="email" placeholder="Email" />
                    </div>
                    <div>
                        <input id="password" name="password" type="password" placeholder="Password" />
                    </div>
                    <button type="submit">Login</button>
                    {credentialsError && <ErrorText error="Credenziali non valide"></ErrorText>}
                </form>

                <hr></hr>
                <p></p>
                <div className='mx-auto'>Non hai un account? <a className="link" href='/register'><i>Registrati ora!</i></a></div>
            </div >
    );
};
