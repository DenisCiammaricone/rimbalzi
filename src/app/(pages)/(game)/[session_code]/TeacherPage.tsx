import SpinningCircle from "@/app/components/SpinningCircle"
import { read } from "fs"
import { redirect, useParams } from "next/navigation"
import { useEffect, useState } from "react"

export function TeacherPage({session_code}:{session_code: string}) {
    const [sessionKeys, setSessionKeys] = useState<{ key: string, sex: string }[]>([])
    const [isSessionStarted, setIsSessionStarted] = useState(-1) // -1: default, 0: not started, 1: started, 2 finished
    const [sessionPupilCompletedLevels, setSessionPupilCompletedLevels] = useState<Record<string, number[]>>({})
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

            let statusResponse = await fetch('/api/game/sessionCorrectLevels?session_code=' + params.session_code, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if(statusResponse.status === 200) {
                const data = await statusResponse.json()
                setSessionPupilCompletedLevels(data.correctLevels)
                console.log("Pupils completed levels: ", data.correctLevels['5TbKmLk9'])   
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
        handleSessionStateButton = <div className="text-red-500 font-bold">Sessione terminata</div>
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
        <div className="flex flex-col items-center justify-center h-screen ">
            <h1 className="font-bold text-4xl mb-10">Dashboard Insegnante</h1>
            <table className="table-auto w-96 mb-5 border-spacing-5 bg-gray-900/75 rounded-lg shadow-lg p-4 text-white p-6">
                <thead>
                    <tr>
                        <th className="w-32">Codice</th>
                        <th className="w-16">Sesso</th>
                        <th>Livelli completati</th>
                    </tr>
                </thead>
                <tbody>
                    { 
                        sessionKeys.map((key, index) => (
                            <tr key={index}>
                                <td className="text-center">{key.key}</td>
                                <td className="text-center">{key.sex}</td>
                                <td>
                                    <div className="flex gap-2">
                                        {Array.from({ length: 10 }, (_, i) => (
                                            <span key={`${key.key}_${i + 1}`} id={`${key.key}_${i + 1}`} className={`text-green-400 font-bold text-center ${sessionPupilCompletedLevels[key.key]?.includes(i) ? "text-green-500" : "text-gray-400"}`}>
                                                {i + 1}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            { handleSessionStateButton }
        </div>
    )
}