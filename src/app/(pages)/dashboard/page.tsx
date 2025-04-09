'use client'
import { useSession } from 'next-auth/react';
import { redirect, useSearchParams } from 'next/navigation'
import React from 'react';
import { useState } from 'react';
import { SessionsPage } from './sessions/SessionsPage';
import FadingMessage from '@/app/components/FadingMessage';
import { ClassesPage } from './classes/ClassesPage';
import SpinningCircle from '@/app/components/SpinningCircle';

function SideBarButton({text, onClick}:{text:string, onClick?:()=>void}) {
    return (<div><a onClick={onClick}> {text} </a></div>)
}

// TODO: Trovare un modo più elegante per gestire il content
export default function dashboard() {
    //const searchParams = useSearchParams();
    const { data: session, status } = useSession();
    const [content, setContent] = useState(<></>);

    // Per messaggi di errore e successo
    //const type = searchParams.get("type");
    //const message = searchParams.get("message");
 
    
    if(status === "loading") {
        return <SpinningCircle/>
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
            <FadingMessage/>
            <div className='flex flex-col mx-auto w-3/4 dashboard'>
                <div className='flex'>
                    <div className='flex flex-col w-1/4' id="sideBar">
                        <SideBarButton text="Classi" onClick={handleClassiClick}></SideBarButton>
                        <SideBarButton text="Sessioni" onClick={handleSessioniClick}></SideBarButton>
                        <SideBarButton text="Logout" onClick={handleLogoutClick}></SideBarButton>
                    </div>
                    <div className='w-3/4' id="contentView">{content}</div>
                </div>
            </div>
            </>
        )
    } else if (status === "unauthenticated") {
        redirect("/login");
    }
}
