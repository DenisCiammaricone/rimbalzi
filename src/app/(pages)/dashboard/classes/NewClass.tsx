import ErrorText from "@/components/ErrorText";
import { useState } from "react";
import { redirect } from "next/navigation";

export function NewClass ({teacherId}: {teacherId: string})  {
    const [errorData, setErrorData] = useState('')
    
    return (
        <div className="w-1/2 mx-auto">
            <form className="flex flex-col gap-2 mx-auto" action={async (formData) => {
                const response = await fetch('/api/class', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        class_grade: formData.get('class_grade'),
                        class_section: formData.get('class_section'),
                        female_number: Number(formData.get('female_number')),
                        male_number: Number(formData.get('male_number')),
                        details: formData.get('details'),
                        teacher_id: teacherId
                    }),
                })
                if(response.status === 400) {
                    const data = await response.json();
                    if(data.message) {
                        setErrorData(data.message);
                    }
                } 
                if(response.status === 200) {
                    redirect('/dashboard')
                }
            }}>
                <label htmlFor="class_grade">Anno</label>
                <select id="class_grade" name="class_grade" required>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <label htmlFor="class_section">Sezione</label>
                <select id="class_section" name="class_section" required>
                    {Array.from({ length: 26 }, (_, i) => (
                        <option key={i} value={String.fromCharCode(65 + i)}>
                            {String.fromCharCode(65 + i)}
                        </option>
                    ))}
                </select>
                <label htmlFor="female_number">N° ragazze</label>
                <input type="number" id="female_number" name="female_number" required/>
                <label htmlFor="male_number">N° ragazzi</label>
                <input type="number" id="male_number" name="male_number" required/>
                <label htmlFor="detail">Dettagli</label>
                <textarea rows={5} id="details" name="details"/>
                <div className="mx-auto">
                    {errorData && <ErrorText error={errorData}></ErrorText> }
                </div>  
                <button type="submit" className="positive">Crea</button>
            </form>
            
            
        </div>
    );
}
