import { auth } from "@/auth";

// TODO: Aggiusta... non funziona
export async function checkForUnauthorizedTeacher(teacher_id: string | null) {
    const session = await auth()
    // If not logged in or the user is not the teacher then return unauthorized
    if (!session || session.user.id !== teacher_id) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
}

export async function isResearcher() {
    const session = await auth()
    if(session && session.user && session.user.group?.toLowerCase() === "researcher") {
        return true
    } else {
        return false
    }
}

export async function checkForResearcherAccess(user_id: string | null) {
    const session = await auth();
    
    // If not logged in or not a researcher, throw an error
    if (!session || session.user.group?.toLowerCase() !== "researcher") {
        throw new Error("Unauthorized: Researcher access required");
    }
    
    // If user_id doesn't match the logged-in user
    if (session.user.id !== user_id) {
        throw new Error("Unauthorized: Invalid user credentials");
    }
}