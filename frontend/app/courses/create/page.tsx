"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDepartments } from "@/lib/api/departments";
import { createCourse } from "@/lib/api/courses";
import { toast } from "sonner";

// Define consistent Department type
interface Department {
  id: number;
  name: string;
}

interface CourseForm {
  name: string;
  description: string;
  departmentId: string; // stays string for form select
}

const CreateCoursePage = () => {
  const router = useRouter();

  const [form, setForm] = useState<CourseForm>({
    name: "",
    description: "",
    departmentId: "",
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);

  // Load departments
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await getDepartments();

        // Map to consistent Department type
        const mapped: Department[] = data.map((dept: any) => ({
          id: dept.id,
          name: dept.departmentName,
        }));

        setDepartments(mapped);
      } catch (error) {
        console.error("Failed to load departments", error);
        toast.error("Failed to load departments");
      }
    };

    loadDepartments();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.departmentId) {
      toast.error("Name and Department are required");
      return;
    }

    setLoading(true);
    try {
      await createCourse({
        name: form.name,
        description: form.description,
        departmentId: Number(form.departmentId), // send as number
      });
      toast.success("Course created successfully!");
      setTimeout(() => {
        router.push("/courses");
      }, 1000);
    } catch (error) {
      console.error("Create failed", error);
      toast.error("Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen max-w-xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Create Course</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-700" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full border rounded p-2 text-gray-800"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700" htmlFor="description">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="mt-1 w-full border rounded p-2 text-gray-800"
            rows={3}
          />
        </div>

        {/* Department Selection */}
        <div>
          <label className="block text-gray-700" htmlFor="departmentId">
            Department
          </label>
          <select
            name="departmentId"
            value={form.departmentId}
            onChange={handleChange}
            className="mt-1 w-full border rounded p-2 text-gray-800"
            required
          >
            <option value="">Select a department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-600"
        >
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default CreateCoursePage;