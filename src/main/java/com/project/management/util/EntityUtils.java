package com.project.management.util;

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
        List<String> courses = student.getCourses().stream().map(Course::getName).collect(Collectors.toList());
        return new StudentDTO(
                student.getId(),
                student.getName(),
                student.getBirthDate(),
                student.getGender(),
                student.getEmail(),
                student.getStudentImage(),
                student.getDepartment().getDepartmentName(),
                courses);
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
        List<String> courses = teacher.getCourses()
                .stream()
                .map(Course::getName)
                .collect(Collectors.toList());

        return new TeacherDTO(
                teacher.getId(),
                teacher.getName(),
                teacher.getEmail(),
                teacher.getBirthDate(),
                teacher.getGender(),
                teacher.getTeacherImage(),
                teacher.getDepartment().getDepartmentName(),
                courses);
    }

    public static Teacher toTeahcer(TeacherDTO teacher, Department department, List<Course> courses) {
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
        List<String> students = course.getStudents().stream().map(Student::getName).collect(Collectors.toList());
        List<String> teachers = course.getTeachers().stream().map(Teacher::getName).collect(Collectors.toList());
        return new CourseDTO(
                course.getId(),
                course.getName(),
                course.getDescription(),
                course.getDepartment().getDepartmentName(),
                students,
                teachers);
    }

    public static Course toCourse(CourseDTO dto, Department department, List<Student> students,
            List<Teacher> teachers) {
        Course course = new Course();
        course.setId(dto.getId());
        course.setName(dto.getName());
        course.setDescription(dto.getDescription());
        course.setDepartment(department);
        course.setStudents(students);
        course.setTeachers(teachers);
        return course;
    }

    public static DepartmentDTO toDepartmentDTO(Department department){
        List<String> students = department.getStudents().stream().map(Student::getName).collect(Collectors.toList());
        List<String> teachers = department.getTeachers().stream().map(Teacher::getName).collect(Collectors.toList());
        return new DepartmentDTO(
            department.getId(),
            department.getDepartmentName(),
            department.getCode(),
            department.getDescription(),
            students,
            teachers
        );
    }
    
    public static Department toDepartment(DepartmentDTO departmentDTO,Course course, List<Student> students, List<Teacher> teachers){
        Department department = new Department();
        department.setId(departmentDTO.getId());
        department.setDepartmentName(departmentDTO.getDepartmentName());
        department.setCode(departmentDTO.getCode());
        department.setDepartmentName(departmentDTO.getDescription());
        
        return department;
    }

}
