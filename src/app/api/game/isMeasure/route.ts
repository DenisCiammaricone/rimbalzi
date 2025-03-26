import { isSessionMeasure } from "@/actions/game";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session_code = new URL(req.url).searchParams.get("session_code");
    if (session_code) {
        const isMeasure = await isSessionMeasure(session_code)
        return NextResponse.json({ data: isMeasure }, { status: 200 });
    }
    return NextResponse.json({ data: "Codice sessione non trovato" }, { status: 404 });
}