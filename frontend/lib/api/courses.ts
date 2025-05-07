import api from './index';
import { Course } from '@/types/course'; 

export const getCourses = async () => {
  const response = await api.get<Course[]>('/course');
  return response.data;
}

export const deleteCourse = async (id: number) => {
  const response = await api.delete<Course>(`/course/${id}`);
  return response.data;
}

export const createCourse = async (newCourse: {
  name: string;
  description: string;
  departmentId: number;
}) => {
  const response = await api.post<Course>("/course/create", newCourse);
  return response.data;
};

export const getCourseById = async (id: number) => {
  console.log("Course ID in getCourseById:", id); // Log the ID
  if (isNaN(id)) {
    throw new Error("Invalid course ID.");
  }
  const response = await api.get<Course>(`/course/${id}`);
  return response.data;
}

export const updateCourse = async (id: number, updateCourse: {
  name: string;
  description: string;
  departmentId: number;
}) => {
  const response = await api.put<Course>(`/course/update/${id}`, updateCourse);
  return response.data;
}
