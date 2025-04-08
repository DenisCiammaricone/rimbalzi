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
                        <p className="text-lg">Elenco dei contatti utili</p>
                    </div>
                }>
                </TextBlock>
            </div>
        </div>);
}