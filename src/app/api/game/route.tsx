import { getSessionTeacher, isSessionCodeValid } from "@/actions/game";
import { checkForUnauthorizedTeacher } from "@/app/lib/utils";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session_code = new URL(req.url).searchParams.get("session_code");
    if (session_code && await isSessionCodeValid(session_code)) {
        const session = await auth()
        const sessionTeacher = await getSessionTeacher(session_code)
        // If not logged in or the user is not the teacher then return unauthorized
        console.log(session?.user.id + " " + sessionTeacher)
        if (!session || session.user.id !== String(sessionTeacher)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ data: "Codice sessione trovato. Authorizzato" }, { status: 302 });

    }
    return NextResponse.json({ data: "Codice sessione non trovato" }, { status: 404 });
}
