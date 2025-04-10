export function PupilLogIn({ session_code }: { session_code: string }) {
    return (
        <div className="">
            <h1> Pupil Page</h1>
            <div className="flex items-center justify-center h-screen">
                <form className="bg-white p-6 rounded-lg shadow-md w-96" id="login-register-formBox" action={async (formData) => {
                    const response = await fetch('/api/game/verifyPupil', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            session_code: session_code,
                            pupil_code: formData.get('pupil_code')?.toString().toLowerCase()
                        })
                    })
                    
                    if (response.status === 200) {
                        window.location.reload(); // TODO: Fallo in un modo nextjs con router
                    }
                }}>
                    <h1>Accesso Studente</h1>
                    <input type="text" id="pupil_code" name="pupil_code" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Codice bambino..."></input>
                    <button type="submit" className="w-full mt-4">Accedi</button>
                </form>
            </div>

        </div>
    )
}