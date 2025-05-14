import { getAllSessions, getAllSessionSequences, updateSessionSequenceId } from '@/actions/sessions';
import { NextResponse } from 'next/server';
import { checkForResearcherAccess } from '@/app/lib/utils';

export async function GET(req: Request) {
    try {
        // Check if user has researcher access
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('uid');
        
        if (!userId) {
            return NextResponse.json({ error: 'Missing user ID parameter' }, { status: 400 });
        }
        
        await checkForResearcherAccess(userId);
        
        // Get all sessions and sequences
        const sessions = await getAllSessions();
        const sequences = await getAllSessionSequences();
        
        return NextResponse.json({ sessions, sequences }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Unauthorized access' }, { status: 403 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { user_id, session_id, sequence_id } = body;
        
        if (!user_id || !session_id || !sequence_id) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // Check if user has researcher access
        await checkForResearcherAccess(user_id);
        
        // Update session sequence ID
        const result = await updateSessionSequenceId(session_id, sequence_id);
        
        if (result) {
            return NextResponse.json({ message: 'Session sequence updated successfully' }, { status: 200 });
        }
        
        return NextResponse.json({ error: 'Failed to update session sequence' }, { status: 500 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Error updating session sequence' }, { status: 400 });
    }
}
