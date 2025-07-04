'use client'
import { useSession } from 'next-auth/react';
import { redirect, useSearchParams } from 'next/navigation'
import React from 'react';
import { useState } from 'react';
import { SessionsPage } from './sessions/SessionsPage';
import FadingMessage from '@/components/FadingMessage';
import { ClassesPage } from './classes/ClassesPage';
import SpinningCircle from '@/components/SpinningCircle';
import { InfoPage } from './profilo/InfoPage';

function SideBarButton({text, onClick}:{text:string, onClick?:()=>void}) {
    return (<div><a onClick={onClick}> {text} </a></div>)
}

// TODO: Trovare un modo più elegante per gestire il content
export default function dashboard() {
    //const searchParams = useSearchParams();
    const { data: session, status } = useSession();
    const [content, setContent] = useState(<></>);
    const [firstLoad, setFirstLoad] = useState(true);
    const [isResearcher, setIsResearcher] = useState(false);

    // Check if user is a researcher
    React.useEffect(() => {
        if (session?.user?.group?.toLowerCase() === "researcher") {
            setIsResearcher(true);
        }
    }, [session]);

    // Per messaggi di errore e successo
    //const type = searchParams.get("type");
    //const message = searchParams.get("message");
    
    if(status === "loading") {
        return <SpinningCircle/>
    } else if (status === "authenticated") {
        const handleHomeClick = async () => {
            redirect("/");
        };
        const handleProfiloClick = async () => {
            setContent(await InfoPage(session.user.id, setContent, session));
        };
        const handleClassiClick = async () => {
            setContent(await ClassesPage(session.user.id, setContent));
        };

        const handleSessioniClick = async () => {    
            setContent(await SessionsPage(session.user.id, setContent));
        };

        const handleLogoutClick = async () => {    
            redirect("/logout");
        };

        const setFirstContent = async () => {
            setContent(await InfoPage(session.user.id, setContent, session))
            setFirstLoad(false);
        };
        if (firstLoad) {
            setFirstContent()
        }

        return (
            <div>
                <FadingMessage/>
                <div id="dashboard">
                    <div className='flex'>
                        <div className='flex flex-col w-1/4' id="sideBar">
                            <SideBarButton text="Home" onClick={handleHomeClick}></SideBarButton>
                            <SideBarButton text="Profilo" onClick={handleProfiloClick}></SideBarButton>
                            <SideBarButton text="Classi" onClick={handleClassiClick}></SideBarButton>
                            <SideBarButton text="Sessioni" onClick={handleSessioniClick}></SideBarButton>
                            {isResearcher && (
                                <SideBarButton text="Gestione Sessioni" onClick={() => { window.location.href = '/sessions'; }}></SideBarButton>
                            )}
                            <SideBarButton text="Logout" onClick={handleLogoutClick}></SideBarButton>
                        </div>
                        <div className='' id="contentView">{content}</div>
                    </div>
                </div>
            </div>
        )
    } else if (status === "unauthenticated") {
        redirect("/login");
    }
}
