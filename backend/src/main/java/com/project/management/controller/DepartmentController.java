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

import com.project.management.dto.DepartmentDTO;
import com.project.management.service.DepartmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/department")
@RequiredArgsConstructor
public class DepartmentController {
    @Autowired
    private DepartmentService departmentService;

    @PostMapping("/create")
    public ResponseEntity<DepartmentDTO> create(@RequestBody DepartmentDTO department){
        return ResponseEntity.ok(departmentService.create(department));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<DepartmentDTO> update( @PathVariable int id , @RequestBody DepartmentDTO dto) {
        dto.setId(id);
        return ResponseEntity.ok(departmentService.update(dto));
    }

    @GetMapping("")
    public ResponseEntity<List<DepartmentDTO>> getAll(){
        return ResponseEntity.ok(departmentService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartmentDTO> findById(@PathVariable int id){
        return ResponseEntity.ok(departmentService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id){
        departmentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
