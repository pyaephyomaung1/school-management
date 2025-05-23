package com.project.management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.management.dto.CourseDTO;
import com.project.management.service.CourseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/course")
@RequiredArgsConstructor
public class CourseController {

    @Autowired
    private CourseService courseService;

    @PostMapping("/create")
    public ResponseEntity<CourseDTO> create(@RequestBody CourseDTO courseDTO) {
        return ResponseEntity.ok(courseService.create(courseDTO));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CourseDTO> update(@PathVariable int id,@RequestBody CourseDTO courseDTO) {
        courseDTO.setId(id);
        return ResponseEntity.ok(courseService.update(courseDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> findById(@PathVariable int id) {
        return ResponseEntity.ok(courseService.findById(id));
    }

    @GetMapping("")
    public ResponseEntity<List<CourseDTO>> getAll() {
        return ResponseEntity.ok(courseService.getAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        courseService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
}
