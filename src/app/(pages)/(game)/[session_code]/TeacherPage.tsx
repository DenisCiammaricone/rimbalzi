export function TeacherPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1>Teacher Page</h1>
            <table>
                <thead>
                    <tr>
                        <th>Codice</th>
                        <th>Sesso</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>12345</td>
                        <td>Maschio</td>
                    </tr>
                    <tr>
                        <td>67890</td>
                        <td>Femmina</td>
                    </tr>
                </tbody>
            </table>
            <button onClick={() => {

            }}>Avvia Sessione</button>
        </div>
    )
}