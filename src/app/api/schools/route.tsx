import { getAllSchoolsId, getSchoolsLike } from '@/actions/school';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const a = await getSchoolsLike(searchParams.get('q') || '');
        return NextResponse.json(JSON.stringify(a), { status: 200 });
    } catch (error: Error | unknown) {
        return NextResponse.json({ 'error': 'Invalid request', 'data': error}, { status: 400 });
    }
}