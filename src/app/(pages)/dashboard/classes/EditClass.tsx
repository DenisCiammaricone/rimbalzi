import ErrorText from "@/app/components/ErrorText";
import { redirect } from "next/navigation";
import { useState } from "react";

export function EditClass({ classId, classData }: { classId: string, classData: Class }) {
    const [errorData, setErrorData] = useState('')
    return (
        <div>
            <h1>Modifica classe {classData.grade + classData.section} </h1>
            <form className="flex flex-col gap-1 w-1/2 mx-auto" action={async (formData) => {
                const response = await fetch('/api/class', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        class_id: classId,
                        male_number: Number(formData.get('male_number')),
                        female_number: Number(formData.get('female_number')),
                        details: formData.get('details'),
                        teacher_id: classData.teacherId
                    })
                })
                if (response.status === 400) {
                    const data = await response.json();
                    if (data.data) {
                        setErrorData(data.data);
                    }
                }
                if (response.status === 200) {
                    redirect('/dashboard')
                }
            }}>
                <label>Numero maschi</label>
                <input type="number" name="male_number" defaultValue={classData.maleNumber} />

                <label>Numero femmine</label>
                <input type="number" name="female_number" defaultValue={classData.femaleNumber} />
                <label>Dettagli</label>
                <input type="text" name="details" defaultValue={classData.details} />

                <ErrorText error={errorData}></ErrorText>
                <div className="flex space-x-4">
                    <button type="submit">Salva</button>
                    <button type="button" onClick={async () =>  {
                        const res = await fetch('/api/class', {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                class_id: classId,
                                teacher_id: classData.teacherId
                            })
                        })
                        if (res.status === 200) {
                            redirect('/')
                        }
                        if(res.status === 400) {
                            const data = await res.json();
                            // Codici per vincoli di integrità referenziale
                            if(data.data.errno === 1451 || data.data.errno === 1216) {
                                setErrorData("Questa classe non può essere eliminata perchè è associata a delle sessioni. Cancella prima le sessioni associate o contatta un amministratore");
                            } else if(data.data){
                                setErrorData(data.data);
                            }
                        }
                    }}>Elimina</button>
                </div>
            </form >
        </div >
    )
}