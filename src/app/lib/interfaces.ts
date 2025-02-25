interface Class {
    id: string;
    grade: string;
    section: string;
    maleNumber: number;
    femaleNumber: number;
    details: string;
}

interface Session {
    id: string;
    code: string;
    class_id: string;
    class_grade: string;
    class_section: string;
    phase: string;
    details: string;
}