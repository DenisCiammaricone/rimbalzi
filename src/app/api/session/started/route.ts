import { isSessionStarted } from "@/actions/sessions";
import { NextResponse } from "next/server";

export async function GET(req: Request) { 
    const session_code = new URL(req.url).searchParams.get("session_code");

    if(session_code) {
        if(await isSessionStarted(session_code)) {
            return NextResponse.json({ data: "Session started" }, { status: 200 });
        } else {
            return NextResponse.json({ data: "Session not started" }, { status: 401 });
        }
    } else {
        return NextResponse.json({ data: "Session code missing" }, { status: 400 });
    }
}