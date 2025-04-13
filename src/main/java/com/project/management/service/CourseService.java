package com.project.management.service;

import java.util.List;

import com.project.management.dto.CourseDTO;

public interface CourseService {
    CourseDTO create(CourseDTO course);
    CourseDTO update(CourseDTO course);
    CourseDTO findById(int id);
    List<CourseDTO> getAll();
    void deleteById(int id);
}

