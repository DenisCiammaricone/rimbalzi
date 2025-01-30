import Image from "next/image";
import Navbar from "./components/navbar";
import textBlock from "./components/textBlock";

export default async function Home() {

  return (
    <div id="home">
      {Navbar()}
      <div className="flex mx-auto w-3/4 mt-20">
        {textBlock(
          <div>
            <h1 className="text-4xl mt-0">Benvenuti a Rimbalzi</h1>
            <p className="text-lg">Rimbalzi è un gioco didattico sviluppato per verificare come l'apprendimento di alune skill di carattere informatico possa migliorare la logica nei fanciulli</p>
          </div>
        )}
        <div className="flex w-1/4 mx-auto m-auto">
          <Image src="/mascotte.webp" className="rounded-full my-auto mx-auto" alt="Game image" width={600} height={600}></Image>
        </div>
        
      </div>
    </div>
  );
}
