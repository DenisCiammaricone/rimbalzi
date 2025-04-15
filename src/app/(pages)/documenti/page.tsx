import Image from "next/image";
import TextBlock from "@/app/components/TextBlock";
import NavBar from "@/app/components/NavBar";

export default function Documenti() {
    return (
        <div>
            <NavBar></NavBar>
            <Image
                src="/backgrounds/background11.jpeg" // Path from public folder
                alt="Background Image"
                fill
                style={{
                    objectFit: "cover",
                    zIndex: -1,
                }}
            />
            <div className="flex mx-auto w-full mt-20">
                <TextBlock data={
                    <div>
                        <h1 className="text-3xl mt-0">Documenti</h1>
                        <br></br>
                        <p className="text-lg">Elenco della documentazione utile per conoscere il progetto</p>
                    </div>
                }>
                </TextBlock>
            </div>
        </div>);
}