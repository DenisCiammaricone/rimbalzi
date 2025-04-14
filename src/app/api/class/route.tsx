import { createNewClass, deleteClass, getClassesByTeacherId, updateClass } from '@/actions/classes';
import { checkForUnauthorizedTeacher } from '@/app/lib/utils';
import { newClassSchema, updateClassSchema } from '@/app/lib/zod';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { class_grade, class_section, female_number, male_number, details, teacher_id } = await newClassSchema.parseAsync(body);
        checkForUnauthorizedTeacher(teacher_id);
        const result = await createNewClass(class_grade, class_section, female_number, male_number, details, teacher_id);

        if (result) {
            return NextResponse.json({ message: 'Ok' }, { status: 200 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });


    } catch (error: Error | unknown) {
        const e = JSON.parse(JSON.stringify(error));
        if (error instanceof ZodError) {
            return NextResponse.json({ 'error': 'Invalid request', 'message': e.issues[0].message }, { status: 400 });
        }
        return NextResponse.json({ 'error': 'Invalid request', 'message': (error as Error).message }, { status: 400 });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get('uid');

    checkForUnauthorizedTeacher(teacherId);

    if (!teacherId) {
        return NextResponse.json({ error: 'Missing teacher_id parameter' }, { status: 400 });
    }

    const classes = await getClassesByTeacherId(teacherId);
    return NextResponse.json({ classes: classes }, { status: 200 });
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        checkForUnauthorizedTeacher(body.teacher_id);
        const { female_number, male_number, details } = await updateClassSchema.parseAsync(body);

        await updateClass(body.class_id, male_number, female_number, details)
        return NextResponse.json({ message: 'Ok' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error }, { status: 400 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        checkForUnauthorizedTeacher(body.teacher_id);
        const res = await deleteClass(body.class_id);
        if(res) {
            return NextResponse.json({ data: 'Ok' }, { status: 200 });
        } 
        return NextResponse.json({ data: 'Internal server error' }, { status: 500 });
    } catch (error: any) {
        if(error instanceof Error) {
            return NextResponse.json({ data: error.message }, { status: 400 });
        }
    }
}
