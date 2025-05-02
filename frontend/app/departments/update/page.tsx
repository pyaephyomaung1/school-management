"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getDepartmentById, updateDepartment } from "@/lib/api/departments";
import { toast, Toaster } from "sonner";

const EditDepartmentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");

  const [form, setForm] = useState({
    departmentName: "",
    code: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch existing department data
  useEffect(() => {
    const loadDepartment = async () => {
      if (!idParam) return;
      try {
        const data = await getDepartmentById(Number(idParam));
        setForm({
          departmentName: data.departmentName,
          code: data.code,
          description: data.description,
        });
      } catch (error) {
        console.error("Failed to load department", error);
        toast.error("Failed to load department data");
      } finally {
        setFetching(false);
      }
    };

    loadDepartment();
  }, [idParam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idParam) return;
    setLoading(true);

    try {
      await updateDepartment(Number(idParam), form);
      toast.success("Department updated successfully!");
      setTimeout(() => {
        router.push("/departments");
      }, 1000);
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update department");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-gray-800 p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4" />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen max-w-xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Edit Department</h1>
      <Toaster position="top-center" richColors />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700" htmlFor="departmentName">
            Department Name
          </label>
          <input
            type="text"
            name="departmentName"
            value={form.departmentName}
            onChange={handleChange}
            className="mt-1 w-full border rounded p-2 text-gray-800"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700" htmlFor="code">
            Code
          </label>
          <input
            type="text"
            name="code"
            value={form.code}
            onChange={handleChange}
            className="mt-1 w-full border rounded p-2 text-gray-800"
            required
          />
        </div>

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

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-600"
        >
          {loading ? "Updating..." : "Update Department"}
        </button>
      </form>
    </div>
  );
};

export default EditDepartmentPage;