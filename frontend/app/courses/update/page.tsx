"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateCourse, getCourseById } from "@/lib/api/courses";
import { getDepartments } from "@/lib/api/departments";
import { Department } from "@/types/department";

type FormState = {
  name: string;
  description: string;
  departmentId: string;
};

const UpdateCoursePage = ({ params }: { params: { id: string } }) => {
  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    departmentId: "",
  });
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Helper to get department name by ID
  const getDepartmentName = (departmentId: number | null | undefined) => {
    if (!departmentId) return "-";
    return (
      departments.find((dept) => dept.id === departmentId)?.departmentName || "-"
    );
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const courseId = Number(params.id);
        const courseData = await getCourseById(courseId);

        setForm({
          name: courseData.name || "",
          description: courseData.description || "",
          departmentId: courseData.departmentId ? String(courseData.departmentId) : "",
        });

        const departmentData = await getDepartments();
        setDepartments(departmentData);
      } catch (err) {
        console.error("Failed to load course or departments:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.departmentId) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      await updateCourse(Number(params.id), {
        name: form.name,
        description: form.description,
        departmentId: Number(form.departmentId),
      });

      alert("Course updated successfully!");
      router.push("/courses");
    } catch (err) {
      console.error("Failed to update course:", err);
      alert("Failed to update course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-800 p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-lg font-semibold animate-pulse">Loading...</p>
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
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Update Course</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium" htmlFor="name">
            Course Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium" htmlFor="departmentId">
            Department <span className="text-red-500">*</span>
          </label>

          {/* Show current department name */}
          {form.departmentId && (
            <p className="text-sm text-gray-600 mb-1">
              Current:{" "}
              <span className="font-medium text-gray-800">
                {getDepartmentName(Number(form.departmentId))}
              </span>
            </p>
          )}

          {/* Dropdown to select new department */}
          <select
            id="departmentId"
            name="departmentId"
            value={form.departmentId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.departmentName}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          {loading ? "Updating..." : "Update Course"}
        </button>
      </form>
    </div>
  );
};

export default UpdateCoursePage;
