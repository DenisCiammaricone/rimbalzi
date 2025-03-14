import { isLevelSuccess, isSessionCodeValid } from "@/actions/game";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session_code = new URL(req.url).searchParams.get("session");
    let verified = Array(10).fill(false)

    if (session_code && await isSessionCodeValid(session_code)) {
        const cookieStore = await cookies();
        if(cookieStore.get('guess')) {
            const guess: Sequence = JSON.parse(cookieStore.get('guess')?.value || '');
            for(let i = 0; i < 10; i++) {
                if(await isLevelSuccess(session_code, guess.levels[i])) {
                    verified[i] = true;
                }
            }
            return NextResponse.json({ message: "Ok", verifiedLevels: verified }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Error.... missing cookies" }, { status: 400 });
        }
    }
}