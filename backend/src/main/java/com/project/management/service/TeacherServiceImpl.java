package com.project.management.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.management.dto.TeacherDTO;
import com.project.management.model.Course;
import com.project.management.model.Department;
import com.project.management.model.Teacher;
import com.project.management.repository.CourseRepository;
import com.project.management.repository.DepartmentRepository;
import com.project.management.repository.TeacherRepository;
import com.project.management.util.EntityUtils;

@Service
public class TeacherServiceImpl implements TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Override
    public TeacherDTO create(TeacherDTO teacherDTO) {
        Department department = departmentRepository.findById(teacherDTO.getDepartment())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        List<Course> courses = courseRepository.findAllById(teacherDTO.getCourses());
        Teacher teacher = EntityUtils.toTeacher(teacherDTO, department, courses);
        return EntityUtils.toTeacherDTO(teacherRepository.save(teacher));
    }

    @Override
    public TeacherDTO update(TeacherDTO teacherDTO) {
        Teacher existingTeacher = teacherRepository.findById(teacherDTO.getId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        Department department = departmentRepository.findById(teacherDTO.getDepartment())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        List<Course> courses = courseRepository.findAllById(teacherDTO.getCourses());

        existingTeacher.setName(teacherDTO.getName());
        existingTeacher.setEmail(teacherDTO.getEmail());
        existingTeacher.setBirthDate(teacherDTO.getBirthDate());
        existingTeacher.setGender(teacherDTO.getGender());
        existingTeacher.setDepartment(department);
        existingTeacher.setCourses(courses);

        if (teacherDTO.getTeacherImage() != null && !teacherDTO.getTeacherImage().isBlank()) {
            existingTeacher.setTeacherImage(teacherDTO.getTeacherImage());
        }

        Teacher updatedTeacher = teacherRepository.save(existingTeacher);
        return EntityUtils.toTeacherDTO(updatedTeacher);
    }

    @Override
    public TeacherDTO getById(int id) {
        return teacherRepository.findById(id)
                .map(EntityUtils::toTeacherDTO)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
    }

    @Override
    public List<TeacherDTO> getAll() {
        return teacherRepository.findAll()
                .stream()
                .map(EntityUtils::toTeacherDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(int id) {
        teacherRepository.deleteById(id);
    }
}

