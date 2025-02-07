import { createNewClass } from '@/actions/classes';
import { newClassSchema, registerSchema } from '@/app/lib/zod';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { class_name, female_number, male_number, details, teacher_id } = await newClassSchema.parseAsync(body);
        
        const result = await createNewClass(class_name, female_number, male_number, details, teacher_id);

        if(result) {
            return NextResponse.json({ message: 'Ok'}, { status: 200 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });

        
    } catch (error: Error | unknown) {
        const e = JSON.parse(JSON.stringify(error));
        return NextResponse.json({ 'error': 'Invalid request', 'message': e}, { status: 400 });
    }
}