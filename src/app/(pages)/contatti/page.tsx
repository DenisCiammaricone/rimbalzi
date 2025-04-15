import Image from "next/image";
import TextBlock from "@/app/components/TextBlock";
import NavBar from "@/app/components/NavBar";

export default function Contatti() {
    return (
        <div>
            <NavBar></NavBar>
            <Image
                src="/backgrounds/background10.jpeg" // Path from public folder
                alt="Background Image"
                fill
                style={{
                    objectFit: "cover",
                    zIndex: -1,
                }}
            />
            <div className="flex mx-auto w-3/4 mt-20">                        
                <TextBlock data={
                    <div>
                        <h1 className="text-3xl mt-0">Contatti</h1>
                        <br></br>                                                
                        <i>Responsabile del progetto</i> – <a href="mailto:nardelli@mat.uniroma2.it" className="text-blue-600 underline">Enrico Nardelli</a>
                        <br></br>
                        <br></br>
                        <i>Informazioni</i> – <a href="mailto:info@labinformaticaescuola.it" className="text-blue-600 underline">info@labinformaticaescuola.it</a>
                        <br></br>
                        <br></br>
                        <b>Gruppo di ricerca:</b>
                        <br></br>
                        <ul >
                            <li>&nbsp;&nbsp;Luca Forlizzi <a href="mailto:luca.forlizzi@univaq.it" className="text-blue-600 underline">mail</a></li>                            
                            <li>&nbsp;&nbsp;Guglielmo Abbruzzese <a href="mailto:guglielmo.abbruzzese@scuola.istruzione.it" className="text-blue-600 underline">mail</a></li>                            
                            <li>&nbsp;&nbsp;Denis Ciammaricone <a href="mailto:denis.ciammaricone@student.univac.it" className="text-blue-600 underline">mail</a></li>
                        </ul>
                    </div>
                }>
                </TextBlock>
            </div>
        </div>);
}