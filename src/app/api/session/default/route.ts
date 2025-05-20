import { getSessionDefaultSequenceCode } from "@/actions/sessions";

export async function GET(req: Request) {
    const grade = new URL(req.url).searchParams.get("grade");
    const phase = new URL(req.url).searchParams.get("phase");

    if(grade && phase) {
        try {
            var def = await getSessionDefaultSequenceCode(Number(grade), phase)
            return new Response(JSON.stringify({ session_code: def }), { status: 200 });
        } catch (error) {
            console.error("Error fetching session default:", error);
            return new Response(JSON.stringify({ message: error }), { status: 404 });
        }
    } else {
        return new Response(JSON.stringify({ data: "Session code missing" }), { status: 400 });
    }
}