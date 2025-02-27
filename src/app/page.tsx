import Image from "next/image";
import NavBar from "./components/NavBar";
import TextBlock from "./components/TextBlock";

export default async function Home() {

  return (
    <div id="home">
      <NavBar></NavBar>
      <div className="flex mx-auto w-3/4 mt-20">
        <TextBlock data={
          <div>
            <h1 className="text-4xl mt-0">Benvenuti a Rimbalzi</h1>
            <p className="text-lg">Rimbalzi è un gioco didattico sviluppato per verificare come l'apprendimento di alune skill di carattere informatico possa migliorare la logica nei fanciulli</p>
          </div>}>
        </TextBlock>
        <div className="flex w-1/4 mx-auto m-auto">
          <Image src="/mascotte.webp" className="rounded-full my-auto mx-auto" alt="Game image" width={600} height={600}></Image>
        </div>
        
      </div>
    </div>
  );
}
