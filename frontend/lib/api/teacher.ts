import api from "./index";
import { Teacher } from "@/types/teacher";

// Get all teachers
export const getTeachers = async (): Promise<Teacher[]> => {
  const response = await api.get('/teachers');
  return response.data;
};

// Get teacher by ID
export const getTeacherById = async (id: number): Promise<Teacher> => {
  const response = await api.get(`/teachers/${id}`);
  return response.data;
};

// Delete teacher
export const deleteTeacher = async (id: number): Promise<void> => {
  await api.delete(`/teachers/${id}`);
};

// Create teacher (with image upload)
export const createTeacher = async (
  teacherData: {
    name: string;
    birthDate: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    email: string;
    department: number;
    image: File;
  }
): Promise<Teacher> => {
  const formData = new FormData();

  formData.append('name', teacherData.name);
  formData.append('birthDate', teacherData.birthDate);
  formData.append('gender', teacherData.gender);
  formData.append('email', teacherData.email);
  formData.append('department', teacherData.department.toString());

  formData.append('imageFile', teacherData.image); // This matches @RequestPart MultipartFile imageFile

  const response = await api.post<Teacher>('/teachers/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};


export const updateTeacher = async (
  id: number,
  updateData: {
    name: string;
    birthDate: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    email: string;
    department: number;
    image?: File; 
  }
): Promise<Teacher> => {
  const formData = new FormData();

  formData.append('name', updateData.name);
  formData.append('birthDate', updateData.birthDate);
  formData.append('gender', updateData.gender);
  formData.append('email', updateData.email);
  formData.append('department', updateData.department.toString());

  if (updateData.image) {
    formData.append('imageFile', updateData.image);
  }

  const response = await api.put<Teacher>(`/teachers/update/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
