package com.project.management.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.management.dto.StudentDTO;
import com.project.management.model.Course;
import com.project.management.model.Department;
import com.project.management.model.Student;
import com.project.management.repository.CourseRepository;
import com.project.management.repository.DepartmentRepository;
import com.project.management.repository.StudentRepository;
import com.project.management.util.EntityUtils;

@Service
public class StudentServiceImpl implements StudentService {

        @Autowired
        private StudentRepository studentRepository;

        @Autowired
        private DepartmentRepository departmentRepository;

        @Autowired
        private CourseRepository courseRepository;

        @Override
        public StudentDTO create(StudentDTO studentDTO) {
                Department department = departmentRepository.findByDepartmentName(studentDTO.getDepartmentName())
                                .orElseThrow(() -> new RuntimeException("Department not found"));

                List<Course> courses = courseRepository.findAll().stream()
                                .filter(course -> studentDTO.getCourseNames().contains(course.getName()))
                                .collect(Collectors.toList());

                Student student = EntityUtils.toStudent(studentDTO, department, courses);
                return EntityUtils.toStudentDTO(studentRepository.save(student));
        }

        @Override
        public StudentDTO update(StudentDTO studentDTO) {
                Student existingStudent = studentRepository.findById(studentDTO.getId())
                                .orElseThrow(() -> new RuntimeException("Student not found"));

                Department department = departmentRepository.findByDepartmentName(studentDTO.getDepartmentName())
                                .orElseThrow(() -> new RuntimeException("Department not found"));

                List<Course> courses = courseRepository.findAll().stream()
                                .filter(c -> studentDTO.getCourseNames().contains(c.getName()))
                                .collect(Collectors.toList());

                existingStudent.setName(studentDTO.getName());
                existingStudent.setBirthDate(studentDTO.getBirthDate());
                existingStudent.setGender(studentDTO.getGender());
                existingStudent.setEmail(studentDTO.getEmail());
                existingStudent.setDepartment(department);
                existingStudent.setCourses(courses);

                if (studentDTO.getStudentImage() != null && !studentDTO.getStudentImage().isBlank()) {
                        existingStudent.setStudentImage(studentDTO.getStudentImage());
                }

                Student updatedStudent = studentRepository.save(existingStudent);
                return EntityUtils.toStudentDTO(updatedStudent);
        }
        

        @Override
        public StudentDTO getById(int id) {
                return studentRepository.findById(id)
                                .map(EntityUtils::toStudentDTO)
                                .orElseThrow(() -> new RuntimeException("Student not found"));
        }

        @Override
        public List<StudentDTO> getAll() {
                return studentRepository.findAll()
                                .stream()
                                .map(EntityUtils::toStudentDTO)
                                .collect(Collectors.toList());
        }

        @Override
        public void deleteById(int id) {
                studentRepository.deleteById(id);
        }
}
