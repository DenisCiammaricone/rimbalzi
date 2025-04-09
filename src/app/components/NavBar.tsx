import { auth } from "@/auth";

export default async function NavBar(){
  //TODO: Use use session hook
    const session = await auth()
    return (
      <div id="navBar" className="flex justify-between w-3/4 mx-auto top-5 my-5">         
        <div id="navBarLeft">
          <ul className="flex gap-5">
            <li><a href="/">Home</a></li>
            <li><a href="/progetto">Il progetto</a></li>
            <li><a href="/storia">La storia</a></li>
            <li><a href="/gioco">Il gioco</a></li>
            <li><a href="/documenti">Documenti</a></li>
            <li><a href="/contatti">Contatti</a></li>
          </ul>
        </div>
        <div id="navBarRight">
            {session ? <a className="loginButton" href="/dashboard">Dashboard</a> : <a className="loginButton" href="/login">Login</a>}
        </div>
      </div>
    );
}
