import Image from "next/image";
import NavBar from "@/components/NavBar";
import TextBlock from "@/components/TextBlock";

export default function Progetto() {
    return (
        <div id="progetto">
            <Image
                src="/backgrounds/background9.jpeg" // Path from public folder
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
                        <h1 className="text-3xl mt-0">Il Progetto</h1>
                        <br></br>
                        <p className="text-lg">Descrizione - per grandi linee – del progetto e delle sue fasi</p>
                    </div>
                }>
                </TextBlock>
            </div>
        </div>
    );

}