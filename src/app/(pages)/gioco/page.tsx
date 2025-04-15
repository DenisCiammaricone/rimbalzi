import Image from "next/image";
import NavBar from "@/app/components/NavBar";
import TextBlock from "@/app/components/TextBlock";

export default function Gioco() {
    return (
        <div id="gioco">
            <Image
                src="/backgrounds/background5.png" // Path from public folder
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
                        <h1 className="text-3xl mt-0">Il Gioco</h1>
                        <br></br>
                        <p className="text-lg">Descrizione - per grandi linee – del gioco e dei suoi meccanismi</p>
                    </div>
                }>
                </TextBlock>
            </div>
        </div>);
}