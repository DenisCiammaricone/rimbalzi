import { getCorrectLevelsForSession, getSessionTeacher, isSessionCodeValid } from "@/actions/game";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session_code = new URL(req.url).searchParams.get("session_code");
    if (session_code && await isSessionCodeValid(session_code)) {
        const session = await auth()
        const sessionTeacher = await getSessionTeacher(session_code)
        // If not logged in or the user is not the teacher then return unauthorized
        if (!session || session.user.id !== String(sessionTeacher)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        try {
            return NextResponse.json({ data: "Codice sessione trovato. Authorizzato", correctLevels: await getCorrectLevelsForSession(session_code) }, { status: 200 });
        } catch (error) {
            console.error("Error fetching session data:", error);
        }
    }
    return NextResponse.json({ data: "Codice sessione non trovato" }, { status: 404 });
}
