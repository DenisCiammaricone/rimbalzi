import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export function TeacherPage({session_code}:{session_code: string}) {
    const [sessionKeys, setSessionKeys] = useState<{ key: string, sex: string }[]>([])
    const params = useParams()
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/session/keys?session_code=' + params.session_code, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if(response.status === 200) {
                const data = await response.json()
                console.log(data)
                setSessionKeys(data.keys)
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
            <button onClick={async () => {
                const res = await fetch('/api/session/start', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        session_code: session_code
                    }),
            })}}>Avvia Sessione</button>
        </div>
    )
}