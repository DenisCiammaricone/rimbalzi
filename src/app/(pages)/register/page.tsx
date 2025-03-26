'use client'
import ErrorText from "@/app/components/ErrorText";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterPage() {
    const { data: session, status } = useSession();
    const [schools, setSchools] = useState<any[]>([]);
    const [registerError, setRegisterError] = useState("")

    // Fetch Schools to populate the select
    useEffect(() => {
        async function fetchSchools() {
            const response = await fetch('/api/schools', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setSchools(JSON.parse(data));
        }
        fetchSchools();
    }, []);
    
    const schoolOptions = schools.map((school) => (
        <option key={school.id} value={school.id}>{school.name}</option>
    ));
    
    if(status === "unauthenticated") {
        return (
            <div id="login-register-formBox" className='flex flex-col gap-5 2xl:w-1/6 xl:w-1/4 lg:w-1/4 md:w-1/3 sm:w-full mx-auto p-5 mt-20 '>
                <h1 className="mx-auto">Register</h1>

                <form className="flex flex-col gap-2 mx-auto" action={async (formData) => {
                    const response = await fetch('/api/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: formData.get('name'),
                            surname: formData.get('surname'),
                            email: formData.get('email'),
                            password: formData.get('password'),
                            schoolId: formData.get('schoolId')
                        })
                    });
                    const errorData = await response.json();
                    if (response.status === 400) {
                        setRegisterError(errorData.data);
                    } if (response.status === 200) {
                        redirect('/');
                    }
                }}>

                    <div>
                        <input id="name" name="name" type="text" placeholder="Nome" required/>
                    </div>
                    <div>
                        <input id="surname" name="surname" type="text" placeholder="Cognome" required/>
                    </div>
                    <div>
                        <input id="email" name="email" type="email" placeholder="Email" required/>
                    </div>
                    <div>
                        <input id="password" name="password" type="password" placeholder="Password" required/>
                    </div>
                    <div>
                        <select className="mx-auto w-full" id="schoolId" name="schoolId" required>
                            {schoolOptions}
                        </select>
                    </div>
                    <button className="mx-auto" type="submit">Registrati</button>
                </form>
                <div className="mx-auto">
                    <ErrorText error={registerError.toString()}></ErrorText>
                </div>
                <hr></hr>
                <div className='mx-auto'>Hai già un account? <a className="link" href='/login'><i>Accedi!</i></a></div>
            </div>
        )
    } else if( status === 'loading' ) {
        // TODO: Rotellina di caricamentos
        return (
            <div>Loading...</div>
        )
    } else {
        redirect('/dashboard');
    }

};
