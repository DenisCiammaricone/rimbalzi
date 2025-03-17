import { getLevelMask, getSequence, isLevelMaskSuccess, isLevelSuccess, isSessionCodeValid } from "@/actions/game";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session_code = new URL(req.url).searchParams.get("session");
    let verified = Array(10).fill(false)

    if (session_code && await isSessionCodeValid(session_code)) {
        const cookieStore = await cookies();
        if(cookieStore.get('guess')) {
            const guess: Sequence = JSON.parse(cookieStore.get('guess')?.value || '');
            const serverSequence = await getSequence(session_code);
            for(let i = 0; i < 10; i++) {
                const lvl = guess.levels[Number(i)];
                lvl.size = serverSequence.levels[Number(i)].size;
                const mask_1 = await getLevelMask(lvl);
                const mask_2 = await getLevelMask(((await getSequence(session_code)).levels[Number(i)]));
                if (await isLevelMaskSuccess(mask_1, mask_2)) {
                    verified[i] = true;
                }
            }
            return NextResponse.json({ message: "Ok", verifiedLevels: verified }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Error.... missing cookies" }, { status: 400 });
        }
    }
}