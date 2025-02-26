import ErrorText from "@/app/components/errorText";
import { session_phases } from "@/app/lib/enums";
import ForwardEmail from "next-auth/providers/forwardemail"
import { redirect } from "next/navigation";
import { useState } from "react";

export function EditSession({ teacherId, sessionId, sessionData }: { teacherId:string, sessionId: string, sessionData: Session }) {
    const [errorData, setErrorData] = useState('')
    return (
        <div>
            <h1>Modifica sessione {sessionData.code } </h1>
            <form className="flex flex-col gap-1 w-1/2 mx-auto" action={async (formData) => {
                const response = await fetch('/api/session', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        teacher_id: teacherId,
                        class_id: sessionData.class_id.toString(),
                        session_code: sessionData.code,
                        session_phase: formData.get('session_phase'),
                        details: formData.get('details'),
                    })
                })
                if (response.status === 400) {
                    const data = await response.json();
                    if (data.data) {
                        if(data.data.name==="ZodError") {
                            setErrorData(data.data.issues[0].message);
                        } else {
                            setErrorData(data.data);
                        }
                    }
                }
                if (response.status === 200) {
                    redirect('/dashboard')
                }
            }}>
                <label>Fase sessione</label>
                <select id="session_phase" name="session_phase" defaultValue={sessionData.phase} required>
                {
                    session_phases.map((phase, i) => {
                        return <option key={i} value={phase}>{phase}</option>
                    })
                }
                </select>
                <label>Dettagli</label>
                <input type="text" name="details" defaultValue={sessionData.details} />

                <ErrorText error={errorData}></ErrorText>
                <div className="flex space-x-4">
                    <button type="submit">Salva</button>
                    <button type="button" onClick={async () =>  {
                        const res = await fetch('/api/session', {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                session_code: sessionData.code
                            })
                        })
                        if (res.status === 200) {
                            redirect('/dashboard')
                        }
                        if(res.status === 400) {
                            const data = await res.json();
                            if (data.data) {
                                setErrorData(data.data);
                            }
                        }
                    }}>Elimina</button>
                </div>
            </form >
        </div >
    )
}