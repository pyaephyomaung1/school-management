"use client";
import React, { useEffect, useState } from "react";
import { Course } from "@/types/course";
import { getStudents, deleteStudent } from "@/lib/api/students";
import { useRouter } from "next/navigation";
import { getDepartments } from "@/lib/api/departments";
import { getCourses } from "@/lib/api/courses";
import { Department } from "@/types/department";
import { Student } from "@/types/student";

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const handleAddStudent = () => {
    router.push("/students/create");
  };

  const handleEditStudent = (id: number) => {
    router.push(`/students/update/${id}`);
  };

  // Function to get department name by ID
  const getDepartmentName = (departmentId: number) => {
    const department = departments.find((dept) => dept.id === departmentId);
    return department ? department.departmentName : "-";
  };

  // Function to get course name by ID
  const getCourseName = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.name : "-";
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [studentsData, departmentsData, coursesData] = await Promise.all([
          getStudents(),
          getDepartments(),
          getCourses(),
        ]);
        setStudents(studentsData);
        setDepartments(departmentsData);
        setCourses(coursesData);
      } catch (error) {
        console.error("Failed to load data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(id);
        setStudents(students.filter((student) => student.id !== id));
        alert("Student deleted successfully");
      } catch (error) {
        console.error("Failed to delete student:", error);
        alert("Failed to delete student. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-800 p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-lg font-semibold animate-pulse">
          Loading students...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 p-6">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Students</h1>
          <p className="text-gray-500 mt-1">
            {students.length} student{students.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <button
          onClick={handleAddStudent}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Student
        </button>
      </div>

      {students.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
          <p className="text-gray-500 mb-4">No students found</p>
          <button
            onClick={handleAddStudent}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Your First Student
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr className="text-gray-600 uppercase text-sm tracking-wider">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Image</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Birth Date</th>
                <th className="p-4 font-semibold">Gender</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Department</th>
                <th className="p-4 font-semibold">Courses</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr
                  key={student.id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="p-4 text-gray-800">{student.id}</td>
                  <td className="p-4">
                    {student.studentImage ? (
                      <img
                        src={student.studentImage}
                        alt="Student"
                        className="w-16 h-16 object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-800">{student.name}</td>
                  <td className="p-4 text-gray-800">
                    {student.birthDate || "-"}
                  </td>
                  <td className="p-4 text-gray-800">{student.gender || "-"}</td>
                  <td className="p-4 text-gray-800">{student.email || "-"}</td>
                  <td className="p-4 text-gray-800">
                    {getDepartmentName(Number(student.department))}
                  </td>
                  <td className="p-4 text-gray-800">
                    {student.courses?.map((courseId) => (
                      <div key={courseId}>{getCourseName(courseId)}</div>
                    )) || "-"}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditStudent(student.id)}
                        className="text-gray-200 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 hover:text-gray-100 transition-colors duration-200 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-gray-100 px-3 py-1 rounded bg-red-600 hover:bg-red-700 hover:text-gray-200 transition-colors duration-200 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
