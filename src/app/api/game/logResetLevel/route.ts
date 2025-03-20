import { isSessionCodeValid, logChangeCellObstacle, logLevelSwitch, logResetLevel } from "@/actions/game";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const cookieStore = await cookies()
    const sessionCode = body.session_code;
    

    try {
        const pupilCode = cookieStore.get('pupil_code');
        
        if(body.session_code && await isSessionCodeValid(sessionCode)) {
            try {
                if (pupilCode) {
                    await logResetLevel(body.lvlNum, sessionCode, pupilCode.value);
                    return NextResponse.json({ data: "Level switch logged" }, { status: 200 });
                } else {
                    throw new Error("Pupil code is missing");
                }
            } catch (error) {
                return NextResponse.json({ data: "Error logging level switch" + error}, { status: 500 });
            }
            
        }
    } catch (error) {
        return NextResponse.json({ data: "Error validating session code or getting Pupil Code" }, { status: 500 });
    }
    return NextResponse.json({ data: "Unknown error "}, { status: 500 });
}