package com.project.management.dto;

import java.util.List;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentDTO {
    private int id;
    private String departmentName;
    private String code;
    private String description;
    private List<String> courses;
    private List<String> studentNames;
    private List<String> teacherNames;
}
