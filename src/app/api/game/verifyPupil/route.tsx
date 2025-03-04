import { doesPupilExistsForSession } from "@/actions/game";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers'

export async function POST(req: Request) {
    const body = await req.json();
    const cookieStore = await cookies()
    if (await doesPupilExistsForSession(body.pupil_code, body.session_code)) {
        cookieStore.set({ name: 'pupil_code', value: body.pupil_code, path: '/' });
        return NextResponse.json({ data: "Pupil code found" }, { status: 200 });
    }
    cookieStore.delete('pupil_code');
    return NextResponse.json({ data: "Not Implemented " + body.pupil_code + ' Session code: ' + body.session_code }, { status: 501 });
}
