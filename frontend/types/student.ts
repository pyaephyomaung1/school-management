export interface Student {
    id: number;
    name:string;
    birthDate: string;
    gender : 'MALE' | 'FEMALE' | 'OTHER';
    email: string;
    studentImage: string;
    department: number;
    courses : number[];
}