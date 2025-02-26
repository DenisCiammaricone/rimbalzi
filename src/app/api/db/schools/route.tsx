import { getAllSchoolsId } from '@/actions/school';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const a = await getAllSchoolsId();
        return NextResponse.json(JSON.stringify(a), { status: 200 });
    } catch (error: Error | unknown) {
        return NextResponse.json({ 'error': 'Invalid request', 'data': error}, { status: 400 });
    }
}