import { createNewSession } from '@/actions/sessions';
import { newSessionSchema } from '@/app/lib/zod';
import { NextResponse } from 'next/server';

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
}