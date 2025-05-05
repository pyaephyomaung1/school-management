"use client";
import React, { useEffect, useState } from "react";
import { Course } from "@/types/course";
import { deleteCourse, getCourses } from "@/lib/api/courses";
import { useRouter } from "next/navigation";
import { getDepartments } from "@/lib/api/departments";
import { Department } from "@/types/department";

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);

  const handleAddCourse = () => {
    router.push("/courses/create");
  };
  const handleEditCourse = (id: number) => {
    router.push(`/courses/update/${id}`);
  };
  

  // Function to get department name by ID
  const getDepartmentName = (departmentId: number) => {
    const department = departments.find((dept) => dept.id === departmentId);
    return department ? department.departmentName : "-";
  };

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.error("Failed to load courses:", error);
        setError("Failed to load courses. Please try again later.");
      }
    };

    const loadDepartments = async () => {
      try {
        const departmentData = await getDepartments();
        setDepartments(departmentData);
      } catch (error) {
        console.error("Failed to load departments:", error);
        setError("Failed to load departments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
    loadDepartments();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(id);
        setCourses(courses.filter((course) => course.id !== id));
        alert("Course deleted successfully");
      } catch (error) {
        console.error("Failed to delete course:", error);
        alert("Failed to delete course. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-800 p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-lg font-semibold animate-pulse">
          Loading courses...
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
          <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
          <p className="text-gray-500 mt-1">
            {courses.length} course{courses.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <button
          onClick={handleAddCourse}
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
          Add Course
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
          <p className="text-gray-500 mb-4">No courses found</p>
          <button
            onClick={handleAddCourse}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Your First Course
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr className="text-gray-600 uppercase text-sm tracking-wider">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Description</th>
                <th className="p-4 font-semibold">Department</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr
                  key={course.id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="p-4 text-gray-800">{course.id}</td>
                  <td className="p-4 text-gray-800">{course.name}</td>
                  <td className="p-4 text-gray-800">
                    {course.description || "-"}
                  </td>
                  <td className="p-4 text-gray-800">
                    {getDepartmentName(Number(course.departmentId))}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          router.push(`/courses/update/${course.id}`)
                        }
                        className="text-gray-200 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 hover:text-gray-100 transition-colors duration-200 text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(course.id)}
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

export default CoursesPage;
