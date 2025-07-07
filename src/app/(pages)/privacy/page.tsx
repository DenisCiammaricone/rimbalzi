import Image from "next/image";
import TextBlock from "@/components/TextBlock";
import NavBar from "@/components/NavBar";

export default function Privacy() {
    return (
        <div>
            <NavBar></NavBar>             
            <div className="flex mx-auto w-full mt-20">
                <TextBlock data={
                    <div>
                        <h1 className="text-3xl font-bold mb-6">Informativa sulla Privacy</h1>

                        <p className="mb-4">
                            Ai sensi dell’art. 13 del Regolamento (UE) 2016/679 (GDPR), si forniscono le seguenti informazioni relative al trattamento dei dati personali raccolti tramite questo sito web, utilizzato per attività di ricerca educativa in didattica dell’informatica condotta nell’ambito del Consorzio CINI.
                        </p>

                        <h2 className="text-xl font-semibold mt-6 mb-2">1. Titolare del trattamento</h2>
                        <p className="mb-4">
                            <i>Nome Del Titolare</i> – <a href="mailto:info@labinformaticaescuola.it" className="text-blue-600 underline">info@labinformaticaescuola.it</a>
                        </p>

                        <h2 className="text-xl font-semibold mt-6 mb-2">2. Finalità del trattamento</h2>
                        <p className="mb-4">
                            Il sito raccoglie dati personali degli insegnanti in fase di registrazione per consentire la partecipazione a progetti di ricerca educativa. Gli studenti accedono in forma anonima o pseudonimizzata per utilizzare giochi didattici, i cui dati sono trattati a fini statistici e scientifici.
                        </p>

                        <h2 className="text-xl font-semibold mt-6 mb-2">3. Tipologie di dati raccolti</h2>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Dati insegnanti: nome, cognome, email, scuola, classi, numero di maschi e femmine.</li>
                            <li>Dati studenti (anonimi): partite giocate, successi ed errori (aggregati).</li>
                        </ul>

                        <h2 className="text-xl font-semibold mt-6 mb-2">4. Modalità di trattamento e conservazione</h2>
                        <p className="mb-4">
                            I dati sono pseudonimizzati, trattati con strumenti elettronici e accessibili solo ai ricercatori autorizzati del Laboratorio Nazionale Informatica e Scuola. Vengono conservati per il tempo necessario allo svolgimento delle attività previste.
                        </p>

                        <h2 className="text-xl font-semibold mt-6 mb-2">5. Base giuridica del trattamento</h2>
                        <p className="mb-4">
                            Art. 6, par. 1, lett. e) GDPR: esecuzione di un compito di interesse pubblico, in ambito di ricerca scientifica educativa (art. 89 GDPR).
                        </p>

                        <h2 className="text-xl font-semibold mt-6 mb-2">6. Comunicazione e diffusione</h2>
                        <p className="mb-4">
                            I dati non sono comunicati a terzi né diffusi. Non vengono utilizzati servizi esterni o di terze parti.
                        </p>

                        <h2 className="text-xl font-semibold mt-6 mb-2">7. Diritti degli interessati</h2>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Diritto di accesso, rettifica, cancellazione, limitazione, opposizione, portabilità.</li>
                            <li>Diritto di reclamo al Garante Privacy.</li>
                        </ul>
                        <p className="mb-4">
                            Richieste via email: <a href="mailto:info@labinformaticaescuola.it" className="text-blue-600 underline">info@labinformaticaescuola.it</a>
                        </p>

                        <h2 className="text-xl font-semibold mt-6 mb-2">8. Cookie</h2>
                        <p className="mb-4">
                            Il sito utilizza solo cookie tecnici essenziali al funzionamento dell’area riservata e al tracciamento anonimo del progresso nei giochi. Non sono usati cookie di profilazione. Non è richiesto consenso esplicito, secondo le Linee guida del Garante Privacy (luglio 2021).
                        </p>

                        <h2 className="text-xl font-semibold mt-6 mb-2">9. Modifiche all’informativa</h2>
                        <p className="mb-4">
                            La presente informativa può essere aggiornata. In caso di modifiche rilevanti, verrà fornita notifica agli utenti registrati.
                        </p>
                    </div>
                }>
                </TextBlock>
            </div>
        </div>);
}