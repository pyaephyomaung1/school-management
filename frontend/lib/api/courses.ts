'use client';
import api from './index';
import { Course } from '@/types/course'; 

export const getCourses = async () => {
    const response = await api.get<Course[]>('/course');
    return response.data;
}

export const deleteCourse = async (id : number) => {
    const response = await api.delete<Course>(`/course/${id}`);
    return response.data;
}

export const createCourse = async (newCourse : {
    name : string;
    description : string;

}) => {

}