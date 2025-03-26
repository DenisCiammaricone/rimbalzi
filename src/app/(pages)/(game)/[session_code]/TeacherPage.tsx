import { redirect, useParams } from "next/navigation"
import { useEffect, useState } from "react"

export function TeacherPage({session_code}:{session_code: string}) {
    const [sessionKeys, setSessionKeys] = useState<{ key: string, sex: string }[]>([])
    const [isSessionStarted, setIsSessionStarted] = useState(false)
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

            response = await fetch('/api/session/started?session_code=' + params.session_code, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.status === 200) {
                setIsSessionStarted(true);
            }

            response = await fetch('/api/session/ended?session_code=' + params.session_code, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.status === 200) {
                alert('Sessione terminata')
                redirect('/')
            }
        }
        fetchData();
    }, [])  

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1>Teacher Page</h1>
            <table>
                <thead>
                    <tr>
                        <th>data</th>
                        <th>Sesso</th>
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
            { (!isSessionStarted) ?
            <button onClick={async () => {
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
                    redirect('/' + session_code)
                }
            }}>Avvia Sessione</button> :
            <button onClick={async () => {
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
                    redirect('/' + session_code)
                }
            }}>Termina Sessione</button>
         }
        </div>
    )
}