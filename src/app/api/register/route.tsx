import { registerUser } from '@/actions/user';
import { registerSchema } from '@/app/lib/zod';
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

        
    } catch (error: Error | unknown) {
        const e = JSON.parse(JSON.stringify(error));
        return NextResponse.json({ 'error': 'Invalid request: ', 'message': e}, { status: 400 });
    }
}