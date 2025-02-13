import ErrorText from "@/app/components/errorText";
import { session_phases } from "@/app/lib/enums";
import { useState } from "react";

export async function newSession(teacherId: string = "0") {
    //TODO: I just need grade and section, not the entire class
    const response = await fetch('/api/class?uid=' + teacherId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const classesData = await response.json()
    
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
                const data = await response.json();
                if (response.status === 400) {
                    
                }
                
            }}>
                <label htmlFor="class_grade">Classe</label>
                <select id="classGradeSection" name="class_grade_section" required>
                    {classesData.classes.map((classItem: any) => {
                        return <option key={classItem.id} value={classItem.grade + classItem.section}>{classItem.grade} {classItem.section}</option>
                    })}
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
                {
                    /* <ErrorText error={errorMessage}></ErrorText> */
                    //TODO: Add error handling
                } 
                <button type="submit">Crea</button>
            </form>
        </div>
    );

}