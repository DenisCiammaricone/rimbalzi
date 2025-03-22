import { getSequence } from "@/actions/game";
import { isSessionStarted } from "@/actions/sessions";
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
                const isStarted = await isSessionStarted(session_code);
                if(isStarted) {
                    const sequence = await getSequence(session_code);
                    return NextResponse.json({ data: sequence }, { status: 200 });
                } else {
                    return NextResponse.json({ data: "Sessione non iniziata" }, { status: 400 });
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
