"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDepartment } from "@/lib/api/departments";
import { Toaster, toast } from "sonner"; // ✅ Import Sonner

const CreateDepartmentPage = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    departmentName: "",
    code: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createDepartment(form);

      toast.success("✅ Department created!"); 
      setTimeout(() => {
        router.push("/departments");
      }, 1000);
    } catch (error) {
      console.error("Failed to create department", error);
      toast.error("❌ Error creating department");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen max-w-xl">
      <Toaster position="top-center" richColors />
      
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Create Department</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700" htmlFor="departmentName">Department Name</label>
          <input
            type="text"
            name="departmentName"
            value={form.departmentName}
            onChange={handleChange}
            className="mt-1 w-full border rounded p-2 text-gray-800"
            placeholder="e.g. Computer Science"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700" htmlFor="code">Code</label>
          <input
            type="text"
            name="code"
            value={form.code}
            onChange={handleChange}
            className="mt-1 w-full border rounded p-2 text-gray-800"
            placeholder="e.g. CS101"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700" htmlFor="description">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="mt-1 w-full border rounded p-2 text-gray-800"
            placeholder="e.g. This department focuses on computer science and programming."
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-600"
        >
          {loading ? "Creating..." : "Create Department"}
        </button>
      </form>
    </div>
  );
};

export default CreateDepartmentPage;