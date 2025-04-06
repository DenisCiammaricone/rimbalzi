import Image from "next/image";

export default async function NavBarTop() {
  return (
    <div id="navBarTop" className="flex justify-between w-3/4 mx-auto top-5 my-5">
      <div id="navBarLeft">
        <ul className="flex gap-5">
          <li>
            <a href="https://www.consorzio-cini.it/index.php/it/lab-informatica-e-scuola" target="_blank" rel="noopener noreferrer">
                <Image src="/logos/logo_full_.png" className="my-auto mx-auto" alt="" width={300} height={100}></Image>
              </a>            
          </li>
          <li>Progetto <b>“Apprendimento dell'informatica</b> (MUR - PRIN_2022 - 2022BP7K3 - CUP:E53D23007730006)” - F1-2023-0113 - INF/01"</li>
        </ul>
      </div>
      <div id="navBarRight">
        <ul className="flex gap-5">
          <li><Image src="/logos/TorVergataLogo.jpg" className="my-auto mx-auto" alt="" width={250} height={100}></Image></li>
          <li><Image src="/logos/Aquila2_logo.jpg"    className="my-auto mx-auto" alt="" width={200} height={100}></Image></li>
        </ul>
      </div>
    </div>
  );
}
