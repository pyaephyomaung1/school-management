package com.project.management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.management.model.Department;

public interface DepartmentRepository extends JpaRepository<Department, Integer>{
    Optional<Department> findByDepartmentName(String departmentName);
}
