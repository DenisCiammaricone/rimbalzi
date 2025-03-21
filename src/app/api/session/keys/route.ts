import { getSessionKeys } from "@/actions/sessions";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
   
    const { searchParams } = new URL(req.url);
    const session_code = searchParams.get('session_code');

    try{
        if(session_code) {
            const session_keys = await getSessionKeys(session_code)
            return NextResponse.json({ keys: session_keys }, { status: 200 });
        } else {
            throw new Error('Missing session_code parameter');
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.toString() }, { status: 500 });
    }

}