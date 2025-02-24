import { createNewClass, getClassesByTeacherId } from '@/actions/classes';
import { newClassSchema } from '@/app/lib/zod';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { class_grade, class_section, female_number, male_number, details, teacher_id } = await newClassSchema.parseAsync(body);
        
        const result = await createNewClass(class_grade, class_section, female_number, male_number, details, teacher_id);

        if(result) {
            return NextResponse.json({ message: 'Ok'}, { status: 200 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });

        
    } catch (error: Error | unknown) {
        const e = JSON.parse(JSON.stringify(error));
        if(error instanceof ZodError) {
            return NextResponse.json({ 'error': 'Invalid request', 'message': e.issues[0].message}, { status: 400 });
        }
        return NextResponse.json({ 'error': 'Invalid request', 'message': (error as Error).message}, { status: 400 });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get('uid');

    if (!teacherId) {
        return NextResponse.json({ error: 'Missing teacher_id parameter' }, { status: 400 });
    }

    const classes = await getClassesByTeacherId(teacherId);
    return NextResponse.json({ classes: classes}, { status: 200 });
}