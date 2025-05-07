export interface Teacher {
    id : number;
    name : string; 
    email : string;
    birthDate : string;
    gender :  'MALE' | 'FEMALE' | 'OTHER';
    teacherImage  : string ; 
    department: number;
    courses : number[];
}