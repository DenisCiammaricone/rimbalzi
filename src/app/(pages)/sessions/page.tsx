'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import SpinningCircle from '@/components/SpinningCircle';

interface Session {
    id: number;
    state: string;
    code: string;
    phase: string;
    details: string;
    class_grade: number;
    class_section: string;
    class_id: number;
    sequence_id: number;
}

interface Sequence {
    id: number;
    expectedClassGrade: number;
    sequences: string;
    details: string;
}

export default function SessionsPage() {
    const { data: session, status } = useSession();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [sequences, setSequences] = useState<Sequence[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (session?.user?.id) {
            fetchSessions();
        }
    }, [session]);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/sessions?uid=${session?.user?.id}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch sessions');
            }

            const data = await response.json();
            setSessions(data.sessions);
            setSequences(data.sequences);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'An error occurred while fetching sessions');
        } finally {
            setLoading(false);
        }
    };

    const updateSequence = async (sessionId: number, sequenceId: number) => {
        try {
            setLoading(true);
            const response = await fetch('/api/sessions', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: session?.user?.id,
                    session_id: sessionId.toString(),
                    sequence_id: sequenceId.toString(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update session sequence');
            }

            setSuccessMessage('Session sequence updated successfully');
            // Refresh sessions after update
            await fetchSessions();

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'An error occurred while updating sequence');
            // Clear error message after 3 seconds
            setTimeout(() => {
                setError(null);
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to get state color
    const getStateColor = (state: string) => {
        switch (state) {
            case 'waiting':
                return 'bg-blue-500';
            case 'started':
                return 'bg-green-500';
            case 'finished':
                return 'bg-orange-500';
            default:
                return 'bg-gray-500';
        }
    };

    if (!session) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Sessions Management</h1>
                <p>Please sign in to access this page.</p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Sessions Management</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
                    <strong className="font-bold">Success:</strong>
                    <span className="block sm:inline"> {successMessage}</span>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Code
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Classe
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fase
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sequence ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cambia Sequenza
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sessions.length > 0 ? (
                                sessions.map((session) => (
                                    <tr key={session.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`w-4 h-4 rounded-full ${getStateColor(session.state)}`}></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link href={`/${session.code}`} className="text-blue-500 hover:text-blue-700">
                                                {session.code}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {session.class_grade} {session.class_section}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {session.phase}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {session.sequence_id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {session.state === 'waiting' && (
                                            <select
                                                className="border border-gray-300 rounded px-3 py-1"
                                                value={session.sequence_id}
                                                onChange={(e) => updateSequence(session.id, parseInt(e.target.value))}
                                            >
                                                {sequences.map((seq) => (
                                                    <option 
                                                        key={seq.id} 
                                                        value={seq.id}
                                                        title={seq.details || "No details available"}
                                                    >
                                                        {seq.id} - Sez. {seq.expectedClassGrade} {seq.details ? 
                                                            `(${seq.details.length > 30 ? seq.details.substring(0, 30) + '...' : seq.details})` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center">
                                        No sessions found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">Session Sequences</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Expected Class Grade
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Details
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {sequences.length > 0 ? (
                            sequences.map((sequence) => (
                                <tr key={sequence.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {sequence.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {sequence.expectedClassGrade}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {sequence.details || 'No details'}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center">
                                    No sequences found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
