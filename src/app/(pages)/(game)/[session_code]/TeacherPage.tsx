import SpinningCircle from "@/app/components/SpinningCircle"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export function TeacherPage({session_code}:{session_code: string}) {
    const [sessionKeys, setSessionKeys] = useState<{ key: string, sex: string }[]>([])
    const [isSessionStarted, setIsSessionStarted] = useState(-1) // -1: default, 0: not started, 1: started, 2 finished
    const [sessionPupilCompletedLevels, setSessionPupilCompletedLevels] = useState<Record<string, {level: number, success: boolean}[]>>({})
    const [pupilCompleteTimes, setPupilCompleteTimes] = useState<Record<string, number>>({})
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

            let statusResponse = await fetch('/api/game/sessionLevelsOutcome?session_code=' + params.session_code, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if(statusResponse.status === 200) {
                const data = await statusResponse.json()
                setSessionPupilCompletedLevels(data.correctLevels)
                console.log(data.correctLevels)
                Object.values(data.correctLevels).forEach((value: any, i) => {
                    if(value.length === 10) {
                        console.log(value, i, "completed")
                        const pupilKey = Object.keys(data.correctLevels)[i]

                        const res = fetch('/api/game/pupilFinishTime?session_code=' + params.session_code + '&pupil_code=' + pupilKey, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        }).then(async (res) => {
                            if(res.status === 200) {
                                
                                const data = await res.json()

                                setPupilCompleteTimes((prev) => {
                                    let newStat = { ...prev, [pupilKey]: data.timeDiff }
                                    return newStat
                            })
                            }
                            
                        })
                    }
                })
                if(data.correctLevels.length === 10) {
                    const res = await fetch('/api/game/sessionFinishTime?session_code=' + params.session_code, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                    if(res.status === 200) {
                        const data = await res.json()
                        console.log(`Tempo totale: ${data.timeDiff}`)
                        setPupilCompleteTimes(data.timeDiff)
                    }
                }
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
        handleSessionStateButton = <div className="negative">Sessione terminata</div>
    } else if(isSessionStarted === 1) {
        handleSessionStateButton = <button className='negative' onClick={async () => {
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
        handleSessionStateButton = <button className='positive' onClick={async () => {
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
        <>
        <div>Codice Sessione: {session_code}</div>
        <div className="flex flex-col items-center justify-center h-screen ">
            <h1 className="font-bold text-4xl mb-10">Dashboard Insegnante</h1>
            <table className="table-auto w-128 mb-5 border-spacing-5 bg-gray-900/75 rounded-lg shadow-lg p-4 text-white p-6">
                <thead>
                    <tr>
                        <th className="w-32">Codice</th>
                        <th className="w-16">Sesso</th>
                        <th>Livelli completati</th>
                        <th className="w-32">Finish Time</th>
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
                                        {Array.from({ length: 10 }, (_, i) => {
                                            const levelAttempt = sessionPupilCompletedLevels[key.key]?.find(entry => entry.level === i);
                                            let colorClass = "text-gray-400"; // Default for not attempted
            
                                            if (levelAttempt) {
                                                colorClass = levelAttempt.success ? "text-green-500" : "text-red-500";
                                            }
                                            return (<span key={`${key.key}_${i + 1}`} id={`${key.key}_${i + 1}`} className={`font-bold text-center ${colorClass}`}>
                                                {i + 1}
                                            </span>)
                                        })}
                                    </div>
                                </td>
                                <td className="text-center">
                                <span
                                        key={`${key.key}_finished`}
                                        id={`${key.key}_finished`}
                                        className="font-bold text-center text-green-500"
                                    >{ (() => {
                                        if(pupilCompleteTimes[key.key]) {
                                            const millis = pupilCompleteTimes[key.key]
                                            const timeInSeconds = Math.floor(millis / 1000);
                                            const minutes = Math.floor(timeInSeconds / 60);
                                            const seconds = timeInSeconds % 60;
                                            return `${minutes}m ${seconds}s`;
                                        }
                                        return <></>
                                    
                                    })()}</span>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            { handleSessionStateButton }
        </div>
        </>
    )
}