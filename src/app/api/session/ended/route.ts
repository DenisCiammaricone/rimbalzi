import { getSessionStatus } from "@/actions/sessions";
import { session_states } from "@/app/lib/enums";

export async function GET(req: Request) {
    const session_code = new URL(req.url).searchParams.get("session_code");

    if(session_code) {
        if(await getSessionStatus(session_code) === session_states[2]) {
            return new Response(JSON.stringify({ data: "Session ended" }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ data: "Session not ended" }), { status: 401 });
        }
    } else {
        return new Response(JSON.stringify({ data: "Session code missing" }), { status: 400 });
    }
}