import { NewClass } from "./new_class";
import React from "react";

export async function classesPage (uid: string = "0",  setContent: any) {
    const response = await fetch('/api/class?uid=' + uid, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    const data = await response.json();

    return (
        <div>
            <button onClick={() => setContent(<><NewClass teacherId={uid}></NewClass></>)}>Registra Aula</button> 
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {classItem.grade} {classItem.section}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {classItem.maleNumber + classItem.femaleNumber} ({classItem.maleNumber} {classItem.maleNumber > 1 ? "maschi" : "maschio"}, {classItem.femaleNumber} {classItem.femaleNumber > 1 ? "femmine" : "femmina"})
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {classItem.details}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a href="#" className="text-indigo-600 hover:text-indigo-900">Edit</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}