'use client'
import { TeacherPage } from "./TeacherPage";
import { PupilPage } from "./PupilPage";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const params = useParams()
    const [authorized, setAuthorized] = useState(false)


    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/game?session_code=' + params.session_code, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (response) {
                const data = await response.json();
                // Se non sei autorizzato viene mostrata la pagina per gli studenti
                switch (response.status) {
                    case 302:
                        setAuthorized(true)
                        break;
                    case 404:
                        redirect('/')
                        break;
                }
            }
        }
        fetchData();
    }, [])

    return <><h1>My Page {params.session_code}</h1> {authorized ? <TeacherPage></TeacherPage> : <PupilPage session_code={String(params.session_code)}></PupilPage>}</>
}