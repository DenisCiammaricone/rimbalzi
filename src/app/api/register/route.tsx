import { registerUser } from '@/actions/users';
import { registerSchema } from '@/lib/zod';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { name, surname, email, password, schoolId } = await registerSchema.parseAsync(body);
        
        const result = await registerUser(email, password, name, surname, schoolId);

        if(result) {
            return NextResponse.json({ message: 'Ok'}, { status: 200 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });

        
    } catch (error) {
        const e = JSON.parse(JSON.stringify(error));
        if(e.name === 'ZodError') {
            return NextResponse.json({ 'error': 'Invalid request', 'data': e.issues[0].message }, { status: 400 });
        }
        return NextResponse.json({ 'error': 'Invalid request', 'data': (error as Error).message}, { status: 400 });
    }
}