import { newSession } from "./new_session";

export async function sessionsPage(uid: string = "0", setContent: any) {
    const response = await fetch('/api/session?uid=' + uid, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    const data = await response.json();

    return (
        <div>
            <button onClick={() => setContent(newSession(uid))}>Prenota Sessione</button>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Codice
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Classe
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dettagli
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fase
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Modifica</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.classes.map((sessionItem: any) => (
                        <tr key={sessionItem.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {sessionItem.code}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {sessionItem.class_grade} {sessionItem.class_section}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {sessionItem.details}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {sessionItem.phase}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a href="#" className="text-indigo-600 hover:text-indigo-900">Edit</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}