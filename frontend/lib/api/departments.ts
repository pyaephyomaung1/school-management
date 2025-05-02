'use client';
import api from './index';
import { Department } from '@/types/department'; 

export const getDepartments = async () => {
    const response = await api.get<Department[]>('/department');
    return response.data;
}

export const createDepartment = async (newDepartment: {
    departmentName: string;
    code: string;
    description: string;
  }) => {
    const response = await api.post<Department>('/department/create', newDepartment);
    return response.data;
  };

export const deleteDepartment = async (id : number ) => {
  const response = await api.delete<Department>(`/department/${id}`);
  return response.data;
};

export const getDepartmentById = async (id : number ) => { 
  const response = await api.get<Department>(`/department/${id}`);
  return response.data;
}

export const updateDepartment = async ( id : number , updateDepartment : {
  departmentName : string;
  code : string;
  description : string;
}) => {
  const response = await api.put<Department>(`/department/update/${id}`, updateDepartment);
  return response.data; 
}