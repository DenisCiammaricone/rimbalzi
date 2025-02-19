import { createNewSession } from '@/actions/sessions';
import { newSessionSchema } from '@/app/lib/zod';
import { NextResponse } from 'next/server';
import { getSessionsByTeacherId } from '@/actions/sessions';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { class_grade, class_section, session_phase  } = await newSessionSchema.parseAsync(body);
        
        try {
            const result = await createNewSession(class_grade, class_section, session_phase, body.teacher_id, body.details)
            if(result) {
                return NextResponse.json({ message: 'Ok'}, { status: 200 });
            }
        }
        catch (error: Error | unknown) {
            return NextResponse.json({ 'error': 'Invalid request', 'message': error}, { status: 400 });
        }

        
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });

        
    } catch (error: Error | unknown) {
        const e = JSON.parse(JSON.stringify(error));
        return NextResponse.json({ 'error': 'Invalid request', 'message': e}, { status: 400 });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get('uid');

    if (!teacherId) {
        return NextResponse.json({ error: 'Missing teacher_id parameter' }, { status: 400 });
    }

    const classes = await getSessionsByTeacherId(teacherId);
    return NextResponse.json({ classes: classes}, { status: 200 });
}