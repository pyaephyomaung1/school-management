import { Student } from "@/types/student";
import api from "./index";

export const getStudents = async (): Promise<Student[]> => {
  const response = await api.get('/student');
  return response.data;
}

export const getStudentById = async (id: number): Promise<Student> => {
  const response = await api.get(`/student/${id}`);
  return response.data;
}

export const deleteStudent = async (id: number): Promise<void> => {
  await api.delete(`/student/${id}`);
}

export const updateStudent = async (
    id: number,
    updateData: {
      name: string;
      birthDate: string;
      gender: string;
      email: string;
      department: number;
      courses: number[];
      image?: File;  // Add File type for image upload
    }
  ): Promise<Student> => {
    const formData = new FormData();
    
    // Append all fields to FormData
    formData.append('name', updateData.name);
    formData.append('birthDate', updateData.birthDate);
    formData.append('gender', updateData.gender);
    formData.append('email', updateData.email);
    formData.append('department', updateData.department.toString());
    
    // Append each course ID individually
    updateData.courses.forEach(courseId => {
      formData.append('courses', courseId.toString());
    });
  
    // Append image file if provided
    if (updateData.image) {
      formData.append('image', updateData.image);
    }
  
    const response = await api.put<Student>(`/student/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  };

  export const createStudent = async (
    studentData: {
      name: string;
      birthDate: string;
      gender: string;
      email: string;
      department: number;
      courses: number[];
      image: File;
    }
  ): Promise<Student> => {
    const formData = new FormData();
    
    // Append all fields to FormData
    formData.append('name', studentData.name);
    formData.append('birthDate', studentData.birthDate);
    formData.append('gender', studentData.gender);
    formData.append('email', studentData.email);
    formData.append('department', studentData.department.toString());
    
    // Append each course ID individually
    studentData.courses.forEach(courseId => {
      formData.append('courses', courseId.toString());
    });
  
    // Append image file
    formData.append('image', studentData.image);
  
    const response = await api.post<Student>('/student/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  };
  