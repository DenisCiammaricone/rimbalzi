import ErrorText from "@/app/components/errorText";

// TODO:  transform this into GET request
export function newClass (teacherId: string)  {
    return (
        <div className="w-1/2 mx-auto">
            <form className="flex flex-col gap-2 mx-auto" action={async (formData) => {
                const response = await fetch('/api/class', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        class_name: formData.get('class_name'),
                        female_number: Number(formData.get('female_number')),
                        male_number: Number(formData.get('male_number')),
                        details: formData.get('details'),
                        teacher_id: teacherId
                    }),
                })
                if(response.status === 400) {
                    const errorData = await response.json();
                }
            }}>
                <label htmlFor="class_name">Class Name</label>
                <input type="text" id="class_name" name="class_name" required/>
                <label htmlFor="female_number">N° ragazze</label>
                <input type="number" id="female_number" name="female_number" required/>
                <label htmlFor="male_number">N° ragazzi</label>
                <input type="number" id="male_number" name="male_number" required/>
                <label htmlFor="detail">Dettagli</label>
                <textarea rows={5} id="details" name="details" required/>
                <button type="submit">Crea</button>
            </form>
            
            {/* 
            <div className="mx-auto">
                <ErrorText error={createClassError}></ErrorText>
            </div> */}
        </div>
    );
}
