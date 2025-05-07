'use client'
import {useEffect, useState} from "react";
import { Teacher } from "@/types/teacher";
import { Department } from "@/types/department";
import { Course } from "@/types/course";
import {useRouter} from "next/navigation";
import { getDepartments } from "@/lib/api/departments";
import { getCourses } from "@/lib/api/courses";
import {deleteTeacher, getTeachers} from "@/lib/api/teacher";

const TeacherPage = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [departmentNames, setDepartmentNames] = useState<Record<number, string>>({});
    const [courseNames, setCourseNames] = useState<Record<number, string>>({});

    const handleAddTeacher = () => {
        router.push("/teachers/create");
    };

    const handleEditTeacher = (id: number) => {
        router.push(`/teachers/update/${id}`);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this teacher?")) {
            try {
                await deleteTeacher(id);
                setTeachers(teachers.filter((teacher) => teacher.id !== id));
                alert("Teacher deleted successfully");
            } catch (error) {
                console.error("Failed to delete teacher:", error);
                alert("Failed to delete teacher. Please try again.");
            }
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const [teachersData, departmentsData, coursesData] = await Promise.all([
                    getTeachers(),
                    getDepartments(),
                    getCourses(),
                ]);
                
                setTeachers(teachersData);
                setDepartments(departmentsData);
                setCourses(coursesData);
                
                // Create lookup objects for department and course names
                const deptMap = departmentsData.reduce((acc, dept) => {
                    acc[dept.id] = dept.departmentName;
                    return acc;
                }, {} as Record<number, string>);
                
                const courseMap = coursesData.reduce((acc, course) => {
                    acc[course.id] = course.name;
                    return acc;
                }, {} as Record<number, string>);
                
                setDepartmentNames(deptMap);
                setCourseNames(courseMap);
                
            } catch (error) {
                console.error("Failed to load data:", error);
                setError("Failed to load data. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if(loading) {
        return(
            <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-800 p-6">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-lg font-semibold animate-pulse">
                    Loading teachers...
                </p>
            </div>
        )
    }

    if(error) {
        return(
            <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 p-6">
                <p className="text-red-500">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <div className="p-6 min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Teachers</h1>
                    <p className="text-gray-500 mt-1">
                        {teachers.length} teacher{teachers.length !== 1 ? "s" : ""} found
                    </p>
                </div>
                <button
                    onClick={handleAddTeacher}
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
                    Add Teacher
                </button>
            </div>

            {teachers.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
                    <p className="text-gray-500 mb-4">No teachers found</p>
                    <button
                        onClick={handleAddTeacher}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Create Your First Teacher
                    </button>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50">
                        <tr className="text-gray-600 uppercase text-sm tracking-wider">
                            <th className="p-4 font-semibold">ID</th>
                            <th className="p-4 font-semibold">Image</th>
                            <th className="p-4 font-semibold">Name</th>
                            <th className="p-4 font-semibold">Birth Date</th>
                            <th className="p-4 font-semibold">Gender</th>
                            <th className="p-4 font-semibold">Email</th>
                            <th className="p-4 font-semibold">Department</th>
                            <th className="p-4 font-semibold">Courses</th>
                            <th className="p-4 font-semibold">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {teachers.map((teacher, index) => (
                            <tr
                                key={teacher.id}
                                className={`border-b ${
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                } hover:bg-blue-50 transition`}
                            >
                                <td className="p-4 text-gray-800">{teacher.id}</td>
                                <td className="p-4">
                                    {teacher.teacherImage ? (
                                        <img
                                            src={teacher.teacherImage}
                                            alt="Teacher"
                                            className="w-16 h-16 object-cover rounded-full"
                                        />
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="p-4 text-gray-800">{teacher.name}</td>
                                <td className="p-4 text-gray-800">
                                    {teacher.birthDate || "-"}
                                </td>
                                <td className="p-4 text-gray-800">{teacher.gender || "-"}</td>
                                <td className="p-4 text-gray-800">{teacher.email || "-"}</td>
                                <td className="p-4 text-gray-800">
                                    {departmentNames[teacher.department] || "-"}
                                </td>
                                <td className="p-4 text-gray-800">
                                    {teacher.courses?.map((courseId) => (
                                        <div key={courseId}>{courseNames[courseId] || "-"}</div>
                                    )) || "-"}
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleEditTeacher(teacher.id)}
                                            className="text-gray-200 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 hover:text-gray-100 transition-colors duration-200 text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(teacher.id)}
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
    )
}

export default TeacherPage;