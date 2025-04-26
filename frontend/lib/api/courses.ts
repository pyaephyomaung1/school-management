'use client';
import api from './index';
import { Course } from '@/types/course'; 

export const getCourses = async () => {
    const response = await api.get<Course[]>('/course');
    return response.data;
}