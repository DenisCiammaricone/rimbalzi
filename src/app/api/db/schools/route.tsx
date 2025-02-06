import { getAllSchoolsId } from '@/actions/school';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const a = await getAllSchoolsId();
    return NextResponse.json(JSON.stringify(a), { status: 200 });
}