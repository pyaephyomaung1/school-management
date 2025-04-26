"use client";
import React, { useEffect, useState } from "react";
import { Course } from "@/types/course";
import { getCourses } from "@/lib/api/courses";

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.error("Failed to load departments:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-800 p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-lg font-semibold animate-pulse">
          Loading departments...
        </p>
      </div>
    );

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Courses</h1>

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
                <td className="p-4 text-gray-800">{course.description}</td>
                <td className="p-4 text-gray-800">{course.departmentName}</td>
                <td className="p-4 text-gray-800 gap-4 flex">
                  <button className="text-blue-600 hover:text-blue-800">
                    Edit
                  </button>
                  <button className="ml-2 text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoursesPage;
