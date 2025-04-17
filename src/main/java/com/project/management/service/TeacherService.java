package com.project.management.service;

import java.util.List;


import com.project.management.dto.TeacherDTO;

public interface TeacherService {
    TeacherDTO create(TeacherDTO teacher);
    TeacherDTO update(TeacherDTO teacher);
    TeacherDTO getById(int id);
    List<TeacherDTO> getAll();
    void deleteById(int id);
}
