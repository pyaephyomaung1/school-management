package com.project.management.controller;


import com.project.management.dto.TeacherDTO;
import com.project.management.model.Department;
import com.project.management.model.Gender;
import com.project.management.model.Teacher;
import com.project.management.repository.DepartmentRepository;
import com.project.management.repository.TeacherRepository;
import com.project.management.service.TeacherService;
import com.project.management.util.EntityUtils;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private DepartmentRepository departmentRepository;


    @Autowired
    private ImageStore imageStore;

    @GetMapping("")
    public ResponseEntity<List<TeacherDTO>> getAllTeachers() {
        return ResponseEntity.ok(teacherService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeacherDTO> getTeacherById(@PathVariable int id) {
        return ResponseEntity.ok(teacherService.getById(id));
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TeacherDTO> createTeacher(
            @RequestParam String name,
            @RequestParam String birthDate,
            @RequestParam Gender gender,
            @RequestParam String email,
            @RequestParam int department,
            @RequestPart MultipartFile imageFile) throws IOException {

        TeacherDTO dto = new TeacherDTO();
        dto.setName(name);
        dto.setBirthDate(LocalDate.parse(birthDate));
        dto.setGender(gender);
        dto.setEmail(email);
        dto.setDepartment(department);

        String imageName = imageStore.saveImage(imageFile); // You need to implement this
        dto.setTeacherImage(imageName);

        return ResponseEntity.ok(teacherService.create(dto));
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TeacherDTO> update(
        @PathVariable int id,
        @RequestParam(required = false)String name,
        @RequestParam(required = false)String email,
        @RequestParam(required = false)String birthdate,
        @RequestParam(required = false)Gender gender,
        @RequestParam(required =false)Integer department,
        @RequestPart(value = "image", required = false) MultipartFile imageFile) throws IOException
    {
        Teacher existingTeacher = teacherRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Teacher with ID " + id + " not found"));
        if (name != null)
        existingTeacher.setName(name);
    if (birthdate != null)
        existingTeacher.setBirthDate(LocalDate.parse(birthdate));
    if (gender != null)
        existingTeacher.setGender(gender);
    if (email != null)
        existingTeacher.setEmail(email);

    if (department != null) {
        Department dept = departmentRepository.findById(department)
                .orElseThrow(() -> new RuntimeException("Department with ID " + department + " not found"));
        existingTeacher.setDepartment(dept);
    }

    if (imageFile != null && !imageFile.isEmpty()) {
        String imageName = imageStore.saveImage(imageFile);
        existingTeacher.setTeacherImage(imageName);
    }

    Teacher updatedTeacher = teacherRepository.save(existingTeacher);
    return ResponseEntity.ok(EntityUtils.toTeacherDTO(updatedTeacher));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable int id) {
        teacherService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
