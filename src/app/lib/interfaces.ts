interface Class {
    id: string;
    grade: string;
    section: string;
    maleNumber: number;
    femaleNumber: number;
    details: string;
    teacherId: string;
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

interface Level {
    level: number;
    size: number;
    obstacles: { [key: string]: string };
}
interface Sequence {
    levels: Level[];
}

interface ModifyCell {
    action: string;
    level: number;
    x: number;
    y: number;
    currentObstacle: string;
    newObstacle: string;
    timestamp: Date;
}

interface VerifyLevel {
    action: string;
    level: number;
    outcome: boolean;
    board: JSON; // JSON Level object
    timestamp: Date;
}

interface CleanLevel {
    action: string;
    level: number;
    timestamp: Date;
}

class ChangeLevel {
    action: string = "chg_lvl";
    level: number = -1;
    to: number = -1;
    timestamp: Date = new Date();
}

interface CompleteSequence {
    action: string;
    board: JSON; // JSON Level object
    timestamp: Date;
}