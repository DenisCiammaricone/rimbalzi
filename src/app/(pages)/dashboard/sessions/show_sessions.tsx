import { newSession } from "./new_session";

export async function sessionsPage(uid: string = "0", setContent: any) {
    return (
        <div><button onClick={() => setContent(newSession(uid))}>Prenota Sessione</button></div>
    );
}