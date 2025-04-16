import { createNewSession, createSessionKeys, deleteSession, updateSession } from '@/actions/sessions';
import { newSessionSchema, updateSessionSchema } from '@/app/lib/zod';
import { NextResponse } from 'next/server';
import { getSessionsByTeacherId } from '@/actions/sessions';
import { getClassesByGradeSectionAndSchool } from '@/actions/classes';
import { getTeacherSchoolId } from '@/actions/users';
import { checkForUnauthorizedTeacher } from '@/app/lib/utils';

//TODO: Fix all the nested try catch blocks
export async function POST(req: Request) {
    try {
        const body = await req.json();
        checkForUnauthorizedTeacher(body.teacher_id);
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
    checkForUnauthorizedTeacher(teacherId);
    if (!teacherId) {
        return NextResponse.json({ error: 'Missing teacher_id parameter' }, { status: 400 });
    }

    const sessions = await getSessionsByTeacherId(teacherId);
    return NextResponse.json({ sessions: sessions}, { status: 200 });
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { teacher_id, class_id, session_code, session_phase, details } = await updateSessionSchema.parseAsync(body);
        checkForUnauthorizedTeacher(teacher_id);
        let result = await updateSession(teacher_id, class_id, session_code, session_phase, details, body.old_session_phase);
        if(result) {
            return NextResponse.json({ message: 'Ok'}, { status: 200 });
        }

    } catch (error: Error | unknown) {
        const e = JSON.parse(JSON.stringify(error));
        if(error instanceof Error) {
            return NextResponse.json({ 'error': 'Invalid request', 'data': error.message}, { status: 400 });
        }
        return NextResponse.json({ 'error': 'Invalid request', 'data': e}, { status: 400 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        checkForUnauthorizedTeacher(body.teacher_id);
        const res = await deleteSession(body.session_code);
        if(res) {
            return NextResponse.json({ data: 'Ok' }, { status: 200 });
        } 
        return NextResponse.json({ data: 'Internal server error' }, { status: 500 });
    } catch (error: Error | unknown) {
        if(error instanceof Error) {
            return NextResponse.json({ data: error.message }, { status: 400 });
        }
    }
}