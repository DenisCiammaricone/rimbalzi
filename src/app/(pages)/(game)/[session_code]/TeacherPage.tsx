import SpinningCircle from "@/app/components/SpinningCircle"
import { read } from "fs"
import { redirect, useParams } from "next/navigation"
import { useEffect, useState } from "react"

export function TeacherPage({session_code}:{session_code: string}) {
    const [sessionKeys, setSessionKeys] = useState<{ key: string, sex: string }[]>([])
    const [isSessionStarted, setIsSessionStarted] = useState(-1) // -1: default, 0: not started, 1: started, 2 finished
    const params = useParams()

    useEffect(() => {
        const fetchData = async () => {
            let response = await fetch('/api/session/keys?session_code=' + params.session_code, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if(response.status === 200) {
                const data = await response.json()
                setSessionKeys(data.keys)
            } 

            response = await fetch('/api/session/status?session_code=' + params.session_code, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.status === 200) {
                const data = await response.json()
                switch(data.session_status) {
                    case "waiting":
                        setIsSessionStarted(0);
                        break;
                    case "started":
                        setIsSessionStarted(1);
                        break;
                    case "finished":
                        setIsSessionStarted(2);
                        break;
                }
            }
        }
        fetchData();
    }, [])  


    let handleSessionStateButton = null
    if(isSessionStarted === 2) {
        handleSessionStateButton = <div>Sessione terminata</div>
    } else if(isSessionStarted === 1) {
        handleSessionStateButton = <button onClick={async () => {
            const res = await fetch('/api/session/end', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_code: session_code
                }),
            })
            if(res.status === 200) {
                setIsSessionStarted(2)
                alert("Sessione terminata")
            }
        }}>Termina Sessione</button>
    } else if(isSessionStarted === 0) {
        handleSessionStateButton = <button onClick={async () => {
            const res = await fetch('/api/session/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_code: session_code
                }),
            })
            if(res.status === 200) {
                setIsSessionStarted(1)
                alert("Sessione avviata")
            }
        }}>Avvia Sessione</button>
    }

    if(handleSessionStateButton === null || sessionKeys.length === 0 && isSessionStarted === -1) {
        return <SpinningCircle />
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1>Teacher Page</h1>
            <table>
                <thead>
                    <tr>
                        <th>Codice</th>
                        <th>Sesso</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    { 
                        sessionKeys.map((key, index) => (
                            <tr key={index}>
                                <td>{key.key}</td>
                                <td>{key.sex}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            { handleSessionStateButton }
        </div>
    )
}