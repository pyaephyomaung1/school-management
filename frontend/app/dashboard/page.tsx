"use client";

import React, { useEffect, useState } from "react";
import { getDepartments } from "@/lib/api/departments";
import { getCourses } from "@/lib/api/courses";
import { getTeachers } from "@/lib/api/teacher";
import { getStudents } from "@/lib/api/students";

const DashboardPage = () => {
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [departmentsData, coursesData, teachersData, studentsData] =
          await Promise.all([
            getDepartments(),
            getCourses(),
            getTeachers(),
            getStudents(),
          ]);

        setTotalDepartments(departmentsData.length);
        setTotalCourses(coursesData.length);
        setTotalTeachers(teachersData.length);
        setTotalStudents(studentsData.length);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Departments Card */}
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Departments</h2>
          <p className="text-4xl font-bold text-blue-600">{totalDepartments}</p>
        </div>

        {/* Courses Card */}
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Courses</h2>
          <p className="text-4xl font-bold text-green-600">{totalCourses}</p>
        </div>

        {/* Teachers Card */}
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Teachers</h2>
          <p className="text-4xl font-bold text-purple-600">{totalTeachers}</p>
        </div>

        {/* Students Card */}
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Students</h2>
          <p className="text-4xl font-bold text-pink-600">{totalStudents}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
