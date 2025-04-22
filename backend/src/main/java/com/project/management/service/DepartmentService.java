package com.project.management.service;

import java.util.List;

import com.project.management.dto.DepartmentDTO;

public interface DepartmentService {
    DepartmentDTO create(DepartmentDTO department);
    DepartmentDTO update(DepartmentDTO department);
    DepartmentDTO findById(int id);
    List<DepartmentDTO> getAll();
    void deleteById(int id);
}
