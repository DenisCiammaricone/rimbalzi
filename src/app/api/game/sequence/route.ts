import { getSequence } from "@/actions/game";
import { getSessionStatus, isSessionStarted } from "@/actions/sessions";
import { session_states } from "@/app/lib/enums";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// 
export async function GET(req: Request) {
    const session_code = new URL(req.url).searchParams.get("session_code");
    if (session_code) {
        const cookieStore = await cookies();
        const pupilCode = cookieStore.get('pupil_code');
        // TODO: se pupilCode || se utente loggato è admin della sessione
        if (pupilCode) {
            try {
                const sessionStatus = await getSessionStatus(session_code);
                if(sessionStatus === 'started') {
                    const sequence = await getSequence(session_code);
                    return NextResponse.json({ data: sequence, session_state: session_states[1]}, { status: 200 });
                } else if (sessionStatus === 'waiting') {
                    return NextResponse.json({ data: "Sessione non ancora iniziata", session_state: session_states[0] }, { status: 400 });
                } else if(sessionStatus === 'finished') {
                    return NextResponse.json({ data: "Sessione già terminata", session_state: session_states[2] }, { status: 400 });
                } else {
                    return NextResponse.json({ data: "Errore sconosciuto" }, { status: 500 });
                }
            } catch (error: any) {
                return NextResponse.json({ data: "Errore sconosciuto nel recupero della sequenza" + error.toString() }, { status: 500 });
            }
        } else {
            return NextResponse.json({ data: "Codice pupil mancante" }, { status: 400 });
        }
    } else {
        return NextResponse.json({ data: "Codice sessione mancante" }, { status: 400 });
    }
}
