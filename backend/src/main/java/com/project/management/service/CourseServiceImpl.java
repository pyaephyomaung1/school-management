package com.project.management.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.management.dto.CourseDTO;
import com.project.management.model.Course;
import com.project.management.model.Department;
import com.project.management.repository.CourseRepository;
import com.project.management.repository.DepartmentRepository;
import com.project.management.util.EntityUtils;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public CourseDTO create(CourseDTO courseDTO) {
        Department department = departmentRepository.findById(courseDTO.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        Course course = new Course();
        course.setName(courseDTO.getName());
        course.setDescription(courseDTO.getDescription());
        course.setDepartment(department);

        Course saved = courseRepository.save(course);
        return EntityUtils.toCourseDTO(saved);
    }

    @Override
    public CourseDTO update(CourseDTO courseDTO) {
        Course existing = courseRepository.findById(courseDTO.getId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        existing.setName(courseDTO.getName());
        existing.setDescription(courseDTO.getDescription());

        Department department = departmentRepository.findById(courseDTO.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        existing.setDepartment(department);

        Course updated = courseRepository.save(existing);
        return EntityUtils.toCourseDTO(updated);
    }

    @Override
    public CourseDTO findById(int id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return EntityUtils.toCourseDTO(course);
    }

    @Override
    public List<CourseDTO> getAll() {
        return courseRepository.findAll()
                .stream()
                .map(EntityUtils::toCourseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(int id) {
        courseRepository.deleteById(id);
    }

}
