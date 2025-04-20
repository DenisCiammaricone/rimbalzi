import Image from "next/image";
import NavBar from "./components/NavBar";
import NavBarTop from "./components/NavBarTop";
import TextBlock from "./components/TextBlock";

export default async function Home() {

  return (
    <div id="home">
      <NavBarTop></NavBarTop>
      <NavBar></NavBar>
      <div className="flex mx-auto w-auto mt-20">
        <TextBlock data={
          <div>
            <h1 className="text-5xl mt-0">Rimbalzi di Luce</h1>
            <br></br>
            <p className="text-lg">
              <b>Le attività di programmazione migliorano le capacità di ragionamento logico degli studenti della scuola primaria? In quale misura?</b><br></br><br></br>
              Questa è una attività sperimentale promossa dal laboratotio nazionale "Informatica e Scuola" del CINI, che ha sviluppato un rompicapo ambientato in un mondo magico  e tarato sugli alunni della scuola primaria per valutarne le capacità di ragionamento logico.<br></br><br></br>
              L'attività, proposta a tutte le scuole che desiderassero aderire, è stata specificamente progettata per garantire che tutti gli studenti possano partire dalla stessa base in termini di difficoltà e comprensione. </p>
          </div>}>
        </TextBlock>
        <div className="flex w-1/4 mx-auto m-auto">
          <Image src="/mascotte.png" className="rounded-full my-auto mx-auto" alt="Game image" width={200} height={600}></Image>
        </div>

      </div>
    </div >
  );
}
