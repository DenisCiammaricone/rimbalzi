import ConfirmCancelModal from "@/app/components/ConfirmCancelModal";
import ErrorText from "@/app/components/ErrorText";
import { session_phases, session_phases_labels } from "@/app/lib/enums";
import { redirect } from "next/navigation";
import { useState } from "react";

export function EditSession({ teacherId, sessionData }: { teacherId:string, sessionData: Session }) {
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
                        old_session_phase : sessionData.phase
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
                        return <option key={i} value={phase}>{session_phases_labels[i]}</option>
                    })
                }
                </select>
                <label>Dettagli</label>
                <input type="text" name="details" defaultValue={sessionData.details} />

                <ErrorText error={errorData}></ErrorText>
                <div className="flex space-x-4">
                    
                    <ConfirmCancelModal openButtonText={"Elimina"} openButtonStyle="negative" title={"Elimina Sessione"} message={"Sei sicuro di voler eliminare la sessione? L'operazione è irreversibile"} onOk={async () =>  {
                        const res = await fetch('/api/session', {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                session_code: sessionData.code,
                                teacher_id: teacherId,
                            })
                        })
                        if(res.status === 400) {
                            const data = await res.json();
                            if (data.data) {
                                setErrorData(data.data);
                            }
                        }
                        if (res.status === 200) {
                            redirect('/dashboard?success=a')
                        }
                    }}></ConfirmCancelModal>
                    <button type="submit" className="positive">Salva</button>
                </div>
            </form >
        </div >
    )
}