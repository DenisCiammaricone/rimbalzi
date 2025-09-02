"use client";
import { useState, useEffect } from "react";
 
export default function AutocompleteScuole() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ "@id": string; "miur:DENOMINAZIONESCUOLA": string; "miur:CODICESCUOLA": string }[]>([]);
    const [selected, setSelected] = useState<string>("");
    const [code, setCode] = useState<string>("");

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const schoolList = document.getElementById('schoolList');
            const schoolInput = document.querySelector('#schoolInput');
            if (schoolList && schoolInput) {
                if (
                    (e.target instanceof Node && schoolList.contains(e.target as Node)) ||
                    (e.target instanceof Node && schoolInput.contains(e.target as Node))
                ) {
                    console.log("Clicked inside");
                    schoolList.hidden = false;
                } else {
                    console.log("Clicked outside");
                    schoolList.hidden = true;
                }
            }
        };

        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, []);

    useEffect(() => {
        
    const timer = setTimeout(async () => {
        try {
            const res = await fetch(`/api/schools?q=${encodeURIComponent(query)}`);
            const data = JSON.parse(await res.json());
            
            
            // Assicurati che data sia un array o estrailo dalla struttura corretta
            let schoolsArray = [];
            
            if (Array.isArray(data)) {
            schoolsArray = data;
            } else if (data && data['@graph'] && Array.isArray(data['@graph'])) {
            // Se i dati hanno la struttura del JSON delle scuole italiane
            schoolsArray = data['@graph'].map((school: any) => ({
                codice: school['@id'] || school.codice,
                nome: school['miur:DENOMINAZIONESCUOLA'] || school.nome
            }));
            } else if (data && Array.isArray(data.schools)) {
            schoolsArray = data.schools;
            }
            
            setResults(schoolsArray);
        } catch (error) {
            console.error('Errore nel fetch delle scuole:', error);
            setResults([]);
        }
        }, 20);

        return () => clearTimeout(timer);
    }, [query]);
 
    return (
        <div className="relative w-80" id="schoolInput">
        <input
            className="border rounded w-full p-2"
            type="text"
            value={selected || query}
            placeholder="Cerca la tua scuola..."
            onSelect={() => {
                const schoolList = document.getElementById('schoolList');
                if (schoolList) {
                    schoolList.hidden = false;
                }
            }}
            onChange={(e) => {
            setSelected("");
            setCode("");
            setQuery(e.target.value);
            }}
        />
        <select name="schoolCode" hidden>
            <option value={code} hidden></option>
        </select>
        
            <ul className="absolute z-10 bg-white border rounded w-full mt-1 overflow-y-auto shadow-lg text-black" id="schoolList">
            {
            results.map((s) => {
                return (
                    
                    <li
                    key={s["@id"]}
                    className="p-2 hover:bg-blue-100 cursor-pointer "
                    onClick={() => {
                        setSelected(s["miur:DENOMINAZIONESCUOLA"] + " - " + s["miur:CODICESCUOLA"]);
                        setCode(s["miur:CODICESCUOLA"]);
                        setResults([]);
                    }}
                    >
                    {s["miur:DENOMINAZIONESCUOLA"] + " (" + s["miur:CODICESCUOLA"] + ")"}
                    </li>
                );
            })}
            </ul>
        
        </div>
    );
}