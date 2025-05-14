import { session_phases, session_phases_labels } from "@/app/lib/enums";
import { EditSession } from "./EditSession";
import { NewSession } from "./NewSession";

export async function SessionsPage(uid: string = "0", setContent: React.Dispatch<React.SetStateAction<React.JSX.Element>>) {
    const response = await fetch('/api/session?uid=' + uid, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    const data = await response.json();

    return (
        <div className="flex flex-col gap-5">
            <button className="positive" onClick={() => setContent(<><NewSession teacherId={uid}></NewSession></>)}>Prenota Sessione</button>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-900">
                            Codice
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-900">
                            Classe
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-900">
                            Dettagli
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-900">
                            Fase
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Modifica</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.sessions.map((sessionItem: Session) => {
                        let stateColor = 'bg-gray-500'

                        if (sessionItem.state === "waiting") {
                            stateColor = 'bg-blue-500'
                        } else if(sessionItem.state === "started") {
                            stateColor = 'bg-green-500'
                        } else if(sessionItem.state === "finished") {
                            stateColor = 'bg-orange-500'
                        }

                        return (
                            <tr key={sessionItem.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-5 h-5 rounded-full ${stateColor}`}></div>
                                        <a href={'/' + sessionItem.code}>{sessionItem.code}</a>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {sessionItem.class_grade} {sessionItem.class_section}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {sessionItem.details}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {sessionItem.phase === session_phases[0] ? (
                                        session_phases_labels[0]
                                    ) : sessionItem.phase === session_phases[1] ? (
                                        session_phases_labels[1]
                                    ) : sessionItem.phase === session_phases[2] ? (
                                        session_phases_labels[2]
                                    ) : sessionItem.phase === session_phases[3] ? (
                                        session_phases_labels[3]
                                    ) : sessionItem.phase === session_phases[4] ? (
                                        session_phases_labels[4]
                                    ) : sessionItem.phase === session_phases[5] ? (
                                        session_phases_labels[5]) : null}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <a href="#" className="text-indigo-600 hover:text-indigo-900" onClick={() => setContent(<><EditSession teacherId={uid} sessionData={sessionItem}></EditSession></>)}>Modifica</a>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className="flex items-center gap-5">Legenda: <div className={`w-5 h-5 rounded-full bg-blue-500`}></div> in Attesa, <div className={`w-5 h-5 rounded-full bg-green-500`}></div> Iniziata, <div className={`w-5 h-5 rounded-full bg-orange-500`}></div> Terminata</div>
        </div>
    );
}