import { getPupilGameData } from "@/actions/game";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session_code = new URL(req.url).searchParams.get("session_code");
    const cookieStore = await cookies();
    const pupil_code = cookieStore.get('pupil_code');

    if(pupil_code && session_code){
        const gameData = await getPupilGameData(session_code, pupil_code.value);
        return NextResponse.json({data: gameData}, {status: 200});
    } else {
        return NextResponse.json({ data: "Pupil code cookie o session_code mancanti" }, { status: 400 });
    }
}