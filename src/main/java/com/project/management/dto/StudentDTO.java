package com.project.management.dto;

import java.time.LocalDate;
import java.util.List;

import com.project.management.model.Gender;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {
    private int id;
    private String name;
    private LocalDate birthDate;
    private Gender gender;
    private String email;
    private String studentImage;
    private int department;
    private List<Integer> courses;
}
