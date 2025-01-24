import { auth } from "@/auth";

const Navbar = async () => {
    const session = await auth()
    return (
      <div id="navBar" className="flex justify-between w-3/4 mx-auto top-5 my-5">
        <div id="navBarLeft">
          <ul className="flex gap-5">
            <li>Home</li>
            <li>About</li>
            <li>Projects</li>
            <li>Contact</li>
          </ul>
        </div>
        <div id="navBarRight">
            {session ? <a className="loginButton" href="/dashboard">Dashboard</a> : <a className="loginButton" href="/login">Login</a>}
        </div>
      </div>
    );
}

export default Navbar;