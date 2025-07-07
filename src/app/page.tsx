import Image from "next/image";
import NavBar from "../components/NavBar";
import NavBarTop from "../components/NavBarTop";
import TextBlock from "../components/TextBlock";

export default async function Home() {

  return (
    <div id="home">
      <NavBarTop></NavBarTop>
      <NavBar></NavBar>
      <div className="flex mx-auto mt-20 w-3/4">
        <TextBlock data={
          <div>
            <h1 className="text-5xl mt-0">Rimbalzi di Luce</h1>
            <br></br>
            <p className="text-lg">
              <b>Le attività di programmazione migliorano le capacità di ragionamento logico degli studenti della scuola primaria? In quale misura?</b><br></br><br></br>
              Questa è una attività sperimentale promossa dai gruppi di ricerca delle università di <b>Roma Tor Vergata</b> e dell'<b>Aquila</b>, afferenti al <i><b>Laboratorio Nazionale "Informatica e Scuola"</b> del CINI</i>. 
              Questa attività, avviata nell'ambito del progetto <b>PINI - “Apprendimento dell'informatica"</b>, ha sviluppato un rompicapo ambientato in un mondo magico  e tarato sugli alunni della scuola primaria per valutarne le capacità di ragionamento logico.<br></br><br></br>
              La proposta, aperta a tutte le scuole che desiderassero aderire, è stata specificamente progettata per garantire che tutti gli studenti possano partire dalla stessa base in termini di difficoltà e comprensione. </p>
          </div>}>
        </TextBlock>
        <div className="flex w-1/4 mx-auto m-auto">
          <Image src="/mascotte.png" className="rounded-full my-auto mx-auto" alt="Game image" width={300} height={300}></Image>
        </div>

      </div>
    </div >
  );
}
