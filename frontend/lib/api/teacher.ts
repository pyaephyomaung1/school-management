import api from "./index";
import { Teacher } from "@/types/teacher";


export const getTeachers = async () :Promise<Teacher[]> => {
    const response = await api.get('/teachers');
    return response.data;
}

export const deleteTeacher = async ( id : number) : Promise<void> => {
    await api.delete(`/teachers/${id}`);
}