package com.project.management.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.management.dto.DepartmentDTO;
import com.project.management.model.Department;
import com.project.management.repository.DepartmentRepository;
import com.project.management.util.EntityUtils;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public DepartmentDTO create(DepartmentDTO departmentDTO) {
        Department department = EntityUtils.toDepartment(departmentDTO, new ArrayList<>(), new ArrayList<>(), new ArrayList<>());
        Department saved = departmentRepository.save(department);
        return EntityUtils.toDepartmentDTO(saved);
    }

    @Override
    public DepartmentDTO update(DepartmentDTO departmentDTO) {
        Department existing = departmentRepository.findById(departmentDTO.getId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
        existing.setDepartmentName(departmentDTO.getDepartmentName());
        existing.setCode(departmentDTO.getCode());
        existing.setDescription(departmentDTO.getDescription());
        Department updated = departmentRepository.save(existing);
        return EntityUtils.toDepartmentDTO(updated);
    }

    @Override
    public DepartmentDTO findById(int id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        return EntityUtils.toDepartmentDTO(department);
    }

    @Override
    public List<DepartmentDTO> getAll() {
        return departmentRepository.findAll()
                .stream()
                .map(EntityUtils::toDepartmentDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(int id) {
        departmentRepository.deleteById(id);
    }
}
