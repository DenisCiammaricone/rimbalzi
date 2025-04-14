import { EditClass } from "./EditClass";
import { NewClass } from "./NewClass";
import React from "react";

export async function ClassesPage(uid: string = "0", setContent: React.Dispatch<React.SetStateAction<React.JSX.Element>>) {
    const response = await fetch('/api/class?uid=' + uid, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    const data = await response.json();

    return (
        <div className="flex flex-col gap-5">
            <button className="positive" onClick={() => setContent(<><NewClass teacherId={uid}></NewClass></>)}>Nuova Classe</button>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Classe
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Numero studenti
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dettagli
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Modifica</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.classes.map((classItem: any) => (
                        <tr key={classItem.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {classItem.grade} {classItem.section}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {classItem.maleNumber + classItem.femaleNumber} ({classItem.maleNumber} {classItem.maleNumber > 1 ? "maschi" : "maschio"}, {classItem.femaleNumber} {classItem.femaleNumber > 1 ? "femmine" : "femmina"})
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {classItem.details}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a onClick={() => setContent(<><EditClass classId={classItem.id} classData={classItem}></EditClass></>)} className="text-indigo-600 hover:text-indigo-900">Modifica</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}