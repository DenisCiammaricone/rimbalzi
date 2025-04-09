'use client'
import { TeacherPage } from "./TeacherPage";
import { PupilPage } from "./PupilPage";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SpinningCircle from "@/app/components/SpinningCircle";

export default function Page() {
    const params = useParams()
    const [authorized, setAuthorized] = useState(0) // 0: default, 1: teacher, 2: pupil

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
                        setAuthorized(1)
                        break;
                    case 401:
                        setAuthorized(2)
                        break;
                    case 404:
                        redirect('/')
                        break;
                }
            }
        }
        fetchData();
    }, [])

    const sessionCode = Array.isArray(params.session_code) ? params.session_code[0] : params.session_code || '';
    let page = null;
    if(authorized === 0) {
        page = <SpinningCircle></SpinningCircle>
    } else if(authorized === 1) {
        page = <div className="bg-gray-900/75"><TeacherPage session_code={sessionCode}></TeacherPage></div>
    }
    else if(authorized === 2) {
        page = <PupilPage session_code={sessionCode}></PupilPage>
    }
    return <div>{page}</div>
}