import { getSessionStatus, isSessionStarted } from "@/actions/sessions";
import { NextResponse } from "next/server";

export async function GET(req: Request) { 
    const session_code = new URL(req.url).searchParams.get("session_code");

    if(session_code) {
        try {
            const status = await getSessionStatus(session_code)

            return NextResponse.json({ data: "Status Sessione", session_status: status }, { status: 200 });
        } catch (error) {
            console.log(error)
            return NextResponse.json({ data: "Session not started" }, { status: 401 });
        }
    } else {
        return NextResponse.json({ data: "Session code missing" }, { status: 400 });
    }
}