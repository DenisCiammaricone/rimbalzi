'use client'
import { useSession } from 'next-auth/react';
import { redirect, useSearchParams } from 'next/navigation'
import React from 'react';
import { useState } from 'react';
import { SessionsPage } from './sessions/SessionsPage';
import FadingMessage from '@/app/components/FadingMessage';
import { ClassesPage } from './classes/ClassesPage';

// TODO: Trovare un modo più elegante per gestire il content
export default function dashboard() {
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();
    const [content, setContent] = useState(<></>);

    // Per messaggi di errore e successo
    const type = searchParams.get("type");
    const message = searchParams.get("message");
 
    
    if(status === "loading") {
        return (
            <div className='flex min-h-screen justify-center items-center text-3xl font-bold'>
                <svg viewBox="25 25 50 50">
                    <circle r="20" cy="50" cx="50"></circle>
                </svg>
            </div> 
        );
    } else if (status === "authenticated") {
        const handleClassiClick = async () => {
            setContent(await ClassesPage(session.user.id, setContent));
        };

        const handleSessioniClick = async () => {    
            setContent(await SessionsPage(session.user.id, setContent));
        };

        const handleLogoutClick = async () => {    
            redirect("/logout");
        };

        return (
            <>
            {type && message ? <FadingMessage type={type || ""} message={message || ""}></FadingMessage> : <></>}
            <div className='flex flex-col mx-auto w-3/4'>
                <div className='flex'>
                    <div className='flex flex-col w-1/4' id="sideBar">
                        <div><a onClick={handleClassiClick}> Classi </a></div>
                        <div><a onClick={handleSessioniClick}> Sessioni </a></div>
                        <div><a onClick={handleLogoutClick}> Logout </a></div>
                    </div>
                    <div className=' w-3/4' id="contentView">{content}</div>
                </div>
            </div>
            </>
        )
    } else if (status === "unauthenticated") {
        redirect("/login");
    }
    
}
