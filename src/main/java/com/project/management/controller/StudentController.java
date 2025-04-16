package com.project.management.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.project.management.dto.StudentDTO;
import com.project.management.model.Course;
import com.project.management.model.Department;
import com.project.management.model.Gender;
import com.project.management.model.Student;
import com.project.management.repository.CourseRepository;
import com.project.management.repository.DepartmentRepository;
import com.project.management.repository.StudentRepository;
import com.project.management.service.StudentService;
import com.project.management.util.EntityUtils;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<StudentDTO> create(
            @RequestParam String name,
            @RequestParam String birthDate,
            @RequestParam Gender gender,
            @RequestParam String email,
            @RequestParam String departmentName,
            @RequestParam List<String> courseNames,
            @RequestPart MultipartFile image) throws IOException {
        StudentDTO dto = new StudentDTO();
        dto.setName(name);
        dto.setBirthDate(LocalDate.parse(birthDate));
        dto.setGender(gender);
        dto.setEmail(email);
        dto.setDepartmentName(departmentName);
        dto.setCourseNames(courseNames);

        String imageName = saveImage(image);
        dto.setStudentImage(imageName);

        return ResponseEntity.ok(studentService.create(dto));
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<StudentDTO> update(
            @PathVariable int id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) LocalDate birthDate,
            @RequestParam(required = false) Gender gender,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String departmentName,
            @RequestParam(required = false) List<String> courseNames,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) throws IOException {

        // Fetch the student by ID
        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student with ID " + id + " not found"));

        // Update fields if provided
        if (name != null)
            existingStudent.setName(name);
        if (birthDate != null)
            existingStudent.setBirthDate(birthDate);
        if (gender != null)
            existingStudent.setGender(gender);
        if (email != null)
            existingStudent.setEmail(email);

        // If department is provided, update department
        if (departmentName != null) {
            Department department = departmentRepository.findByDepartmentName(departmentName)
                    .orElseThrow(() -> new RuntimeException(
                            "Department with name " + departmentName + " not found"));
            existingStudent.setDepartment(department);
        }

        // If courses are provided, update courses
        if (courseNames != null && !courseNames.isEmpty()) {
            List<Course> courses = courseRepository.findAll().stream()
                    .filter(c -> courseNames.contains(c.getName()))
                    .collect(Collectors.toList());
            existingStudent.setCourses(courses);
        }

        // If a new image is provided, save the image
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageName = saveImage(imageFile);
            existingStudent.setStudentImage(imageName);
        }

        // Save updated student
        Student updatedStudent = studentRepository.save(existingStudent);
        return ResponseEntity.ok(EntityUtils.toStudentDTO(updatedStudent));
    }

    @GetMapping("")
    public ResponseEntity<List<StudentDTO>> getAll() {
        return ResponseEntity.ok(studentService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> getById(@PathVariable int id) {
        return ResponseEntity.ok(studentService.getById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        studentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private String saveImage(MultipartFile file) throws IOException {
        String uploadDir = "uploads/";
        File dir = new File(uploadDir);
        if (!dir.exists())
            dir.mkdirs();

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }
}
