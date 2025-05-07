"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Student } from "@/types/student";
import { getStudentById, updateStudent } from "@/lib/api/students";
import { getDepartments } from "@/lib/api/departments";
import { getCourses } from "@/lib/api/courses";
import { Department } from "@/types/department";
import { Course } from "@/types/course";

const StudentEditPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Validate ID
  const studentId = Number(id);
  if (isNaN(studentId)) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center text-red-600">
          <h2 className="text-2xl font-semibold">Error: Invalid Student ID</h2>
          <p>The provided student ID is invalid. Please check the URL and try again.</p>
        </div>
      </div>
    );
  }

  const [student, setStudent] = useState<Student | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [studentData, departmentsData, coursesData] = await Promise.all([
          getStudentById(studentId),
          getDepartments(),
          getCourses()
        ]);
        
        setStudent(studentData);
        setDepartments(departmentsData);
        setAllCourses(coursesData);
        if (studentData.studentImage) {
          setImagePreview(studentData.studentImage);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        setError("Failed to load student data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [studentId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    setIsSubmitting(true);
    try {
      await updateStudent(studentId, {
        name: student.name,
        birthDate: student.birthDate,
        gender: student.gender,
        email: student.email,
        department: student.department,
        courses: student.courses || [],
        image: selectedImage || undefined
      });
      router.push('/students');
    } catch (error) {
      console.error("Failed to update student:", error);
      setError("Failed to update student. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCourseToggle = (courseId: number) => {
    if (student) {
      const updatedCourses = student.courses?.includes(courseId)
        ? student.courses.filter(id => id !== courseId)
        : [...(student.courses || []), courseId];
      setStudent({ ...student, courses: updatedCourses });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-lg font-semibold text-gray-700">Loading student data...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center items-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Edit Student</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        
        {student && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload Section */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative w-32 h-32 mb-4">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Student"
                    className="w-full h-full object-cover rounded-full border-2 border-gray-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                >
                  {imagePreview ? 'Change Image' : 'Select Image'}
                </button>
              </div>
            </div>

            {/* Student Information Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={student.name}
                  onChange={(e) => setStudent({ ...student, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="birthDate" className="block text-gray-700 font-medium mb-2">
                  Birth Date *
                </label>
                <input
                  id="birthDate"
                  type="date"
                  value={student.birthDate}
                  onChange={(e) => setStudent({ ...student, birthDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-gray-700 font-medium mb-2">
                  Gender *
                </label>
                <select
                  id="gender"
                  value={student.gender}
                  onChange={(e) => setStudent({ ...student, gender: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={student.email}
                  onChange={(e) => setStudent({ ...student, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="department" className="block text-gray-700 font-medium mb-2">
                  Department *
                </label>
                <select
                  id="department"
                  value={student.department}
                  onChange={(e) => setStudent({ ...student, department: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            </div>

            {/* Courses Selection */}
            <div className="mt-4">
              <label className="block text-gray-900 font-medium mb-2">Courses</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {allCourses.map((course) => (
                  <div key={course.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`course-${course.id}`}
                      checked={student.courses?.includes(course.id) || false}
                      onChange={() => handleCourseToggle(course.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`course-${course.id}`}>{course.name}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Updating...
                  </span>
                ) : (
                  'Update Student'
                )}
              </button>
            </div>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => router.push('/students')}
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

export default StudentEditPage;