package com.project.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.management.model.Course;

public interface CourseRepository extends JpaRepository<Course,Integer>{
    
}
