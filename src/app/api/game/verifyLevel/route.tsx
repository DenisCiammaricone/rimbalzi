import { isLevelSuccess, isSessionCodeValid } from "@/actions/game";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session_code = new URL(req.url).searchParams.get("session");
    const level_num = new URL(req.url).searchParams.get("lvl");
    if (session_code && await isSessionCodeValid(session_code)) {
        const cookieStore = await cookies();
        if(cookieStore.get('guess')) {
            const guess: Sequence = JSON.parse(cookieStore.get('guess')?.value || '');
            if(level_num && await isLevelSuccess(session_code, guess.levels[Number(level_num)])) {
                return NextResponse.json({ message: "Ok" }, { status: 200 });
            }
            return NextResponse.json({ message: "Incorrect" }, { status: 200 });
        }
    }
}