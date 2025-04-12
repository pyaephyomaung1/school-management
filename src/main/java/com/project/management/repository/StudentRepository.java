package com.project.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.management.model.Student;

public interface StudentRepository extends JpaRepository<Student, Integer>{
    
}
