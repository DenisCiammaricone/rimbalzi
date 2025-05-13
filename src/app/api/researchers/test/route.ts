import { auth } from "@/auth";
import { isResearcher } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await auth();

    if(await isResearcher()) {
        return Response.json({ message: 'Hello from researchers' }, { status: 200 });
    } else {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }
}