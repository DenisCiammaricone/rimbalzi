import { getSessionIdByCode, getSessionsByTeacherId, isTeacherOwnerOfSession, startSession } from "@/actions/sessions";
import { checkForUnauthorizedTeacher } from "@/app/lib/utils";
import { auth } from "@/auth";

export async function POST(req: Request){
    const body = await req.json();
    const session = await auth();

    if(!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    } else {
        if(session.user.id) {
            if(!(await isTeacherOwnerOfSession(session.user.id, body.session_code))) {
                return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
            }
        }
    }

    try {
        startSession((await getSessionIdByCode(body.session_code)).toString());    
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
    }
    return new Response(JSON.stringify({ data: "Session started" }), { status: 200 });
}