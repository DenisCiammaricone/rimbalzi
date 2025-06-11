import ConfirmCancelModal from "@/app/components/ConfirmCancelModal";
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
                    
                    
                    <ConfirmCancelModal openButtonText={"Elimina"} openButtonStyle="negative" title={"Eliminazione Aula"} message={"Sei sicuro di voler cancellare questa aula? L'operazione è irreversibile"} onOk={async () =>  {
                        const res = await fetch('/api/class?class_id=' + classId, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })
                        if(await res.status === 400) {
                            const data = await res.json();
                            setErrorData(data.data);
                        }
                        if (await res.status === 200) {
                            redirect('/dashboard')
                        }
                    }}></ConfirmCancelModal>
                    <button type="submit" className="positive">Salva</button>
                </div>
            </form >
        </div >
    )
}