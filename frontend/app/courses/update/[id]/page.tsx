"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Course } from "@/types/course";
import { getCourseById, updateCourse } from "@/lib/api/courses";

const CourseEditPage = () => {
  const router = useRouter();
  const { id } = useParams();

  // Ensure the `id` is valid
  const courseId = Number(id);
  if (isNaN(courseId)) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center text-red-600">
          <h2 className="text-2xl font-semibold">Error: Invalid Course ID</h2>
          <p>The provided course ID is invalid. Please check the URL and try again.</p>
        </div>
      </div>
    );
  }

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const data = await getCourseById(courseId);
        setCourse(data);
      } catch (error) {
        console.error("Failed to load course:", error);
        setError("Failed to load course data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (course) {
      try {
        await updateCourse(courseId, {
          name: course.name,
          description: course.description,
          departmentId: Number(course.departmentId),
        });
        router.push(`/courses`);
      } catch (error) {
        console.error("Failed to update course:", error);
        setError("Failed to update course. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-lg font-semibold text-gray-700">Loading course data...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center items-center py-12 px-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Edit Course</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {course && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Course Name
              </label>
              <input
                id="name"
                type="text"
                value={course.name}
                onChange={(e) => setCourse({ ...course, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter course name"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={course.description}
                onChange={(e) => setCourse({ ...course, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter course description"
                rows={4}
                required
              />
            </div>

            <div className="mb-6">
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                Update Course
              </button>
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/courses')}
                className="text-sm text-blue-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CourseEditPage;
