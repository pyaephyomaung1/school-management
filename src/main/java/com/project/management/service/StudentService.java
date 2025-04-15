package com.project.management.service;

import java.util.List;

import com.project.management.dto.StudentDTO;

public interface StudentService {
    StudentDTO create(StudentDTO student);
    StudentDTO update(StudentDTO student);
    StudentDTO getById(int id);
    List<StudentDTO> getAll();
    void deleteById(int id);
}
