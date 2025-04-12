package com.project.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.management.model.Teacher;

public interface TeacherRepository extends JpaRepository<Teacher, Integer>{
    
}
