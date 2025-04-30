"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteDepartment, getDepartments } from "@/lib/api/departments";
import type { Department } from "@/types/department";

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (error) {
        console.error("Failed to load departments:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, []);

  const handleAddDepartment = () => {
    router.push("/departments/create");
  }

  const handleDeleteDepartment = async (id: number) => {
    if (confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment(id);
        setDepartments(departments.filter((dept) => dept.id !== id));
      } catch (error) {
        console.error("Failed to delete department:", error);
      }
    }
  }
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-800 p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4" />
        <p className="text-lg font-semibold animate-pulse">
          Loading courses...
        </p>
      </div>
    );

  return (
    <div className="p-6 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
          <p className="text-gray-500 mt-1">
            {departments.length} department{departments.length !== 1 ? "s" : ""}{" "}
            found
          </p>
        </div>
        <button onClick={handleAddDepartment} type="button" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-600">
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
          Add Department
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr className="text-gray-600 uppercase text-sm tracking-wider">
              <th className="p-4 font-semibold">ID</th>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Code</th>
              <th className="p-4 font-semibold">Description</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, index) => (
              <tr
                key={dept.id}
                className={`border-b ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50 transition`}
              >
                <td className="p-4 text-gray-800">{dept.id}</td>
                <td className="p-4 text-gray-800">{dept.departmentName}</td>
                <td className="p-4 text-gray-800">{dept.code}</td>
                <td className="p-4 text-gray-800">{dept.description}</td>
                <td className="p-4 text-gray-800 gap-4 flex">
                  <button className="text-blue-600 hover:text-blue-800">
                    Edit
                  </button>
                  <button className="ml-2 text-red-600 hover:text-red-800" onClick={() => handleDeleteDepartment(dept.id)}>
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

export default DepartmentsPage;
