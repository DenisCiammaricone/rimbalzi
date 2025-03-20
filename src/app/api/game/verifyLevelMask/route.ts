import { getLevelMask, getSequence, isLevelMaskSuccess, isLevelSuccess, isSessionCodeValid, logLevelVerify } from "@/actions/game";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session_code = new URL(req.url).searchParams.get("session");
    const level_num = new URL(req.url).searchParams.get("lvl");

    if (session_code && await isSessionCodeValid(session_code)) {
        const cookieStore = await cookies();

        if(cookieStore.get('guess')) {
            const guess: Sequence = JSON.parse(cookieStore.get('guess')?.value || '');
            const serverSequence = await getSequence(session_code);
            const lvl = guess.levels[Number(level_num)];

            lvl.size = serverSequence.levels[Number(level_num)].size;

            const mask_1 = await getLevelMask(lvl);
            const mask_2 = await getLevelMask(((await getSequence(session_code)).levels[Number(level_num)]));

            let pupil_code: string | undefined = '';
            if(cookieStore.get('pupil_code')) {
                pupil_code = cookieStore.get('pupil_code')?.value;
            } else {
                return NextResponse.json({ message: "Pupil code is missing" }, { status: 500 });
            }
            if(pupil_code) {
                if(level_num && await isLevelMaskSuccess(mask_1, mask_2)) {
                    logLevelVerify(Number(level_num), true, lvl, session_code, pupil_code);
                    return NextResponse.json({ message: "Ok" }, { status: 200 });
                } else {
                    logLevelVerify(Number(level_num), false, lvl, session_code, pupil_code);
                    return NextResponse.json({ message: "Incorrect" }, { status: 200 });
                } 
            } else {
                return NextResponse.json({ message: "Pupil code is missing" }, { status: 500 });
            }

        }
    }
}