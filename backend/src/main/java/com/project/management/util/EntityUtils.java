package com.project.management.util;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.project.management.dto.CourseDTO;
import com.project.management.dto.DepartmentDTO;
import com.project.management.dto.StudentDTO;
import com.project.management.dto.TeacherDTO;
import com.project.management.model.Course;
import com.project.management.model.Department;
import com.project.management.model.Student;
import com.project.management.model.Teacher;

public class EntityUtils {

    public static StudentDTO toStudentDTO(Student student) {
        List<Integer> courseIds = safeList(student.getCourses())
                .stream()
                .map(Course::getId)
                .collect(Collectors.toList());
                
        String imageUrl = "http://localhost:8080/images/" + student.getStudentImage();
        return new StudentDTO(
                student.getId(),
                student.getName(),
                student.getBirthDate(),
                student.getGender(),
                student.getEmail(),
                imageUrl,
                student.getDepartment().getId(),
                courseIds);
    }

    public static Student toStudent(StudentDTO student, Department department, List<Course> courses) {
        return new Student(
                student.getId(),
                student.getName(),
                student.getBirthDate(),
                student.getGender(),
                student.getEmail(),
                student.getStudentImage(),
                department,
                courses);
    }

    public static TeacherDTO toTeacherDTO(Teacher teacher) {
        List<Integer> courseIds = safeList(teacher.getCourses())
                .stream()
                .map(Course::getId)
                .collect(Collectors.toList());

        return new TeacherDTO(
                teacher.getId(),
                teacher.getName(),
                teacher.getEmail(),
                teacher.getBirthDate(),
                teacher.getGender(),
                teacher.getTeacherImage(),
                teacher.getDepartment().getId(),
                courseIds);
    }

    public static Teacher toTeacher(TeacherDTO teacher, Department department, List<Course> courses) {
        return new Teacher(
                teacher.getId(),
                teacher.getName(),
                teacher.getEmail(),
                teacher.getBirthDate(),
                teacher.getTeacherImage(),
                teacher.getGender(),
                department,
                courses);
    }

    public static CourseDTO toCourseDTO(Course course) {
        List<String> students = safeList(course.getStudents())
                .stream()
                .map(Student::getName)
                .collect(Collectors.toList());

        List<String> teachers = safeList(course.getTeachers())
                .stream()
                .map(Teacher::getName)
                .collect(Collectors.toList());

        return new CourseDTO(
                course.getId(),
                course.getName(),
                course.getDescription(),
                course.getDepartment().getId(),
                students,
                teachers);
    }

    public static Course toCourse(CourseDTO dto, Department department, List<Student> students, List<Teacher> teachers) {
        Course course = new Course();
        course.setId(dto.getId());
        course.setName(dto.getName());
        course.setDescription(dto.getDescription());
        course.setDepartment(department);
        course.setStudents(students);
        course.setTeachers(teachers);
        return course;
    }

    public static DepartmentDTO toDepartmentDTO(Department department) {
        List<String> students = safeList(department.getStudents())
                .stream()
                .map(Student::getName)
                .collect(Collectors.toList());

        List<String> teachers = safeList(department.getTeachers())
                .stream()
                .map(Teacher::getName)
                .collect(Collectors.toList());

        List<String> courses = safeList(department.getCourses())
                .stream()
                .map(Course::getName)
                .collect(Collectors.toList());

        return new DepartmentDTO(
                department.getId(),
                department.getDepartmentName(),
                department.getCode(),
                department.getDescription(),
                courses,
                students,
                teachers);
    }

    public static Department toDepartment(DepartmentDTO departmentDTO, List<Course> courses, List<Student> students, List<Teacher> teachers) {
        Department department = new Department();
        department.setId(departmentDTO.getId());
        department.setDepartmentName(departmentDTO.getDepartmentName());
        department.setCode(departmentDTO.getCode());
        department.setDescription(departmentDTO.getDescription());
        department.setCourses(courses);
        department.setStudents(students);
        department.setTeachers(teachers);
        return department;
    }

    // ✅ Null-safe utility for all lists
    private static <T> List<T> safeList(List<T> list) {
        return (list != null) ? list : new ArrayList<>();
    }
}