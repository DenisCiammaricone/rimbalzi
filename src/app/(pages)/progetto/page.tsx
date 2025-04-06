import NavBar from "@/app/components/NavBar";
import TextBlock from "@/app/components/TextBlock";

export default function Progetto() {
    return (
        <div id="progetto">
            <NavBar></NavBar>
            <div className="flex mx-auto w-3/4 mt-20">
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