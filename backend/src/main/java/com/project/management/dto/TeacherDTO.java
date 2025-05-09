package com.project.management.dto;

import java.time.LocalDate;

import com.project.management.model.Gender;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherDTO {
    private int id;
    private String name;
    private String email;
    private LocalDate birthDate;
    private Gender gender;
    private String teacherImage;
    private int department;
}
