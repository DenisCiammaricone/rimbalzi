import ErrorText from "@/app/components/ErrorText";
import { session_phases } from "@/app/lib/enums";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import { useState } from "react";

export function NewSession({teacherId}: {teacherId: string}) {
    const [errorData, setErrorData] = useState('')
    const [classesData, setClassesData] = useState<{ classes: Class[] } | null>(null)

    // //TODO: I just need grade and section, not the entire class
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/class?uid=' + teacherId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if(response){
                setClassesData(await response.json())
            }
        }
        fetchData();
    }, [])
    return (
        <div className="w-1/2 mx-auto">
            <form className="flex flex-col gap-2 mx-auto" action={async (formData) => {
                const response = await fetch('/api/session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        class_grade: formData.get('class_grade_section')?.slice(0, 1),
                        class_section: formData.get('class_grade_section')?.slice(1),
                        session_phase: formData.get('session_phase'),
                        details: formData.get('details'),
                        teacher_id: teacherId
                    }),
                })
                if(response.status === 400) {
                    const data = await response.json();
                    console.log(data)
                    if(data.data.name === "ZodError") {
                        setErrorData(data.data.issues[0].message);
                    } else if(data.data) {
                        setErrorData(data.data);
                    }
                }
                if(response.status === 200) {
                        redirect('/dashboard?type=success&message=Sessione creata con successo')
                }
                
                
            }}>
                <label htmlFor="class_grade">Classe</label>
                <select id="classGradeSection" name="class_grade_section" required>
                    {classesData ? (classesData.classes.map((classItem: any) => {
                        return <option key={classItem.id} value={classItem.grade + classItem.section}>{classItem.grade} {classItem.section}</option>
                    })) : null}
                </select>
                <label htmlFor="session_phase">Fase Sessione </label>
                {
                // TODO: Verificare in che fase l'aula selezionata si trova
                }
                <select id="session_phase" name="session_phase" required>
                    {session_phases.map((phase, i) => {return <option key={i} value={phase}>{phase}</option>})}
                </select>
                <label htmlFor="detail">Dettagli sessione</label>
                <textarea rows={5} id="details" name="details" />
                <ErrorText error={errorData}></ErrorText>
                   
                <button type="submit">Crea</button>
            </form>
        </div>
    );

}