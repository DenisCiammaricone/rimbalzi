import { db } from "@/lib/db/db";
import { schools } from "@/db/schema/schools";
import fs from 'fs';
import path from 'path';

/**
 * @returns all schools id and name
 */
export async function getAllSchoolsId() {
    const res = await db.select({id: schools.id, name: schools.name }).from(schools);
    return res;
}

export async function getSchoolsLike(schoolName: string) {
    // try {
        
    //     //const response = await fetch('@/public/scuole_italiane.json');
    //     //const scuole = await response.json();
        
    //     const filePath = path.join(process.cwd(), 'public', 'scuole_italiane.json');
        
    //     // Leggi il file dal file system
    //     const fileContent = fs.readFileSync(filePath, 'utf8');
    //     const scuole = JSON.parse(fileContent);
    //     return scuole['@graph'];
    // } catch (error) {
    //     console.error('Errore nel caricamento del file:', error);
    // }
    try {
        const filePath = path.join(process.cwd(), 'public', 'scuole_italiane.json');
        
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const scuole = JSON.parse(fileContent);
        
        const filteredSchools = scuole['@graph']
            .filter((school: any) => school['miur:DENOMINAZIONESCUOLA'].toLowerCase().includes(schoolName.toLowerCase()))
            .slice(0, 10); // Limita a 10 risultati
        return filteredSchools;
    } catch (error) {
        console.error('Errore nel caricamento del file:', error);
        return [];
    }
}