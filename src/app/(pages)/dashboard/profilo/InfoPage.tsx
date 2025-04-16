import { Session } from "next-auth"

export async function InfoPage(uid: string = "0", setContent: React.Dispatch<React.SetStateAction<React.JSX.Element>>, userSession: Session) {
    return (<div>Benvenuto {userSession.user.name}</div>)   
}