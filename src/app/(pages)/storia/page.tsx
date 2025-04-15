import Image from "next/image";
import NavBar from "@/app/components/NavBar";
import TextBlock from "@/app/components/TextBlock";

export default function Storia() {
    return (
        <div id="storia">
            <Image
                src="/backgrounds/background2.png" // Path from public folder
                alt="Background Image"
                fill
                style={{
                    objectFit: "cover",
                    zIndex: -1,
                }}
            />
            <NavBar></NavBar>
            <div className="flex mx-auto w-full mt-20">
                <TextBlock data={
                    <div>
                        <h1 className="text-3xl mt-0">Il Cristallo Magico e il Labirinto delle Luci</h1>
                        <br></br>
                        <p className="text-lg">
                            Un tempo lontano, <b>un cristallo incantato</b> irradiava luce, gioia e armonia su tutta la Terra. Questo cuore pulsante del mondo era custodito da <b>Solarius, il Mago del Sole</b>, nella vetta luminosa della sua torre d’oro.
                            Ma l’ombra avanzò. <b>Zaroth l’Oscuro</b>, stregone delle tenebre, tentò di impossessarsene. Nel fulgore di un duello colmo di incanti e tempeste, il cristallo andò in frantumi, disperdendo la sua essenza in <b>mille scintillanti pezzi</b>.
                            Per salvarne l’anima, Solarius nascose i frammenti nel <b>Labirinto delle Luci</b>: un luogo vivo, intrecciato da specchi incantati, corridoi cangianti e raggi che abbagliano e ingannano. Solo i <b>Piccoli Maghi</b> e le <b>Piccole Maghe di Zucchero</b> potevano affrontare tale sfida.
                            Avvolti nei loro mantelli color zaffiro e armati di <b>sfere di luce</b>, si addentrarono nel labirinto. A ogni frammento ritrovato, la loro sfera brillava più intensamente, ma le illusioni del labirinto potevano confondere <b>anche i cuori più puri</b>.
                            <i>“Guidatevi con mente lucida e cuore saldo,”</i> disse Solarius. <i>“La vostra magia fiorirà insieme alla vostra pazienza.”</i>
                            Così iniziò il viaggio. Tra riflessi ingannevoli e enigmi celati nella luce, i piccoli maghi avanzarono, errando, imparando, e crescendo. Ogni frammento ritrovato era un passo verso il miracolo: uscire indenni dal labirinto, <b>ricomporre il cristallo</b> e restituire al mondo la sua luce perduta.
                            E fu così che l’avventura nel <b>Labirinto delle Luci</b> ebbe inizio…</p>
                    </div>}>
                </TextBlock>
                <div className="flex w-1/4 mx-auto m-auto">
                    <Image src="/babies2.png" className="rounded-full my-auto mx-auto" alt="Game image" width={600} height={600}></Image>
                </div>

            </div>
        </div>
    );
}