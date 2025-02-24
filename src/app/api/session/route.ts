import { createNewSession, createSessionKeys } from '@/actions/sessions';
import { newSessionSchema } from '@/app/lib/zod';
import { NextResponse } from 'next/server';
import { getSessionsByTeacherId } from '@/actions/sessions';
import { getClassesByGradeSectionAndSchool } from '@/actions/classes';
import { getTeacherSchoolId } from '@/actions/user';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { class_grade, class_section, session_phase  } = await newSessionSchema.parseAsync(body);
        try {
            let result = await createNewSession(class_grade, class_section, session_phase, body.teacher_id, body.details)
            
            try {
                
                const schoolId = await getTeacherSchoolId(body.teacher_id);
                if(!schoolId) {
                    throw "School ID is undefined";
                } 
                const classId = await getClassesByGradeSectionAndSchool(class_grade, class_section, schoolId.toString());
        
                const sessionKeysResult = await createSessionKeys(result.toString(), classId);
                 if(sessionKeysResult) {
                     return NextResponse.json({ message: 'Ok'}, { status: 200 });
                 }
            }
            catch (error: Error | unknown) {
                return NextResponse.json({ 'error': 'Cannot generate session keys', 'data': error}, { status: 500 });
            }

        }
        catch (error: Error | unknown) {
            return NextResponse.json({ 'error': 'Invalid request', 'data': error}, { status: 400 });
        }

        
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });

        
    } catch (error: Error | unknown) {
        const e = JSON.parse(JSON.stringify(error));
        return NextResponse.json({ 'error': 'Invalid request', 'data': e}, { status: 400 });
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